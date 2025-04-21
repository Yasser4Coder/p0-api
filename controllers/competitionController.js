/* const Competition = require("../models/competitionModel");
const { updateCompetitionRankings } = require("../utils/rankingUtils");

const createCompetition = async (req, res) => {
    try {
        const { name, description, startDate, endDate } = req.body;

        if (!name || !description || !startDate || !endDate) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        const competition = new Competition({ name: name, description: description, startDate: startDate, endDate: endDate });
        await competition.save();

        res.status(201).json(competition);
    } catch (error) {
        res.status(400).json({ message: "Error creating competition", error: error.message });
    }
};

// Retrieve all competitions
const getAllCompetitions = async (req, res) => {
    try {
        const competitions = await Competition.find();
        res.json(competitions);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

const getCompetitionById = async (req, res) => {
    try {
        const competition = await Competition.findById(req.params.id);
        if (!competition) {
            return res.status(404).json({ message: "Competition not found" });
        }
        res.json(competition);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

const updateCompetition = async (req, res) => {
    try {
        const competition = await Competition.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!competition) {
            return res.status(404).json({ message: "Competition not found" });
        }
        res.json(competition);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

const deleteCompetition = async (req, res) => {
    try {
        const competition = await Competition.findByIdAndDelete(req.params.id);
        if (!competition) {
            return res.status(404).json({ message: "Competition not found" });
        }
        res.json({ message: "Competition deleted successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

const getCompetitionRankings = async (req, res) => {
    try {
        const { competitionId } = req.params;

        if (!competitionId || !mongoose.isValidObjectId(competitionId)) {
            return res.status(400).json({ message: "Invalid Competition ID" });
        }

        const updatesRank = await updateCompetitionRankings(competitionId);
        if (!updatesRank) {
            return res.status(500).json({ message: "Error updating rankings" });
        }


        const competition = await Competition.findById(competitionId).select("name rankings");

        if (!competition) {
            return res.status(404).json({ message: "Competition not found" });
        }

        res.json({ rankings: competition.rankings });
    } catch (error) {
        console.error("Error fetching rankings:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};


module.exports = {
    createCompetition,
    getAllCompetitions,
    getCompetitionById,
    updateCompetition,
    deleteCompetition,
    getCompetitionRankings,
}; */
