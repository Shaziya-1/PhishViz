const csv = require("csvtojson");
const mongoose = require("mongoose");
const path = require("path");

const connectDB = require("../config/db");
const PhishingURL = require("../models/PhishingURL");
const AttackLog = require("../models/AttackLog");

const importData = async () => {
  try {
    await connectDB();

    const urlsPath = path.join(__dirname, "../../data/processed/cleaned_urls.csv");
    const geoPath  = path.join(__dirname, "../../data/processed/geo_attack_summary.csv");

    const urls = await csv().fromFile(urlsPath);
    const geo  = await csv().fromFile(geoPath);

    await PhishingURL.deleteMany({});
    await AttackLog.deleteMany({});

    await PhishingURL.insertMany(urls);
    await AttackLog.insertMany(geo);

    console.log("✅ Data Imported to MongoDB");
    process.exit();
  } catch (err) {
    console.error("❌ Import failed:", err);
    process.exit(1);
  }
};

importData();
