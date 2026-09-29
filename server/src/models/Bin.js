import mongoose from "mongoose";
const binSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, maxlength: 120 },
  coordinates: {
    type: { type: String, enum: ["Point"], required: true },
    coordinates: { type: [Number], required: true, validate: {
      validator: (v) => v.length === 2 && v.every(Number.isFinite) && Math.abs(v[0]) <= 180 && Math.abs(v[1]) <= 90,
      message: "Coordinates must be [longitude, latitude] within valid ranges",
    } },
  },
  fillLevel: { type: Number, default: 0, min: 0, max: 100 },
  status: { type: String, enum: ["idle", "active", "collected"], default: "idle" },
  lastEmptiedAt: Date,
  collectedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  dumpedAt: Date,
}, { timestamps: true });
binSchema.index({ collectedBy: 1, status: 1, dumpedAt: 1 });
export default mongoose.model("Bin", binSchema);
