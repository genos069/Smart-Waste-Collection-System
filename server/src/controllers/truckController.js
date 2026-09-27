import Truck from "../models/Truck.js";
import { coordinates } from "../utils/validation.js";
export async function updateLocation(req, res) {
  const currentLocation = coordinates(req.body?.lat, req.body?.lng);
  const truck = await Truck.findOneAndUpdate({ driver: req.user._id }, { $set: { currentLocation, lastUpdated: new Date() }, $setOnInsert: { driver: req.user._id } }, { upsert: true, new: true, runValidators: true });
  res.json({ ok: true, liveLocation: truck.currentLocation });
}
