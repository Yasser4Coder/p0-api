const mongoose = require("mongoose");

const videoSettingsSchema = new mongoose.Schema({
  video1: { type: String },
  video2: { type: String },
});

module.exports = mongoose.model("VideoSettings", videoSettingsSchema);
