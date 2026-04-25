const Violation = require("../models/Violation");

const checkBlacklist = async (vehicleNumber) => {
  const count = await Violation.countDocuments({ vehicleNumber });
  return count >= 3;
};

module.exports = { checkBlacklist };