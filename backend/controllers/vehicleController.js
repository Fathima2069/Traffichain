const Vehicle = require("../models/Vehicle"); // ✅ HERE

exports.addVehicle = async (req, res) => {
  try {
    console.log("BODY:", req.body);

    const vehicle = await Vehicle.create(req.body);

    console.log("SAVED:", vehicle);

    res.json(vehicle);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error saving vehicle" });
  }
};