const express = require("express");
const router = express.Router();

const { addVehicle } = require("../controllers/vehicleController");

router.post("/vehicles", addVehicle);

module.exports = router;