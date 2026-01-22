import express from "express";
import { protect, isAdmin } from "../middleware/auth.middleware.js";
import User from "../models/User.js";
import Job from "../models/Job.js";

const router = express.Router();

// 👤 All Users
router.get("/users", protect, isAdmin, async (req, res) => {
  const users = await User.find({ role: { $ne: "admin" } });
  res.json(users);
});

// 🔒 Block / Unblock User
router.put("/user/:id/block", protect, isAdmin, async (req, res) => {
  const user = await User.findById(req.params.id);
  user.isBlocked = !user.isBlocked;
  await user.save();
  res.json({ message: "User status updated" });
});

// 💼 All Jobs
router.get("/jobs", protect, isAdmin, async (req, res) => {
  const jobs = await Job.find();
  res.json(jobs);
});

export default router;
