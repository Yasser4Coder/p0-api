const mongoose = require("mongoose");

const submissionSchema = new mongoose.Schema(
  {
    challengeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Challenge",
      required: true,
    },
    teamId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Team",
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "reviewed"],
      default: "pending",
    },
    submissionFile: {
      type: String
    },
    submissionText: {
      type: String
    },
    isSolved: {
      type: Boolean,
      default: false,
    },
    scores: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Score",
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Submission", submissionSchema);
