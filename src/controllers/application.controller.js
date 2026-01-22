import Job from "../models/Job.js"; // Job model
import Application from "../models/Application.js"; // Application model
import sendEmail from "../utils/sendEmail.js"; // Email helper

// ================= APPLY JOB =================
export const applyJob = async (req, res) => {
  try {
    const { jobId, coverLetter, name, email } = req.body;
    const resumeFile = req.file;

    // 🔒 Validation
    if (!jobId || !coverLetter || !name || !email) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (!resumeFile) {
      return res.status(400).json({ message: "Resume file is required" });
    }

    // ✅ Save application
    const application = await Application.create({
      job: jobId,
      user: req.user?._id || null,
      name,
      email,
      coverLetter,
      resume: `/uploads/resumes/${resumeFile.filename}`, // ✅ Browser-accessible path
    });

    // 🔍 Fetch job details (optional for email)
    const job = await Job.findById(jobId);

    // 📧 Send email notification
    try {
      await sendEmail({
        to: email,
        subject: "Application Submitted Successfully 🎉",
        html: `
          <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
            <h2 style="color: #ff5722;">Application Received!</h2>
            <p>Dear <b>${name}</b>,</p>
            <p>Thank you for applying. We have received your application for the following job:</p>
            
            <div style="border: 1px solid #ddd; padding: 10px; border-radius: 5px; background-color: #f9f9f9;">
              <p><b>Job Title:</b> ${job?.title || "N/A"}</p>
              <p><b>Company:</b> ${job?.company || "N/A"}</p>
              <p><b>Location:</b> ${job?.location || "N/A"}</p>
              <p><b>Application Status:</b> Pending</p>
            </div>
            
            <p>Our recruitment team will review your profile and contact you if shortlisted.</p>
            <br/>
            <p>Best Regards,<br/><b>Job Portal Team</b></p>
          </div>
        `,
      });
    } catch (emailError) {
      console.error("Email notification failed:", emailError.message);
    }

    return res.status(201).json({
      message: "Application submitted successfully ✅",
      application,
    });
  } catch (err) {
    console.error("Apply Job Error:", err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

// ================= GET MY APPLICATIONS =================
export const getMyApplications = async (req, res) => {
  try {
    const applications = await Application.find({
      user: req.user._id,
    }).populate("job", "title company location salary");

    return res.status(200).json(applications);
  } catch (err) {
    console.error("Get My Applications Error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

// ================= GET APPLICATIONS BY JOB (EMPLOYER) =================
export const getApplicationsByJob = async (req, res) => {
  try {
    const { jobId } = req.params;

    // Check if job exists
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    // Only the employer who created the job can view
    if (req.user._id.toString() !== job.createdBy.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    // Fetch all applications for this job
    const applications = await Application.find({ job: jobId }).populate(
      "user",
      "name email",
    );

    return res.status(200).json(applications);
  } catch (err) {
    console.error("Get Applications By Job Error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

// ================= UPDATE APPLICATION STATUS (ADMIN) =================
export const updateApplicationStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ message: "Status is required" });
    }

    const application = await Application.findById(id);
    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    application.status = status;
    await application.save();

    return res.status(200).json({
      message: "Application status updated ✅",
      application,
    });
  } catch (err) {
    console.error("Update Application Status Error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};
