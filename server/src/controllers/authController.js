import Admin from "../models/Admin.js";
import bcrypt from "bcrypt";
import crypto from "node:crypto";
import jwt from "jsonwebtoken";

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const admin = await Admin.findOne({ email });

    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    // create reset token
    const resetToken = crypto.randomBytes(32).toString("hex");

    // hash token before saving
    const hashedToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    admin.resetPasswordToken = hashedToken;
    admin.resetPasswordExpire = Date.now() + 10 * 60 * 1000; // 10 min

    await admin.save();


    // In real app: send email
    res.status(200).json({
      success: true,
      message: "Reset token generated",
      resetToken, // send only in dev
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    const admin = await Admin.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!admin) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    admin.password = await bcrypt.hash(newPassword, 10);
    admin.resetPasswordToken = undefined;
    admin.resetPasswordExpire = undefined;

    await admin.save();


    res.status(200).json({
      success: true,
      message: "Password reset successful",
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const check = await Admin.findOne({ email });
    if (!check) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, check.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // create token (JWT)
    const token = jwt.sign(
      { id: check._id, type: check.type },
      process.env.JWT_SECRET,
      { expiresIn: "7d" },
    );

    // 🔥 SEND COOKIE HERE
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      success: true,
      message: "Login successful",
      user: {
        id: check._id,
        name: check.firstName,
        type: check.type,
      },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const logout = (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  });
  res.json({ message: "Logged out" });
};

export const getMe = (req, res) => {
  res.json({ user: { id: req.user._id, name: req.user.firstName, type: req.user.type } });
};
