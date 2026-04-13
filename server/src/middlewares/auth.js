import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import Admin from "../models/Admin.js";

export const protect = async (req, res, next) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({ message: "Not logged in" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await Admin.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    req.user = user;
    next();
  } catch (err) {
    res.status(401).json({ message: "Invalid token" });
  }
};

export const isAdmin = (req, res, next) => {
  if (req.user.type !== "admin") {
    return res.status(403).json({ message: "Admins only" });
  }
  next();
};

export const isDriver = (req, res, next) => {
  if (req.user.type !== "driver") {
    return res.status(403).json({ message: "Drivers only" });
  }
  next();
};

export const getMe = async (req, res) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({ message: "No token" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    res.json({
      user: decoded, // or fetch from DB
    });
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
};
