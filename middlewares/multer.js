const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = [".csv", ".zip", ".pdf", ".jpg", ".png"];
  const ext = path.extname(file.originalname).toLowerCase();
  if (!allowedTypes.includes(ext)) {
    return cb(new Error("Only CSV, ZIP, and PDF files are allowed"), false);
  }
  cb(null, true);
};

const upload = multer({ storage, fileFilter });
module.exports = upload;
