import User from "../models/User.js";
import bcrypt from "bcrypt";
import crypto from "node:crypto";
import jwt from "jsonwebtoken";
import { env, cookieOptions } from "../config/env.js";
import { email, password, HttpError } from "../utils/validation.js";
import { sendPasswordReset, resetDeliveryAvailable } from "../services/passwordResetEmail.js";
const digest = (value) => crypto.createHash("sha256").update(value).digest("hex");
const publicUser = (user) => ({ id: user._id, name: user.firstName, type: user.type });

export async function login(req, res) {
  const address = email(req.body?.email);
  const value = req.body?.password;
  if (typeof value !== "string" || !value || Buffer.byteLength(value) > 72) throw new HttpError(400, "Password is required and must not exceed 72 UTF-8 bytes");
  const user = await User.findOne({ email: address }).collation({ locale: "en", strength: 2 }).select("+password +sessionVersion");
  if (!user || !await bcrypt.compare(value, user.password)) throw new HttpError(401, "Invalid credentials");
  const token = jwt.sign({ id: user._id, type: user.type, version: user.sessionVersion || 0 }, env.jwtSecret, { expiresIn: "7d", algorithm: "HS256" });
  res.cookie("token", token, { ...cookieOptions(), maxAge: 7 * 24 * 60 * 60 * 1000 });
  res.json({ success: true, message: "Login successful", user: publicUser(user) });
}
export async function forgotPassword(req, res) {
  const address = email(req.body?.email);
  if (!resetDeliveryAvailable()) throw new HttpError(503, "Password reset email is not configured");
  const token = crypto.randomBytes(32).toString("hex");
  const hash = digest(token);
  const user = await User.findOneAndUpdate({ email: address }, { $set: { resetPasswordToken: hash, resetPasswordExpire: new Date(Date.now() + 600000) } }, { new: true, collation: { locale: "en", strength: 2 } });
  if (user) {
    try { await sendPasswordReset(user.email, token); }
    catch (err) {
      await User.updateOne({ _id: user._id, resetPasswordToken: hash }, { $unset: { resetPasswordToken: 1, resetPasswordExpire: 1 } });
      throw err;
    }
  }
  res.json({ success: true, message: "If the account exists, password reset instructions have been sent.", ...(user && env.nodeEnv !== "production" && env.exposeResetToken ? { resetToken: token } : {}) });
}
export async function resetPassword(req, res) {
  const token = req.body?.token;
  if (typeof token !== "string" || !/^[a-f0-9]{64}$/i.test(token)) throw new HttpError(400, "Invalid or expired token");
  const hashedPassword = await bcrypt.hash(password(req.body?.newPassword), 12);
  // Consume once atomically; concurrent reset attempts cannot reuse the token.
  const user = await User.findOneAndUpdate({ resetPasswordToken: digest(token), resetPasswordExpire: { $gt: new Date() } }, {
    $set: { password: hashedPassword }, $unset: { resetPasswordToken: 1, resetPasswordExpire: 1 }, $inc: { sessionVersion: 1 },
  });
  if (!user) throw new HttpError(400, "Invalid or expired token");
  res.clearCookie("token", cookieOptions());
  res.json({ success: true, message: "Password reset successful. Please log in again." });
}
export const logout = (req, res) => { res.clearCookie("token", cookieOptions()); res.json({ message: "Logged out" }); };
export const getMe = (req, res) => res.json({ user: publicUser(req.user) });
