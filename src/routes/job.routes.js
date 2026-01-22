import express from "express";
import {
  createJob,
  getJobs,
  getJobById,
  getMyJobs,
  updateJob,
  deleteJob,
} from "../controllers/job.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

// PUBLIC ROUTES
router.get("/", getJobs);

// EMPLOYER ROUTES
router.get("/my-jobs", protect, getMyJobs); // MUST be before /:id
router.get("/:id", getJobById);

router.post("/", protect, createJob);
router.put("/:id", protect, updateJob);
router.delete("/:id", protect, deleteJob);

export default router;
