import mongoose from "mongoose";
import Bin from "../models/Bin.js";
import Location from "../models/Location.js"

export const updateStatus = async (req, res) => {

  const { type, id } = req.body || {};

  if (!type) {
    return res.status(400).json({ error: "type is required" });
  }

  try {
    if (type === "pickup") {
      let bin = null;

      if (mongoose.Types.ObjectId.isValid(id)) {
        bin = await Bin.findById(id);
      }

      if (!bin) {
        return res.status(404).json({ error: "Bin not found" });
      }

      const coords = bin.coordinates?.coordinates || [0, 0];

      bin.fillLevel = 0;
      bin.status = "collected";
      bin.lastEmptiedAt = new Date();

      await bin.save();

      return res.json({
        ok: true,
        pickup: {
          id: bin._id,
          name: bin.name,
          lat: coords[1],
          lng: coords[0],
          status: "picked"
        }
      });
    }

    if (type === "warehouse") {
      const dumpyard = await Location.findOne({ type: "dumpyard" });

      if (!dumpyard) {
        return res.status(404).json({ error: "Dumpyard not found" });
      }

      dumpyard.status = "completed";
      await dumpyard.save();

      return res.json({
        ok: true,
        warehouse: {
          id: dumpyard._id,
          name: dumpyard.name,
          lat: dumpyard.lat ?? 0,
          lng: dumpyard.lng ?? 0,
          status: "completed"
        },
        deliveryComplete: true
      });
    }

    if (type === "home") {
      const bmc = await Location.findOne({ type: "bmc" });

      return res.json({
        ok: true,
        home: {
          id: bmc?._id || "home",
          name: bmc?.name || "BMC",
          lat: bmc?.lat ?? 0,
          lng: bmc?.lng ?? 0,
          status: "completed"
        }
      });
    }

    return res.status(400).json({ error: "Invalid type" });

  } catch (err) {
    console.error("🔥 UPDATE STATUS ERROR:", err);

    res.status(500).json({
      error: err.message,
      stack: err.stack
    });
  }
};