import Bin from "../models/Bin.js";
import Truck from "../models/Truck.js";
import Location from "../models/Location.js";
import { normalizeBins, mapBinsToPickups } from "../utility/mapper.js";
import { formatLocation } from "../utility/locationFormatter.js";

export const getTasks = async (req, res) => {
  try {
    const bins = await Bin.find();
    const truck = await Truck.findOne();
    const locations = await Location.find();

    const cleanBins = normalizeBins(bins);

    const pickups = mapBinsToPickups(cleanBins);

    const allCollected =
      cleanBins.length > 0 &&
      cleanBins.every(bin => bin.status === "collected");

    const bmcRaw = locations.find(l => l.type === "bmc");
    const dumpRaw = locations.find(l => l.type === "dumpyard");

    let bmc = formatLocation(bmcRaw);
    let dumpyard = formatLocation(dumpRaw);

    if (!bmc) {
      bmc = {
        id: "home",
        name: "BMC",
        lat: 19.35771665060258,
        lng: 84.87176961437474,
        status: "available",
      };
    }

    if (!dumpyard) {
      dumpyard = {
        id: "warehouse",
        name: "Dumpyard",
        lat: 19.36082352496522,
        lng: 84.8673264133152,
        status: "locked",
      };
    }

    const warehouseStatus = allCollected ? "available" : "locked";

    dumpyard.status = warehouseStatus;

    const deliveryComplete =
      allCollected && dumpRaw?.status === "completed";

    res.json({
      home: bmc,

      warehouse: {
        ...dumpyard,
        status: warehouseStatus,
      },

      pickups,

      liveLocation: truck?.currentLocation || null,

      deliveryComplete,

      routeOrder: pickups,

      nextTarget: pickups[0] || null,
    });

  } catch (error) {
    console.error("GET TASKS ERROR:", error);
    res.status(500).json({ error: "Server error" });
  }
};