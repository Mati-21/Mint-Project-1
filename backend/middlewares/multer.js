import multer from "multer";
import path from "path";
import fs from "fs";

// Set up multer storage configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Ensure the "uploads" directory exists
    const uploadDir = "uploads/";
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    // Set a dynamic filename based on current timestamp
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

// Set up multer instance with the storage configuration
const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // Increased to 10MB, adjust as needed
  // Allow any file type
  fileFilter: (req, file, cb) => {
    cb(null, true);
  },
});

// Export the multer instance to be used in routes
export default upload;
