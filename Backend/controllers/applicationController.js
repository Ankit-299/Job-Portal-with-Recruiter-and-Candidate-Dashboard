import Application from "../models/Application.js";
import Job from "../models/job.js";
import User from "../models/User.js";
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
// Get candidate details by ID (Recruiter only)
export const getCandidateDetails = async (req, res) => {
  try {
    const candidateId = req.params.candidateId;

    const candidate = await User.findById(candidateId).select(
      "-password -company -companyWebsite -companyProof"
    );

    if (!candidate) {
      return res.status(404).json({ success: false, message: "Candidate not found" });
    }

    if (candidate.role !== "candidate") {
      return res.status(400).json({ success: false, message: "User is not a candidate" });
    }

    // Get candidate's application history
    const applications = await Application.find({ candidate: candidateId })
      .populate("job", "title company location salary")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: {
        candidate,
        applications,
        totalApplications: applications.length,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Add/update recruiter notes on application
export const addRecruiterNotes = async (req, res) => {
  try {
    const applicationId = req.params.id;
    const { notes } = req.body;

    const application = await Application.findById(applicationId);

    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    application.recruiterNotes = notes;
    await application.save();

    res.status(200).json({
      success: true,
      message: "Notes updated successfully",
      data: application,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Shortlist/unshortlist candidate
export const toggleShortlist = async (req, res) => {
  try {
    const applicationId = req.params.id;

    const application = await Application.findById(applicationId);

    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    application.isShortlisted = !application.isShortlisted;
    await application.save();

    res.status(200).json({
      success: true,
      message: application.isShortlisted ? "Candidate shortlisted" : "Candidate removed from shortlist",
      data: application,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
