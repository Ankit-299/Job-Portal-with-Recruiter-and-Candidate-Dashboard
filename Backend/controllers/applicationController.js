import Application from "../models/Application.js";
import Job from "../models/job.js";

// Candidate applies to job
export const applyJob = async (req, res) => {
  try {
    const userId = req.user.id; // candidate
    const jobId = req.params.id;

    // 1. Check job exists
    const job = await Job.findById(jobId);

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    // 2. Prevent duplicate application
    const alreadyApplied = await Application.findOne({
      candidate: userId,
      job: jobId,
    });

    if (alreadyApplied) {
      return res.status(400).json({ message: "Already applied" });
    }

    // 3. Create application
    const application = await Application.create({
      candidate: userId,
      job: jobId,
    });

    res.status(201).json({
      message: "Applied successfully",
      application,
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// Get applicants for a job (Recruiter)
export const getApplicants = async (req, res) => {
  try {
    const jobId = req.params.id;

    const applications = await Application.find({ job: jobId })
      .populate("candidate", "name email")
      .populate("job", "title");

    res.json(applications);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// Update application status (Recruiter)
export const updateApplicationStatus = async (req, res) => {
  try {
    const applicationId = req.params.id;
    const { status } = req.body;

    // Validate status
    if (!["accepted", "rejected"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const application = await Application.findById(applicationId);

    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    application.status = status;
    await application.save();

    res.json({
      message: `Application ${status}`,
      application,
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// Candidate → View applied jobs
export const getMyApplications = async (req, res) => {
  try {
    const userId = req.user.id;

    const applications = await Application.find({ candidate: userId })
      .populate("job", "title company location salary");

    res.json(applications);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
