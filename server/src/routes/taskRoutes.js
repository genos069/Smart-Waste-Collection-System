import { Router } from "express";
import { getTasks } from "../controllers/taskController.js";

const router = Router();

router.get("/tasks", getTasks);

export default router;
