const mongoose = require("mongoose");

const stationSchema = new mongoose.Schema({
  stationName: String,
  location: String,
  officers: [String]
});

module.exports = mongoose.model("Station", stationSchema);