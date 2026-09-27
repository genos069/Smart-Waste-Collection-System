import mongoose from "mongoose";
const locationSchema = new mongoose.Schema({
  revision: { type: Number, default: 0, select: false },
  name: { type: String, required: true, trim: true, maxlength: 120 },
  type: { type: String, enum: ["bmc", "dumpyard"], required: true, unique: true },
  lat: { type: Number, required: true, min: -90, max: 90 },
  lng: { type: Number, required: true, min: -180, max: 180 },
}, { timestamps: true });
export default mongoose.model("Location", locationSchema);
