const Announcement = require("../models/announcementModel");
const { getIO } = require("../config/socket");
const cloudinary = require("../config/cloudinary");

const getAllAnnouncements = async (req, res) => {
  try {
    const announcements = await Announcement.find();
    res.json(announcements);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const createAnnouncement = async (req, res) => {
  try {
    const { title, content } = req.body;

    if (!title || !content) {
      return res.status(400).json({ message: "Missing required field(s)" });
    }

    let downloadUrl = null;

    // Upload file to Cloudinary if provided
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "announcements",
        resource_type: "auto",
        use_filename: true,
        unique_filename: false,
      });

      downloadUrl = result.secure_url.replace(
        "/upload/",
        "/upload/fl_announcement/"
      );
    }

    // Create new announcement in the database
    const announcement = await Announcement.create({
      title,
      content,
      attachmentFile: downloadUrl,
    });

    if (!announcement) {
      return res.status(400).json({ message: "Failed to create announcement" });
    }
    const io = getIO();
    if (io) {
      io.emit("new_announcement"); // simple signal
    }

    // Return the created announcement as a response
    res.status(201).json(announcement);
  } catch (error) {
    console.error("Error creating announcement:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = {
  getAllAnnouncements,
  createAnnouncement,
};
