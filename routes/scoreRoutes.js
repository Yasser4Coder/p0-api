const express = require("express");
const router = express.Router();
const { createScore } = require("../controllers/scoreController");

const authenticateUser = require('../middlewares/authMiddleware');
const authorizeRoles = require('../middlewares/authorizeRoles');

router.post("/", authenticateUser, authorizeRoles('admin'), createScore);


module.exports = router;