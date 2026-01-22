import Job from "../models/Job.js";

/* ===== CREATE JOB ===== */
export const createJob = async (req, res) => {
  try {
    // Ensure req.user exists
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const job = await Job.create({
      ...req.body,
      createdBy: req.user._id, // save employer id
    });

    res.status(201).json(job);
  } catch (err) {
    console.error("CREATE JOB ERROR:", err);
    res.status(500).json({ message: "Job creation failed" });
  }
};

/* ===== GET ALL JOBS (PUBLIC) ===== */
export const getJobs = async (req, res) => {
  try {
    const jobs = await Job.find().populate("createdBy", "name email");
    res.json(jobs);
  } catch (err) {
    console.error("GET JOBS ERROR:", err);
    res.status(500).json({ message: "Failed to fetch jobs" });
  }
};

/* ===== GET JOB BY ID ===== */
export const getJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id).populate(
      "createdBy",
      "name email"
    );

    if (!job) return res.status(404).json({ message: "Job not found" });

    res.json(job);
  } catch (err) {
    console.error("GET JOB BY ID ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/* ===== GET MY JOBS (EMPLOYER) ===== */
export const getMyJobs = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    console.log("USER:", req.user); // Debug: check if user is set

    const jobs = await Job.find({ createdBy: req.user._id });
    res.json(jobs);
  } catch (err) {
    console.error("GET MY JOBS ERROR:", err);
    res.status(500).json({ message: "Failed to fetch your jobs" });
  }
};

/* ===== UPDATE JOB ===== */
export const updateJob = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const job = await Job.findOneAndUpdate(
      { _id: req.params.id, createdBy: req.user._id },
      req.body,
      { new: true }
    );

    if (!job)
      return res
        .status(404)
        .json({ message: "Job not found or you have no access" });

    res.json(job);
  } catch (err) {
    console.error("UPDATE JOB ERROR:", err);
    res.status(500).json({ message: "Update failed" });
  }
};

/* ===== DELETE JOB ===== */
export const deleteJob = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const job = await Job.findOneAndDelete({
      _id: req.params.id,
      createdBy: req.user._id,
    });

    if (!job)
      return res
        .status(404)
        .json({ message: "Job not found or you have no access" });

    res.json({ message: "Job deleted successfully" });
  } catch (err) {
    console.error("DELETE JOB ERROR:", err);
    res.status(500).json({ message: "Delete failed" });
  }
};
