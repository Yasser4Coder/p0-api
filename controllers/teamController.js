const Team = require("../models/teamModel.js");
const User = require("../models/userModel");

const createTeam = async (req, res) => {
    try {
        const { name } = req.body;

        if (!name) {
            return res.status(400).json({ message: "Missing required field" });
        }

        const existingTeam = await Team.findOne({ name: name });
        if (existingTeam) {
            return res.status(409).json({ message: "Team with the same name already exists" });
        }

        const team = new Team({ name });
        await team.save();

        // Respond with the created team
        res.status(201).json(team);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};


// Retrieve all teams
const getAllTeams = async (req, res) => {
    try {
        const teams = await Team.find();
        res.json(teams);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// Delete a team
const deleteTeam = async (req, res) => {
    try {
        const team = await Team.findByIdAndDelete(req.params.id);
        if (!team) return res.status(404).json({ message: "Team not found" });
        res.json({ message: "Team deleted successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};


// Remove a user from a team
const removeUserFromTeam = async (req, res) => {
    try {
        const { userId } = req.body;
        if (!userId) {
            return res.status(400).json({ message: "Missing required field" });
        }
        const team = await Team.findByIdAndUpdate(req.params.id, { $pull: { users: userId } }, { new: true });
        if (!team) return res.status(404).json({ message: "Team not found" });

        const user = await User.findByIdAndDelete(userId);
        if (!user) return res.status(404).json({ message: "User not found" });

        res.json(team);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// Retrieve a team's members
// WELL 
const getTeamMembers = async (req, res) => {
    try {
        const team = await Team.findById(req.params.teamId).populate({
            path: "members._id",
            model: "User",
            select: "name"
        });
        if (!team) return res.status(404).json({ message: "Team not found" });

        const members = team.members.map(member => {
            const userName = member._id && member._id.name ? member._id.name : "Unknown";
            return { name: userName, role: member.role };
        });

        res.json(members);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// get teams rank sorted by score field 
const getTeamsRank = async (req, res) => {
    try {
        const teams = await Team.find().sort({ totalScore: -1 });
        res.json(teams);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

const getTeams = async (req, res) => {
    try {
        const teams = await Team.find({}, { _id: 1, name: 1, totalScore: 1 });
        res.json(teams);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};


module.exports = {
    createTeam,
    getAllTeams,
    deleteTeam,
    removeUserFromTeam,
    getTeamMembers,
    getTeamsRank,
    getTeams
};
