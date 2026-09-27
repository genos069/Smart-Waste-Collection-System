import { Router } from "express";
import { seedLocations } from "../controllers/locationController.js";

const router = Router();

router.post("/seed/locations", seedLocations);

export default router;
