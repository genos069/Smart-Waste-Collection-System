import mongoose from "mongoose";

const locationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  type: {
    type: String,
    enum: ["bmc", "dumpyard"],
    required: true,
  },
  lat: Number,
  lng: Number,
  status: String,
});

// Enforce only one BMC
locationSchema.index({ type: 1 }, { unique: true });

export default mongoose.model("Location", locationSchema);
