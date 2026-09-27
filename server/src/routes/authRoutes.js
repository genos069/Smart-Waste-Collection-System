import { Router } from "express";
import { loginAdmin, forgotPassword, resetPassword, logout, getMe } from "../controllers/authController.js";
import { protect } from "../middlewares/auth.js";

const router = Router();

router.post("/login", loginAdmin);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
router.post("/logout", logout);
router.get("/me", protect, getMe);

export default router;
