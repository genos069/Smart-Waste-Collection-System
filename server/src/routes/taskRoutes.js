import { Router } from "express";
import { getTasks } from "../controllers/taskController.js";
import { protect, allowRoles } from "../middleware/auth.js";
const router = Router();
router.get("/tasks", protect, allowRoles("driver"), getTasks);
export default router;
