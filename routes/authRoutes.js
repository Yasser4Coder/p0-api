const express = require("express");
const router = express.Router();
const {
  login,
  resetPassword,
  authCheck,
} = require("../controllers/authController");

router.post("/login", login);
router.post("/reset-password", resetPassword);
router.get("/auth-check", authCheck);

module.exports = router;
