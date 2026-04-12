import Location from "../models/Location.js";

export const seedLocations = async (req, res) => {
  const locations = await Location.insertMany(req.body);
  res.json(locations);
};