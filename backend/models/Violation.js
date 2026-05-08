const mongoose = require("mongoose");

const violationSchema = new mongoose.Schema({
  username: String,   // user who owns vehicle

  vehicleNumber: String,
  location: String,
  description: String,
  image: String,

  status: {
    type: String,
    default: "Pending"
  },

  fineAmount: {
    type: Number,
    default: 100
  },

  createdAt: {
    type: Date,
    default: Date.now
  },

  deadline: {
    type: Date
  }
});

module.exports = mongoose.model("Violation", violationSchema);