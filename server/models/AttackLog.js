const mongoose = require("mongoose");

const AttackLogSchema = new mongoose.Schema({
  country: {
    type: String,
    required: true
  },
  attack_count: {
    type: Number,
    required: true
  }
});

module.exports = mongoose.model("AttackLog", AttackLogSchema);
