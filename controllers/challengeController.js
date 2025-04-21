const Challenge = require("../models/challengeModel");
const Submission = require("../models/submissionModel");
const cloudinary = require("../config/cloudinary");

const getAllChallenges = async (req, res) => {
  try {
    const challenges = await Challenge.find()
    res.json(challenges);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const createChallenge = async (req, res) => {
  try {
    if (!req.body.title || !req.body.description || !req.body.points || !req.body.category || !req.body.wave) {
      return res.status(400).json({ message: "Some information are required" });
    }

    if (!req.file) {
      return res.status(400).json({ message: "File is required" });
    }

    // Upload file to Cloudinary
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "attachments",
      resource_type: "auto",
      use_filename: true,
      unique_filename: false,
    });

    const downloadUrl = result.secure_url.replace("/upload/", "/upload/fl_attachment/");

    const { title, description, points, hints, category, wave } = req.body;
    const challenge = new Challenge({
      title,
      description,
      attachmentFile: downloadUrl,
      points,
      hints,
      category,
      wave,
    });

    await challenge.save();
    res.status(201).json(challenge);
  } catch (error) {
    res.status(400).json({ message: "Error creating challenge", error: error.message });
  }
};

const getChallengeById = async (req, res) => {
  try {
    const challenge = await Challenge.findById(req.params.id);
    if (!challenge)
      return res.status(404).json({ message: "Challenge not found" });
    res.json(challenge);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const getChallengesByWave = async (req, res) => {
  try {
    const team = req.user.teamId;

    const status = "active";
    const challenges = await Challenge.find({ wave: req.params.wave, status }).lean();

    if (!challenges.length) {
      return res.status(404).json({ message: "No challenges found for this wave" });
    }

    // For each challenge, check if this team has solved it
    for (let challenge of challenges) {
      const submission = await Submission.findOne({
        challengeId: challenge._id,
        teamId: team
      }).select('isSolved').lean();

      // If submission exists, use its isSolved value; otherwise, default to false
      challenge.isSolved = submission ? submission.isSolved : false;
    }

    res.json(challenges);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
// change status of challenge
const updateChallengeStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ message: "Status is required" });
    }

    const challenge = await Challenge.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!challenge) {
      return res.status(404).json({ message: "Challenge not found" });
    }

    res.json(challenge);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = { getAllChallenges, createChallenge, getChallengeById, getChallengesByWave, updateChallengeStatus };
