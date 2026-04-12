import mongoose from "mongoose"

const locationSchema = new mongoose.Schema({
  name: String,
  type: {
    type: String,
    enum: ["bmc", "dumpyard"],
  },
  lat: Number,
  lng: Number,
  status: String,
});

export default mongoose.model("Location", locationSchema);