const mongoose = require("mongoose");

const challengeSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    points: {
      type: Number,
      required: true,
    },
    attachmentFile: {
      type: String,
    },
    hints: {
      type: [String],
      default: [],
    },
    category: {
      type: String,
      enum: ["AI", "GD", "PS", "CS"],
      required: true,
    },
    wave: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "inactive",
    },
    difficulty: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Challenge", challengeSchema);
