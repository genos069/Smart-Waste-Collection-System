import { Router } from "express";
import { createBin, collectBin, seedBins, getAllBins, deleteBin, deleteAllBins } from "../controllers/binController.js";
import { protect, isAdmin } from "../middlewares/auth.js";

const router = Router();

router.post("/pickups", createBin);
router.post("/collect-bin", collectBin);
router.post("/seed/bins", seedBins);
router.get("/allBins", protect, isAdmin, getAllBins);
router.delete("/deleteBin/:id", protect, isAdmin, deleteBin);
router.delete("/deleteAllBins", protect, isAdmin, deleteAllBins);

export default router;
