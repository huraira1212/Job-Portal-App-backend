import express from "express";
import multer from "multer";
import fs from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const router = express.Router();

// ES module me __dirname define karna
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Folder path
const resumesDir = join(__dirname, "resumes");

// Ensure folder exists
if (!fs.existsSync(resumesDir)) {
  fs.mkdirSync(resumesDir, { recursive: true });
  console.log("uploads/resumes folder created ✅");
}

// Multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, resumesDir);
  },
  filename: function (req, file, cb) {
    const uniqueName = Date.now() + "-" + file.originalname;
    cb(null, uniqueName);
  },
});

const upload = multer({ storage });

// Upload route
router.post("/upload", upload.single("resume"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded ❌" });
  }
  console.log("File saved at:", req.file.path);
  res.json({ message: "File uploaded ✅", path: req.file.path });
});

export default router;
