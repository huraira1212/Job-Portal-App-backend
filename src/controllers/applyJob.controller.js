// src/controllers/application.controller.js

export const applyJob = async (req, res) => {
  try {
    const { jobId, coverLetter } = req.body;
    const resumeFile = req.file; // multer se aata hai

    // ===== Validation =====
    if (!jobId || !coverLetter) {
      return res.status(400).json({
        message: "Job ID and cover letter required",
      });
    }

    if (!resumeFile) {
      return res.status(400).json({
        message: "Resume file is required",
      });
    }

    // ===== Resume Path (IMPORTANT) =====
    const resumePath = `/uploads/resumes/${resumeFile.filename}`;

    console.log("JobId:", jobId);
    console.log("CoverLetter:", coverLetter);
    console.log("ResumePath:", resumePath);

    // ===== Save to DB (example) =====
    /*
    const application = await Application.create({
      job: jobId,
      coverLetter,
      resume: resumePath,
      user: req.user.id, // JWT se
    });
    */

    res.status(201).json({
      message: "Application submitted successfully ✅",
      resume: resumePath,
    });
  } catch (err) {
    console.error("Apply Job Error:", err);
    res.status(500).json({
      message: "Server error",
    });
  }
};
