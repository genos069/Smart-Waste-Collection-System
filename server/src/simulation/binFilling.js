import Bin from "../models/Bin.js"

export const simulateBinFill = async () => {
  const bins = await Bin.find();

  for (let bin of bins) {
    if (bin.status === "collected") {
      bin.fillLevel = 0;
      bin.status = "idle";
    }

    const increase = Math.floor(Math.random() * 15);
    bin.fillLevel = Math.min(100, bin.fillLevel + increase);

    if (bin.fillLevel >= 70) {
      bin.status = "active";
    } else {
      bin.status = "idle";
    }

    await bin.save();
  }
};