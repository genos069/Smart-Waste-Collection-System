import { Router } from "express";
import authRoutes from "./authRoutes.js";
import userRoutes from "./userRoutes.js";
import binRoutes from "./binRoutes.js";
import collectionRoutes from "./collectionRoutes.js";
import locationRoutes from "./locationRoutes.js";
import taskRoutes from "./taskRoutes.js";
import truckRoutes from "./truckRoutes.js";

const router = Router();
router.use(authRoutes);
router.use(userRoutes);
router.use(binRoutes);
router.use(collectionRoutes);
router.use(locationRoutes);
router.use(taskRoutes);
router.use(truckRoutes);
router.get("/health", (req, res) => res.json({ msg: "Server is Running" }));
export default router;
