const express = require("express");
const router = express.Router();
const upload = require("../middlewares/multer");

const {
  getAllChallenges,
  createChallenge,
  getChallengeById,
  getChallengesByWave,
  updateChallengeStatus
} = require("../controllers/challengeController");

const authenticateUser = require('../middlewares/authMiddleware');
const authorizeRoles = require('../middlewares/authorizeRoles');

router.get("/", authenticateUser, authorizeRoles('admin'), getAllChallenges);
router.post("/", authenticateUser, authorizeRoles('admin'), upload.single('attachmentFile'), createChallenge);
router.get("/:id", authenticateUser, authorizeRoles('admin', 'participant'), getChallengeById);
router.get("/wave/:wave", authenticateUser, authorizeRoles('admin', 'participant'), getChallengesByWave);
router.patch("/status/:id", authenticateUser, authorizeRoles('admin'), updateChallengeStatus);

module.exports = router;
