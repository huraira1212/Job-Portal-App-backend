import express from "express";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

const app = express();
const PORT = 8080;

// Fix __dirname for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ===== Serve static files =====
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ===== Multer Storage Setup =====
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "uploads/resumes"));
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const allowedTypes = /pdf|doc|docx/;
    const ext = path.extname(file.originalname).toLowerCase();
    allowedTypes.test(ext)
      ? cb(null, true)
      : cb(new Error("Only PDF, DOC, DOCX files are allowed"));
  },
});

// ===== Upload Route =====
app.post("/upload", upload.single("resume"), (req, res) => {
  if (!req.file) return res.status(400).send("No file uploaded");

  console.log("File saved at:", req.file.path);
  res.json({
    message: "File uploaded ✅",
    filePath: `/uploads/resumes/${req.file.filename}`,
  });
});

// ===== Start Server =====
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
