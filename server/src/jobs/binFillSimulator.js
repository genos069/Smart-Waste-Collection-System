import Bin from "../models/Bin.js";
import { PICKUP_THRESHOLD } from "../config/collection.js";
// Optimistic compare-and-set prevents overwriting a concurrent collection/unload.
export async function simulateBinFill(random = Math.random) {
  const bins = await Bin.find({ $or: [{ status: { $ne: "collected" } }, { dumpedAt: { $type: "date" } }, { collectedBy: { $exists: false } }] }).lean();
  for (const bin of bins) {
    const fillLevel = Math.min(100, Math.max(0, Number(bin.fillLevel) || 0) + Math.floor(random() * 15));
    await Bin.updateOne({ _id: bin._id, fillLevel: bin.fillLevel, status: bin.status, updatedAt: bin.updatedAt }, {
      $set: { fillLevel, status: fillLevel >= PICKUP_THRESHOLD ? "active" : "idle" },
      $unset: { collectedBy: 1, dumpedAt: 1 },
    });
  }
}
export function startBinSimulator(intervalMs = 60000) {
  let stopped = false, timer;
  const tick = async () => {
    try { await simulateBinFill(); } catch (err) { console.error("Bin simulation failed:", err.name); }
    if (!stopped) timer = setTimeout(tick, intervalMs);
  };
  timer = setTimeout(tick, intervalMs);
  return () => { stopped = true; clearTimeout(timer); };
}
