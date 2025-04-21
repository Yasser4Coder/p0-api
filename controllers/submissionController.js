const Submission = require("../models/submissionModel");
const Team = require("../models/teamModel");
const cloudinary = require("../config/cloudinary");
const fs = require("fs");
const { ConfusionMatrix } = require("ml-confusion-matrix");
const Challenge = require("../models/challengeModel");
const csv = require("csv-parser");

const readCSVColumn = (filePath, columnName) => {
  return new Promise((resolve, reject) => {
    const results = [];

    fs.createReadStream(filePath)
      .pipe(csv())
      .on("data", (data) => {
        if (columnName in data) {
          results.push(data[columnName]);
        } else {
          reject(new Error(`Column "${columnName}" not found in CSV`));
        }
      })
      .on("end", () => {
        resolve(results);
      })
      .on("error", (err) => {
        reject(err);
      });
  });
};

const getAllSubmissions = async (req, res) => {
  try {
    const submissions = await Submission.find()
      .populate("challengeId")
      .populate("teamId", "name")
      .populate("userId", "name")
      .populate("scores");
    res.json(submissions);
  } catch (error) {
    console.error("Error fetching all submissions:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const getSubmissionByTeamId = async (req, res) => {
  try {
    const { teamId } = req.params;

    const submissions = await Submission.find({ teamId })
      .populate("challengeId", "title")
      .populate("teamId", "name")
      .populate("userId", "name")
      .populate("scores");

    if (!submissions || submissions.length === 0) {
      return res
        .status(404)
        .json({ message: "No submissions found for this team" });
    }

    res.json(submissions);
  } catch (error) {
    console.error("Error fetching submissions for team:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const createSubmission = async (req, res) => {
  try {
    const { challengeId, teamId, userId, submissionText } = req.body;

    if (!teamId || !challengeId || !userId) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const existingSubmission = await Submission.findOne({
      teamId,
      challengeId,
      userId,
    });

    if (existingSubmission) {
      return res.status(400).json({ message: "Submission already exists" });
    }

    const challenge = await Challenge.findById(challengeId);
    if (!challenge) {
      return res.status(404).json({ message: "Challenge not found" });
    }

    const file = req.file;
    let downloadUrl = null;
    let accuracy = null;

    // ✅ If it's an AI challenge → process CSV locally and calculate accuracy
    if (challenge.category === "AI") {
      if (!file) {
        return res
          .status(400)
          .json({ message: "CSV file is required for AI challenge" });
      }

      const userFilePath = file.path;
      const SOLUTION_FILE = "solutions/Evaluation_set.csv";

      const actual = await readCSVColumn(SOLUTION_FILE, "Language");
      const pridected = await readCSVColumn(userFilePath, "Language");

      if (actual.length !== pridected.length) {
        return res.status(400).json({ error: "Mismatch in number of rows." });
      }

      const CM = ConfusionMatrix.fromLabels(actual, pridected);
      accuracy = Number((CM.getAccuracy() * 100).toFixed(2));

      // Clean up local file after processing
      if (fs.existsSync(userFilePath)) {
        fs.unlinkSync(userFilePath);
      }
    }

    // ✅ If it's NOT an AI challenge → upload to Cloudinary
    if (challenge.category !== "AI" && file) {
      if (!fs.existsSync(file.path)) {
        return res.status(400).json({ message: "File is missing or invalid" });
      }

      const result = await cloudinary.uploader.upload(file.path, {
        folder: "submissions",
        resource_type: "auto",
        use_filename: true,
        unique_filename: false,
        flags: "attachment",
      });

      downloadUrl = result.secure_url.replace(
        "/upload/",
        "/upload/fl_attachment/"
      );

      // Clean up local file after uploading to Cloudinary
      if (fs.existsSync(file.path)) {
        fs.unlinkSync(file.path);
      }
    }

    const submission = new Submission({
      challengeId,
      teamId,
      userId,
      submissionText: submissionText || "",
      submissionFile: downloadUrl,
      isSolved: false,
      accuracy: accuracy,
    });

    await submission.save();

    res.status(201).json({
      message: "Submission created successfully",
      submission,
    });
  } catch (error) {
    console.error("Error creating submission:", error);
    res.status(400).json({
      message: "Error creating submission",
      error: error.message,
    });
  }
};

const getSubmissionById = async (req, res) => {
  try {
    const submission = await Submission.findById(req.params.id)
      .populate("challengeId", "title")
      .populate("teamId", "name")
      .populate("scores");
    if (!submission)
      return res.status(404).json({ message: "Submission not found" });
    res.json(submission);
  } catch (error) {
    console.error("Error fetching submission by ID:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get the score of all submissions by team
const getSubmissionScoresByTeam = async (req, res) => {
  try {
    const teamId = req.params.teamId;

    const submissions = await Submission.find({ teamId }).populate("scores");

    const allScores = submissions.flatMap((submission) =>
      submission.scores
        ? submission.scores.map((score) => Number(score.score) || 0)
        : []
    );

    const totalScore = allScores.reduce((acc, curr) => acc + curr, 0);

    await Team.findByIdAndUpdate(teamId, { scores: totalScore }, { new: true });

    res.json({ totalScore });
  } catch (error) {
    console.error("Error fetching submission scores:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get the scores of all challenges classified by categories
const getSubmissionScoresByCategory = async (req, res) => {
  try {
    const teamId = req.params.teamId;

    const submissions = await Submission.find({ teamId })
      .populate("challengeId", "category")
      .populate("scores");

    const scoresByCategory = {};

    submissions.forEach((submission) => {
      const category = submission.challengeId.category;
      const scores = submission.scores || [];

      if (!scoresByCategory[category]) {
        scoresByCategory[category] = [];
      }

      scores.forEach((score) => {
        scoresByCategory[category].push(Number(score.score) || 0);
      });
    });

    res.json(scoresByCategory);
  } catch (error) {
    console.error("Error fetching submission scores by category:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = {
  getAllSubmissions,
  createSubmission,
  getSubmissionById,
  getSubmissionScoresByTeam,
  getSubmissionScoresByCategory,
  getSubmissionByTeamId,
};
