import mongoose from "mongoose";
const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true, trim: true, maxlength: 120 },
  lastName: { type: String, trim: true, maxlength: 120, default: "" },
  type: { type: String, enum: ["admin", "driver"], default: "driver" },
  email: { type: String, required: true, trim: true, lowercase: true, maxlength: 254 },
  password: { type: String, required: true, select: false },
  resetPasswordToken: { type: String, select: false },
  resetPasswordExpire: { type: Date, select: false },
  managementRevision: { type: Number, default: 0, select: false },
  sessionVersion: { type: Number, default: 0, select: false },
}, { timestamps: true });
userSchema.index({ email: 1 }, { unique: true, collation: { locale: "en", strength: 2 }, name: "email_case_insensitive" });
// Preserve existing accounts; a file/model rename must not change the collection.
export default mongoose.model("User", userSchema, "admins");
