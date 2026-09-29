import { Router } from "express";
import { seedLocations } from "../controllers/locationController.js";
import { protect, allowRoles } from "../middleware/auth.js";
const router = Router();
router.post("/seed/locations", protect, allowRoles("admin"), seedLocations);
export default router;
