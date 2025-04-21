const Mentor = require("../models/metorsModels");

const createCallMentor = async (req, res) => {
  try {
    const { userId, teamId, message, status } = req.body;

    if (!userId || !teamId || !message) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const newMentor = new Mentor({
      userId,
      teamId,
      message,
      status,
    });

    await newMentor.save();

    res.status(201).json(newMentor);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const getAllMentorCalls = async (req, res) => {
  try {
    const mentorCalls = await Mentor.find({ status: "mentor" })
      .populate("userId", "name email")
      .populate("teamId", "name members");
    if (!mentorCalls) {
      return res.status(404).json({ message: "No mentor calls found" });
    }

    res.json(mentorCalls);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// get all needs calls
const getAllNeedsCalls = async (req, res) => {
  try {
    const needsCalls = await Mentor.find({ status: "needs" })
      .populate("userId", "name email")
      .populate("teamId", "name members");
    if (!needsCalls) {
      return res.status(404).json({ message: "No needs calls found" });
    }

    res.json(needsCalls);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = {
  createCallMentor,
  getAllMentorCalls,
  getAllNeedsCalls,
};
