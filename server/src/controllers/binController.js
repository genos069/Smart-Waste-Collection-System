import Bin from "../models/Bin.js";
import { coordinates, text, objectId, batch, HttpError } from "../utils/validation.js";
import { PICKUP_THRESHOLD } from "../config/collection.js";
function inputBin(input, seed = false) {
  if (seed && (input?.coordinates?.type !== "Point" || !Array.isArray(input?.coordinates?.coordinates) || input.coordinates.coordinates.length !== 2)) throw new HttpError(400, "Seed coordinates must be a GeoJSON Point [longitude, latitude]");
  const { lat, lng } = coordinates(seed ? input?.coordinates?.coordinates?.[1] : input?.lat, seed ? input?.coordinates?.coordinates?.[0] : input?.lng);
  const fillLevel = seed && input.fillLevel !== undefined ? input.fillLevel : 0;
  if (typeof fillLevel !== "number" || !Number.isFinite(fillLevel) || fillLevel < 0 || fillLevel > 100) throw new HttpError(400, "Fill level must be between 0 and 100");
  return { name: text(input?.name, "Bin name"), coordinates: { type: "Point", coordinates: [lng, lat] }, fillLevel, status: fillLevel >= PICKUP_THRESHOLD ? "active" : "idle" };
}
// Undelivered cargo is never deleted, even if it changes concurrently with a delete request.
const removable = { $or: [{ status: { $ne: "collected" } }, { dumpedAt: { $type: "date" } }, { collectedBy: { $exists: false } }] };
export async function createBin(req, res) { const bin = await Bin.create(inputBin(req.body)); res.status(201).json({ success: true, data: bin }); }
export async function seedBins(req, res) {
  const bins = batch(req.body).map((item) => inputBin(item, true));
  res.status(201).json(await Bin.insertMany(bins));
}
export async function getAllBins(req, res) {
  const bins = await Bin.find().sort({ createdAt: -1 });
  res.json({ success: true, count: bins.length, data: bins });
}
export async function deleteBin(req, res) {
  const id = objectId(req.params.id);
  const bin = await Bin.findOneAndDelete({ _id: id, ...removable });
  if (!bin) {
    if (await Bin.exists({ _id: id })) throw new HttpError(409, "Unload this bin's collected waste before deleting it");
    throw new HttpError(404, "Bin not found");
  }
  res.json({ success: true, message: "Bin deleted successfully" });
}
export async function deleteAllBins(req, res) {
  const result = await Bin.deleteMany(removable);
  const protectedCount = await Bin.countDocuments({ status: "collected", collectedBy: { $exists: true }, dumpedAt: null });
  res.json({ success: true, message: protectedCount ? "Removed eligible bins; undelivered cargo was preserved" : "All bins deleted successfully", deletedCount: result.deletedCount, protectedCount });
}
