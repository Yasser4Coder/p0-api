const express = require("express");
const router = express.Router();
const {
  createCallMentor,
  getAllMentorCalls,
  getAllNeedsCalls,
} = require("../controllers/mentorsController");

const authenticateUser = require("../middlewares/authMiddleware");
const authorizeRoles = require("../middlewares/authorizeRoles");

router.post(
  "/",
  authenticateUser,
  authorizeRoles("participant", "admin"),
  createCallMentor
);

router.get(
  "/mentors",
  authenticateUser,
  authorizeRoles("admin"),
  getAllMentorCalls
);

router.get(
  "/needs",
  authenticateUser,
  authorizeRoles("admin"),
  getAllNeedsCalls
);

module.exports = router;
