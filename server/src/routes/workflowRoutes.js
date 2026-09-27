import { Router } from "express";
import { updateStatus } from "../controllers/workflowController.js";

const router = Router();

router.post("/update-status", updateStatus);

export default router;
