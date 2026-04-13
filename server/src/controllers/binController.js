import Bin from "../models/Bin.js"

export const createBin = async (req, res) => {
  try {
    const { name, lat, lng } = req.body;

    if (!name || lat === undefined || lng === undefined) {
      return res.status(400).json({
        message: "Name, lat and lng are required",
      });
    }

    const bin = await Bin.create({
      name,
      coordinates: {
        type: "Point",
        coordinates: [parseFloat(lng), parseFloat(lat)],
      },
    });

    res.status(201).json({
      success: true,
      data: bin,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
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

export const getAllBins = async (req, res) => {
  try {
    const bins = await Bin.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: bins.length,
      data: bins,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};


export const deleteBin = async (req, res) => {
  try {
    const bin = await Bin.findByIdAndDelete(req.params.id);

    if (!bin) {
      return res.status(404).json({
        message: "Bin not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Bin deleted successfully",
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

export const deleteAllBins = async (req, res) => {
  try {
    const result = await Bin.deleteMany({});

    res.status(200).json({
      success: true,
      message: "All bins deleted successfully",
      deletedCount: result.deletedCount,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};