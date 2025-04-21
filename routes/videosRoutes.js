const express = require("express");
const router = express.Router();
const VideoSettings = require("../models/VideoSettings");
const authenticateUser = require("../middlewares/authMiddleware");
const authorizeRoles = require("../middlewares/authorizeRoles");

// GET current video URLs
router.get(
  "/",
  authenticateUser,
  authorizeRoles("admin", "participant"),
  async (req, res) => {
    try {
      let settings = await VideoSettings.findOne();
      if (!settings) {
        settings = await VideoSettings.create({
          video1: "https://default.com/video1.mp4",
          video2: "https://default.com/video2.mp4",
        });
      }
      res.json(settings);
    } catch (err) {
      res.status(500).json({ error: "Failed to fetch video settings" });
    }
  }
);

router.put(
  "/",
  authenticateUser,
  authorizeRoles("admin"),
  async function (req, res) {
    const video1 = req.body.video1;
    const video2 = req.body.video2;

    try {
      let settings = await VideoSettings.findOne();

      if (!settings) {
        return res.status(404).json({ error: "Video settings not found" });
      }

      // Only update if not an empty string
      if (video1 !== "") settings.video1 = video1;
      if (video2 !== "") settings.video2 = video2;

      await settings.save();
      res.json({ message: "Video URLs updated successfully" });
    } catch (err) {
      res.status(500).json({ error: "Failed to update videos" });
    }
  }
);

module.exports = router;
