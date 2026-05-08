const mongoose = require("mongoose");

const vehicleSchema = new mongoose.Schema({
  username: String,
  vehicleNumber: String,
  vehicleType: String,
  ownerName: String,
  model: String,
  color: String
});

module.exports = mongoose.model("Vehicle", vehicleSchema);