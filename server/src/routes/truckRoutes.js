import { Router } from "express";
import { updateLocation } from "../controllers/truckController.js";

const router = Router();

router.post("/location", updateLocation);

export default router;
