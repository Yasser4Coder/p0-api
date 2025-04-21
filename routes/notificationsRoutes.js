const express = require("express");
const { getIO } = require("../config/socket");

const router = express.Router();

router.post("/send", (req, res) => {
  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ error: "Message is required" });
  }

  const io = getIO(); // Get io instance

  if (!io) {
    return res.status(500).json({ error: "Socket.io is not initialized" });
  }

  const timestamp = new Date().toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  }); // HH:MM AM/PM format

  io.emit("notification", { message, timestamp });

  res.json({
    success: true,
    message: "Notification sent to all users",
    timestamp,
  });
});

module.exports = router;
