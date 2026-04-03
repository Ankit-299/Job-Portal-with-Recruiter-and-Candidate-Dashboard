import Job from "../models/job.js";

// CREATE JOB (Recruiter only)
export const createJob = async (req, res) => {
  try {
    const { title, description, company, location, salary } = req.body;

    // 1. Validate input
    if (!title || !description || !company || !location || !salary) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // 2. Create job
    const job = await Job.create({
      title,
      description,
      company,
      location,
      salary,
      createdBy: req.user.id, // from JWT
    });

    res.status(201).json({
      message: "Job created successfully",
      job,
    });
v
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};