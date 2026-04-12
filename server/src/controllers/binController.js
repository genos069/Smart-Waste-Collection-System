import Bin from "../models/Bin.js"

export const createBin = async (req, res) => {
  const bin = await Bin.create(req.body);
  res.json(bin);
};

export const seedBins = async (req, res) => {
  const bins = await Bin.insertMany(req.body);
  res.json(bins);
};

export const collectBin = async (req, res) => {
  const { id } = req.body;

  const bin = await Bin.findById(id);

  if (!bin) {
    return res.status(404).json({ error: "Bin not found" });
  }

  bin.fillLevel = 0;
  bin.status = "collected";
  bin.lastEmptiedAt = new Date();

  await bin.save();

  return res.json({ ok: true, bin });
};