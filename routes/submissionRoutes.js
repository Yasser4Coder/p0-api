const express = require("express");
const router = express.Router();
const upload = require("../middlewares/multer"); // This should already be multer configured

const {
  getAllSubmissions,
  createSubmission,
  getSubmissionById,
  getSubmissionScoresByTeam,
  getSubmissionScoresByCategory,
  getSubmissionByTeamId,
} = require("../controllers/submissionController");

const authenticateUser = require("../middlewares/authMiddleware");
const authorizeRoles = require("../middlewares/authorizeRoles");

router.get("/", authenticateUser, authorizeRoles("admin"), getAllSubmissions);

router.get(
  "/team/:teamId",
  authenticateUser,
  authorizeRoles("admin", "participant"),
  getSubmissionByTeamId
);

router.post(
  "/",
  authenticateUser,
  authorizeRoles("admin", "participant"),
  upload.single("submissionFile"), // ✅ only one file handler
  createSubmission
);

router.get(
  "/:id",
  authenticateUser,
  authorizeRoles("admin"),
  getSubmissionById
);

router.get(
  "/team/:teamId/scores",
  authenticateUser,
  authorizeRoles("admin", "participant"),
  getSubmissionScoresByTeam
);

router.get(
  "/team/:teamId/scores/category",
  authenticateUser,
  authorizeRoles("admin", "participant"),
  getSubmissionScoresByCategory
);

module.exports = router;
