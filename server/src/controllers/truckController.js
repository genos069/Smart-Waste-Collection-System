import Truck from "../models/Truck.js"

export const updateLocation = async (req, res) => {
  const { lat, lng } = req.body;

  let truck = await Truck.findOne();

  if (!truck) {
    truck = await Truck.create({
      currentLocation: { lat, lng },
      lastUpdated: new Date()
    });
  } else {
    truck.currentLocation = { lat, lng };
    truck.lastUpdated = new Date();
    await truck.save();
  }

  res.json({ ok: true, liveLocation: truck.currentLocation });
};