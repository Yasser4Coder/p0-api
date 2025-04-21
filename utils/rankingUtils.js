const Competition = require("../models/competitionModel");

const updateCompetitionRankings = async (competitionId) => {
    try {
        const competition = await Competition.findById(competitionId).populate("teams");

        if (!competition) {
            throw new Error("Competition not found");
        }

        let rankings = [];

        for (let team of competition.teams) {
            const totalScore = team.competitions
                .find(comp => comp.competitionId.toString() === competitionId.toString())
                ?.scores.reduce((acc, scoreObj) => acc + scoreObj.score, 0) || 0;

            rankings.push({ teamId: team._id, totalScore });
        }

        rankings.sort((a, b) => b.totalScore - a.totalScore);

        competition.rankings = rankings;
        await competition.save();
        return;
    } catch (error) {
        console.error("Error updating rankings:", error.message);
    }
};

module.exports = updateCompetitionRankings;