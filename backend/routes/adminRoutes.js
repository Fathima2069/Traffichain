const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Violation = require("../models/Violation");


// Create Police Account
router.post("/create-police", async (req, res) => {
    try {
        const { username, password, station } = req.body;

        const police = new User({
            username: username,
            password: password,
            role: "police",
            station: station
        });

        await police.save();

        res.json({
            message: "Police account created successfully"
        });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


// Get All Violations
router.get("/violations", async (req, res) => {
    try {
        const violations = await Violation.find();
        res.json(violations);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


// Admin Dashboard Data
router.get("/dashboard", async (req, res) => {
    try {
        res.json({
            totalViolations: 120,
            paid: 70,
            unpaid: 50,
            revenue: 35000
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;