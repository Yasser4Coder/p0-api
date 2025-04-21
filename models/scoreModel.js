const mongoose = require('mongoose');

const scoreSchema = new mongoose.Schema(
    {
        submissionId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Submission",
            required: true,
        },
        judgeId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        score: {
            type: Number,
            required: true,
        },
        comments: {
            type: String,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model('Score', scoreSchema);
