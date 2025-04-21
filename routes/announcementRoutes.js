const express = require('express');
const router = express.Router();
const upload = require("../middlewares/multer");
const {
    getAllAnnouncements,
    createAnnouncement
} = require('../controllers/announcementController');
const authenticateUser = require('../middlewares/authMiddleware');
const authorizeRoles = require('../middlewares/authorizeRoles');


router.get("/", authenticateUser, authorizeRoles('admin', 'participant'), getAllAnnouncements);
router.post("/", authenticateUser, authorizeRoles('admin'), upload.single('attachmentFile'), createAnnouncement);

module.exports = router;
