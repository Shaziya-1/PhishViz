const mongoose = require("mongoose");

const PhishingURLSchema = new mongoose.Schema({
  url: {
    type: String,
    required: true
  },
  label: {
    type: Number,
    required: true
  }
});

module.exports = mongoose.model("PhishingURL", PhishingURLSchema);
