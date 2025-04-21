const mongoose = require("mongoose");

const teamSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    members: [
      {
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        role: {
          type: String,
          enum: ["member", "leader"],
          default: "member",
        },
      },
    ],
    totalScore: {
      type: Number,
      default: 0,
    }
    /*     competitions: [
          {
            competitionId: {
              type: mongoose.Schema.Types.ObjectId,
              ref: "Competition",
            },
            scores: [
              {
                challengeId: {
                  type: mongoose.Schema.Types.ObjectId,
                  ref: "Challenge",
                },
                score: {
                  scores: [
                    {
                      type: mongoose.Schema.Types.ObjectId,
                      ref: "Score",
                    },
                  ],
                },
              },
            ],
          },
        ], */
  },
  { timestamps: true }
);

module.exports = mongoose.model("Team", teamSchema);
