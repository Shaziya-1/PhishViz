import PhishingURL from "../models/PhishingURL.js";
import AttackLog from "../models/AttackLog.js";

export const getDashboardMetrics = async (req, res) => {
  try {
    const totalThreats = await PhishingURL.countDocuments();
    const highRiskUrls = await PhishingURL.countDocuments({ riskLevel: "High" });
    const blockedAttempts = await AttackLog.countDocuments({ blocked: true });
    const activeAlerts = await AttackLog.countDocuments({ severity: "Critical" });

    res.json({
      totalThreats,
      highRiskUrls,
      blockedAttempts,
      activeAlerts,
    });
  } catch (err) {
    res.status(500).json({ error: "Dashboard metrics error" });
  }
};
