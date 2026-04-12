import mongoose from "mongoose"

const historySchema = new mongoose.Schema({
  type: String,
  message: String,
}, { timestamps: true });

export default mongoose.model("History", historySchema);