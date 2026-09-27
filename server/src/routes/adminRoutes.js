import { Router } from "express";
import { createAdmin, getAllAdmins, getAdminById, updateAdmin, deleteAdmin } from "../controllers/adminController.js";
import { protect, isAdmin } from "../middlewares/auth.js";

const router = Router();

router.get("/allAdmins", protect, isAdmin, getAllAdmins);
router.get("/adminsById/:id", protect, isAdmin, getAdminById);
router.post("/createAdmins", protect, isAdmin, createAdmin);
router.put("/updateAdmin/:id", protect, isAdmin, updateAdmin);
router.delete("/deleteAdmin/:id", protect, isAdmin, deleteAdmin);

export default router;
