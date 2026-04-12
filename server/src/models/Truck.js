import mongoose from "mongoose"

const truckSchema = new mongoose.Schema({
  name: {
    type: String,
    default: "Truck 1",
  },

  currentLocation: {
    lat: Number,
    lng: Number,
  },

  status: {
    type: String,
    enum: ["idle", "collecting", "dumping"],
    default: "idle",
  },

  lastUpdated: Date,
}, { timestamps: true });

export default mongoose.model("Truck", truckSchema);