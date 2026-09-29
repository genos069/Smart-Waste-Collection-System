import mongoose from "mongoose";
import Location from "../models/Location.js";
import Truck from "../models/Truck.js";
import { coordinates, text, batch, HttpError } from "../utils/validation.js";
export async function seedLocations(req, res) {
  const items = batch(req.body).map((item) => {
    if (!["bmc", "dumpyard"].includes(item?.type)) throw new HttpError(400, "Location type must be bmc or dumpyard");
    return { name: text(item.name, "Location name"), type: item.type, ...coordinates(item.lat, item.lng) };
  });
  if (new Set(items.map((item) => item.type)).size !== items.length) throw new HttpError(400, "Duplicate location types in request");
  const locations = await mongoose.connection.transaction(async (session) => {
    if (await Truck.exists({ status: { $in: ["collecting", "returning"] } }).session(session)) throw new HttpError(409, "Finish active trips before changing service locations");
    const saved = [];
    for (const item of items) saved.push(await Location.findOneAndUpdate({ type: item.type }, { $set: item }, { session, upsert: true, new: true, runValidators: true }));
    return saved;
  });
  res.json(locations);
}
