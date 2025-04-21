/* const mongoose = require('mongoose');

const competitionSchema = new mongoose.Schema(
    {
        name: { type: String, required: true, unique: true },
        teams: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Team"
            }
        ],
        challenges: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Challenge"
            }
        ],
        rankings: [
            {
                teamId: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "Team"
                },
                totalScore: {
                    type: Number,
                    default: 0
                }
            }
        ]
    },
    { timestamps: true }
);

module.exports = mongoose.model("Competition", competitionSchema);


 */