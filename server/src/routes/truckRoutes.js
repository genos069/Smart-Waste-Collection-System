import { Router } from "express";
import { updateLocation } from "../controllers/truckController.js";
import { protect, allowRoles } from "../middleware/auth.js";
const router = Router();
router.post("/location", protect, allowRoles("driver"), updateLocation);
export default router;
