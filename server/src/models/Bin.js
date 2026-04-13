import mongoose from "mongoose";

const binSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    coordinates: {
      type: {
        type: String,
        enum: ["Point"],
        required: true,
      },
      coordinates: {
        type: [Number],
        required: true,
      },
    },

    fillLevel: {
      type: Number,
      default: 0,
    },

    status: {
      type: String,
      enum: ["idle", "active", "collected"],
      default: "idle",
    },

    lastEmptiedAt: Date,
  },
  { timestamps: true },
);

export default mongoose.model("Bin", binSchema);
