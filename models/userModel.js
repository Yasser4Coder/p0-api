const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    passwordHash: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["admin", "participant"],
      default: "participant",
    },
    teamId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Team",
      default: null,
    },
    statistics: {
      score: {
        type: Number,
        default: 0,
      },
      challengeSolved: {
        AI: {
          type: Number,
          default: 0,
        },
        CS: {
          type: Number,
          default: 0,
        },
        GD: {
          type: Number,
          default: 0,
        },
        PS: {
          type: Number,
          default: 0,
        },
      },
    },
  },
  { timestamps: true }
);

userSchema.pre("save", function (next) {
  const solved = this.statistics.challengeSolved;
  const total =
    (solved.AI || 0) + (solved.CS || 0) + (solved.GD || 0) + (solved.PS || 0);

  this.statistics.score = total;
  next();
});

module.exports = mongoose.model("User", userSchema);
