import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

import {
  applyJob,
  updateApplicationStatus,
  getApplicationsByJob,
  getMyApplications,
} from "../controllers/application.controller.js";

import { protect, isAdmin } from "../middleware/auth.middleware.js";

const router = express.Router();

// ES module __dirname fix
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Upload folder setup
const uploadDir = path.join(__dirname, "..", "uploads", "resumes");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

// Multer setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});
const upload = multer({ storage });

// ================= Routes =================

// Candidate applies for a job
router.post("/", protect, upload.single("resume"), applyJob);

// Candidate fetches their own applications
router.get("/my", protect, getMyApplications);

// Employer fetches all applications for a job
router.get("/job/:jobId", protect, getApplicationsByJob);

// Admin updates application status
router.put("/:id", protect, isAdmin, updateApplicationStatus);

export default router;
