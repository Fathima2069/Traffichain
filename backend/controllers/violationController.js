const Violation = require("../models/Violation");

const getViolations = async (req, res) => {
  try {
    const violations = await Violation.find();

    const updatedViolations = await Promise.all(
      violations.map(async (v) => {
        const count = await Violation.countDocuments({
          vehicleNumber: v.vehicleNumber,
        });

        return {
          ...v._doc,
          isBlacklisted: count >= 3,
        };
      })
    );

    res.json(updatedViolations);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

module.exports = { getViolations };