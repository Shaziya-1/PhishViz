const express = require("express");
const router = express.Router();
const PhishingURL = require("../models/PhishingURL");
const AttackLog = require("../models/AttackLog");

router.get("/metrics", async (req, res) => {
  try {
    const totalThreats = await PhishingURL.countDocuments({ label: 1 });
    const blockedThreats = totalThreats; // simulated prevention
    const activeAlerts = totalThreats > 100 ? 1 : 0;

    const geoData = await AttackLog.find({}).limit(10);

    res.json({
      totalThreats,
      blockedThreats,
      activeAlerts,
      geoData,
    });
  } catch (err) {
    res.status(500).json({ error: "Dashboard data fetch failed" });
  }
});

module.exports = router;
