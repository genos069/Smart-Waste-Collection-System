import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { env } from "../config/env.js";
import { HttpError } from "../utils/validation.js";
export async function protect(req, res, next) {
  const token = req.cookies?.token;
  if (!token) throw new HttpError(401, "Not logged in");
  let decoded;
  try { decoded = jwt.verify(token, env.jwtSecret, { algorithms: ["HS256"] }); }
  catch { throw new HttpError(401, "Invalid or expired token"); }
  if (!decoded || typeof decoded !== "object" || !/^[a-f0-9]{24}$/i.test(decoded.id)) throw new HttpError(401, "Invalid token");
  // Database failures propagate as server errors, not misleading login failures.
  const user = await User.findById(decoded.id).select("+sessionVersion");
  if (!user || (decoded.version || 0) !== (user.sessionVersion || 0)) throw new HttpError(401, "Session expired. Please log in again.");
  req.user = user;
  next();
}
export const allowRoles = (...roles) => (req, res, next) => {
  if (!roles.includes(req.user?.type)) throw new HttpError(403, "You do not have permission for this action");
  next();
};
