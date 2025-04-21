const express = require("express");
const router = express.Router();
const {
    createUser,
    getAllUsers,
    getUserById,
    updateUserRole,
    deleteUser,
    getUserSubmissions,
    getUserParticipatedChallenges,
    getUserParticipatedTeams,
} = require("../controllers/userController");

const authenticateUser = require('../middlewares/authMiddleware');
const authorizeRoles = require('../middlewares/authorizeRoles');

router.get("/", authenticateUser, authorizeRoles('admin'), getAllUsers)
router.post("/", authenticateUser, authorizeRoles('admin'), createUser);

router.get("/:id", authenticateUser, authorizeRoles('admin'), getUserById)
router.patch("/:id", authenticateUser, authorizeRoles('admin'), updateUserRole)
router.delete("/:id", authenticateUser, authorizeRoles('admin'), deleteUser);

router.get("/:id/submissions", authenticateUser, authorizeRoles('admin', 'participant'), getUserSubmissions);

router.get("/:id/challenges", authenticateUser, authorizeRoles('admin', 'participant'), getUserParticipatedChallenges);

router.get("/:id/teams", authenticateUser, authorizeRoles('admin', 'participant'), getUserParticipatedTeams);


module.exports = router;