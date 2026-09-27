import { Router } from "express";
import { updateCollectionStatus, collectBin } from "../controllers/collectionController.js";
import { protect, allowRoles } from "../middleware/auth.js";
const router = Router();
router.post("/update-status", protect, allowRoles("driver"), updateCollectionStatus);
router.post("/collect-bin", protect, allowRoles("driver"), collectBin);
export default router;
