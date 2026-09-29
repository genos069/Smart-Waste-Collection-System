import mongoose from "mongoose";
const truckSchema = new mongoose.Schema({
  driver: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  name: { type: String, default: "Collection truck" },
  currentLocation: {
    lat: { type: Number, min: -90, max: 90 },
    lng: { type: Number, min: -180, max: 180 },
  },
  status: { type: String, enum: ["idle", "collecting", "returning"], default: "idle" },
  // Snapshot of eligible bins on the first pickup. New fills belong to the next trip.
  pickupIds: [{ type: mongoose.Schema.Types.ObjectId, ref: "Bin" }],
  lastUpdated: Date,
  lastDumpedAt: Date,
  lastCompletedAt: Date,
}, { timestamps: true });
// Legacy unassigned trucks are retained but cannot be overwritten by a driver.
truckSchema.index({ driver: 1 }, { unique: true, partialFilterExpression: { driver: { $type: "objectId" } } });
export default mongoose.model("Truck", truckSchema);
