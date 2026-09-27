import { Router } from "express";
import authRoutes from "./authRoutes.js";
import adminRoutes from "./adminRoutes.js";
import binRoutes from "./binRoutes.js";
import taskRoutes from "./taskRoutes.js";
import truckRoutes from "./truckRoutes.js";
import locationRoutes from "./locationRoutes.js";
import workflowRoutes from "./workflowRoutes.js";

const router = Router();

// Preserve existing /api endpoint paths while grouping routes by feature.
router.use(authRoutes);
router.use(adminRoutes);
router.use(binRoutes);
router.use(taskRoutes);
router.use(truckRoutes);
router.use(locationRoutes);
router.use(workflowRoutes);
router.get("/health", (req, res) => res.json({ msg: "Server is Running" }));

export default router;
