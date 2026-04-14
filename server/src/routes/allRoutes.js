import express from "express";
const router = express.Router();

import { getTasks } from "../controllers/taskController.js";
import {
  createBin,
  collectBin,
  seedBins,
  deleteBin,
  deleteAllBins,
  getAllBins,
} from "../controllers/binController.js";
import { updateLocation } from "../controllers/truckController.js";
import { updateStatus } from "../controllers/workflowController.js";
import { seedLocations } from "../controllers/locationController.js";
import {
  getAllAdmins,
  getAdminById,
  deleteAdmin,
  updateAdmin,
  createAdmin,
  forgotPassword,
  resetPassword,
  loginAdmin,
} from "../controllers/adminController.js";

import { protect, isAdmin, isDriver, getMe } from "../middlewares/auth.js";

router.get("/tasks", getTasks);

router.post("/pickups", createBin);
router.post("/update-status", updateStatus);
router.post("/collect-bin", collectBin);
router.post("/location", updateLocation);

router.post("/seed/bins", seedBins);
router.post("/seed/locations", seedLocations);

router.get("/allBins", protect, isAdmin, getAllBins);
router.get("/allAdmins", protect, isAdmin, getAllAdmins);
router.get("/adminsById/:id", protect, isAdmin, getAdminById);

router.delete("/deleteBin/:id", protect, isAdmin, deleteBin);
router.delete("/deleteAllBins", protect, isAdmin, deleteAllBins);
router.delete("/deleteAdmin/:id", protect, isAdmin, deleteAdmin);
router.put("/updateAdmin/:id", protect, isAdmin, updateAdmin);

router.post("/createAdmins", protect, isAdmin, createAdmin);

// AUTH ROUTES (FIXED)
router.post("/login", loginAdmin);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

router.post("/logout", (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: false, // same as login
    sameSite: "none",
  });

  res.json({ message: "Logged out" });
});

// ADD THIS (IMPORTANT)
router.get("/me", protect, getMe);

export default router;
