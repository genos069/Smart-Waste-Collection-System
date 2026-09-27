import mongoose from "mongoose";
import bcrypt from "bcrypt";
import User from "../models/User.js";
import Truck from "../models/Truck.js";
import { text, email, password, role, objectId, HttpError } from "../utils/validation.js";
const publicUser = (user) => ({ _id: user._id, firstName: user.firstName, lastName: user.lastName, email: user.email, type: user.type, createdAt: user.createdAt, updatedAt: user.updatedAt });
function fields(body, partial = false) {
  const result = {};
  if (!partial || body.firstName !== undefined) result.firstName = text(body.firstName, "First name");
  if (body.lastName !== undefined) {
    if (typeof body.lastName !== "string" || body.lastName.length > 120) throw new HttpError(400, "Invalid last name");
    result.lastName = body.lastName.trim();
  }
  if (!partial || body.email !== undefined) result.email = email(body.email);
  if (!partial || body.type !== undefined) result.type = role(body.type === undefined ? "driver" : body.type);
  if (partial && !Object.keys(result).length) throw new HttpError(400, "No editable fields supplied");
  return result;
}
export async function createUser(req, res) {
  const data = fields(req.body || {});
  const user = await User.create({ ...data, password: await bcrypt.hash(password(req.body?.password), 12) });
  res.status(201).json({ success: true, data: publicUser(user) });
}
export async function listUsers(req, res) {
  const users = await User.find().sort({ createdAt: -1 });
  res.json({ success: true, count: users.length, data: users.map(publicUser) });
}
export async function getUser(req, res) {
  const user = await User.findById(objectId(req.params.id));
  if (!user) throw new HttpError(404, "User not found");
  res.json({ success: true, data: publicUser(user) });
}
// Touch the acting admin in the transaction so concurrent cross-deletion/demotion conflicts.
async function manageUser(actor, id, action) {
  return mongoose.connection.transaction(async (session) => {
    const admin = await User.findOneAndUpdate({ _id: actor, type: "admin" }, { $inc: { managementRevision: 1 } }, { session });
    if (!admin) throw new HttpError(403, "Administrator access required");
    const truck = await Truck.findOne({ driver: id }).session(session);
    if (truck && truck.status !== "idle") throw new HttpError(409, "Finish this driver's active trip before changing their role or deleting them");
    return action(session);
  });
}
export async function updateUser(req, res) {
  const id = objectId(req.params.id);
  const data = fields(req.body || {}, true);
  if (id === String(req.user._id) && data.type && data.type !== "admin") throw new HttpError(409, "You cannot demote your own admin account");
  const update = (session) => User.findByIdAndUpdate(id, { $set: data }, { new: true, runValidators: true, session });
  const user = data.type ? await manageUser(req.user._id, id, update) : await update(undefined);
  if (!user) throw new HttpError(404, "User not found");
  res.json({ success: true, data: publicUser(user) });
}
export async function deleteUser(req, res) {
  const id = objectId(req.params.id);
  if (id === String(req.user._id)) throw new HttpError(409, "You cannot delete your own admin account");
  await manageUser(req.user._id, id, async (session) => {
    const user = await User.findByIdAndDelete(id, { session });
    if (!user) throw new HttpError(404, "User not found");
    await Truck.deleteOne({ driver: id }, { session });
  });
  res.json({ success: true, message: "User deleted successfully" });
}
