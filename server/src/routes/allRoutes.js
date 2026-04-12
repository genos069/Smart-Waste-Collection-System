import express from "express"
const router = express.Router();

import { getTasks } from "../controllers/taskController.js";
import { createBin, collectBin, seedBins } from "../controllers/binController.js";
import { updateLocation } from "../controllers/truckController.js";
import { updateStatus } from "../controllers/workflowController.js";
import { seedLocations } from "../controllers/locationController.js";

router.get("/tasks", getTasks);

router.post("/pickups", createBin);
router.post("/update-status", updateStatus);
router.post("/collect-bin", collectBin);
router.post("/location", updateLocation);

router.post("/seed/bins", seedBins);
router.post("/seed/locations", seedLocations);

export default router;