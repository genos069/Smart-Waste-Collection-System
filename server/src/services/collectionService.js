import mongoose from "mongoose";
import Bin from "../models/Bin.js";
import Truck from "../models/Truck.js";
import Location from "../models/Location.js";
import { PICKUP_THRESHOLD, PROXIMITY_METERS, LOCATION_MAX_AGE_MS } from "../config/collection.js";
import { HttpError, objectId } from "../utils/validation.js";
import { destination, binPickup, validPoint, distanceMeters } from "../utils/collectionState.js";

export function requireProximity(truck, point, now = Date.now()) {
  if (!validPoint(point)) throw new HttpError(409, "The destination has no valid coordinates");
  if (!validPoint(truck?.currentLocation) || !truck.lastUpdated || !Number.isFinite(new Date(truck.lastUpdated).getTime()) || now - new Date(truck.lastUpdated).getTime() > LOCATION_MAX_AGE_MS) throw new HttpError(409, "Send a fresh GPS location before completing this action");
  if (distanceMeters(truck.currentLocation, point) > PROXIMITY_METERS) throw new HttpError(409, `Move within ${PROXIMITY_METERS} metres of the destination`);
}

export async function completeCollectionAction(driver, type, id) {
  if (!["pickup", "warehouse", "home"].includes(type)) throw new HttpError(400, "Type must be pickup, warehouse or home");
  if (type === "pickup") objectId(id);
  return mongoose.connection.transaction(async (session) => {
    const truck = await Truck.findOne({ driver }).session(session);
    if (!truck) throw new HttpError(409, "Send your GPS location before starting a trip");
    const locations = await Location.find().session(session);
    const home = destination(locations.find((l) => l.type === "bmc"));
    const warehouse = destination(locations.find((l) => l.type === "dumpyard"));
    if (!home || !warehouse) throw new HttpError(409, "Configure valid BMC and dumpyard locations first");
    // Serialize configuration changes with trip actions so a destination cannot move mid-trip.
    await Location.updateMany({ type: { $in: ["bmc", "dumpyard"] } }, { $inc: { revision: 1 } }, { session });

    if (type === "pickup") {
      if (truck.status === "returning") throw new HttpError(409, "Return to BMC before starting the next trip");
      const bin = await Bin.findById(id).session(session);
      if (!bin) throw new HttpError(404, "Bin not found");
      // Retrying the same successful pickup must not empty the bin twice.
      if (bin.status === "collected" && String(bin.collectedBy) === String(driver) && !bin.dumpedAt) return { ok: true, bin, pickup: binPickup(bin) };
      if (bin.status === "collected" || bin.fillLevel < PICKUP_THRESHOLD) throw new HttpError(409, "Bin is not awaiting pickup");
      const pickup = binPickup(bin);
      requireProximity(truck, pickup);
      if (truck.status === "idle") {
        const eligible = await Bin.find({ status: { $ne: "collected" }, fillLevel: { $gte: PICKUP_THRESHOLD } }).session(session);
        truck.pickupIds = eligible.filter((item) => binPickup(item)).map((item) => item._id);
      }
      if (!truck.pickupIds.some((value) => String(value) === id)) throw new HttpError(409, "Bin belongs to a later trip");
      bin.fillLevel = 0; bin.status = "collected"; bin.lastEmptiedAt = new Date(); bin.collectedBy = driver; bin.dumpedAt = undefined;
      truck.status = "collecting";
      await bin.save({ session });
      await truck.save({ session });
      return { ok: true, bin, pickup: binPickup(bin) };
    }

    if (type === "warehouse") {
      if (truck.status === "returning") return { ok: true, warehouse: { ...warehouse, status: "completed" }, deliveryComplete: true };
      if (truck.status !== "collecting") throw new HttpError(409, "No active collection trip");
      requireProximity(truck, warehouse);
      const pending = await Bin.exists({ _id: { $in: truck.pickupIds }, status: { $ne: "collected" }, fillLevel: { $gte: PICKUP_THRESHOLD } }).session(session);
      if (pending) throw new HttpError(409, "Collect the remaining bins in this trip before unloading");
      const result = await Bin.updateMany({ collectedBy: driver, status: "collected", dumpedAt: null }, { $set: { dumpedAt: new Date() } }, { session });
      if (!result.modifiedCount) throw new HttpError(409, "No collected waste to unload");
      truck.status = "returning"; truck.lastDumpedAt = new Date();
      await truck.save({ session });
      return { ok: true, warehouse: { ...warehouse, status: "completed" }, deliveryComplete: true };
    }

    if (truck.status !== "returning") throw new HttpError(409, "Unload at the dumpyard before completing the trip");
    requireProximity(truck, home);
    truck.status = "idle"; truck.pickupIds = []; truck.lastCompletedAt = new Date();
    await truck.save({ session });
    return { ok: true, home: { ...home, status: "completed" }, deliveryComplete: true };
  });
}
