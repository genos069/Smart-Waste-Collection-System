import Bin from "../models/Bin.js";
import Truck from "../models/Truck.js";
import Location from "../models/Location.js";
import { taskState } from "../utils/collectionState.js";
export async function getTasks(req, res) {
  const [bins, truck, locations] = await Promise.all([
    Bin.find().lean(), Truck.findOne({ driver: req.user._id }).lean(), Location.find().lean(),
  ]);
  res.json(taskState(bins, truck, locations, req.user._id));
}
