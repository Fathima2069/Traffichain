const mongoose = require("mongoose");

const VehicleSchema = new mongoose.Schema({
  username: { type: String, required: true },
  vehicleNumber: { type: String, required: true },
  vehicleType: { type: String, required: true },
});

module.exports = mongoose.model("Vehicle", VehicleSchema);