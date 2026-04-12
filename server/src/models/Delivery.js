import mongoose from "mongoose"

const deliverySchema = new mongoose.Schema({
  pickups: [{ type: mongoose.Schema.Types.ObjectId, ref: "Pickup" }],
  warehouse: { type: mongoose.Schema.Types.ObjectId, ref: "Location" },
  home: { type: mongoose.Schema.Types.ObjectId, ref: "Location" },
  deliveryComplete: {
    type: Boolean,
    default: false,
  },
}, { timestamps: true });

export default mongoose.model("Delivery", deliverySchema);