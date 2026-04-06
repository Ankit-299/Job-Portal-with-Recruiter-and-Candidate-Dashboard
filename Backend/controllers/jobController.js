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

  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
// Get all jobs (Public)
export const getAllJobs = async (req, res) => {
  try {
    const { keyword, location, company, page = 1, limit = 10 } = req.query;

    let query = {};

    // Search
    if (keyword) {
      query.$or = [
        { title: { $regex: keyword, $options: "i" } },
        { description: { $regex: keyword, $options: "i" } },
      ];
    }

    // Location
    if (location) {
      query.location = { $regex: location, $options: "i" };
    }

    // Company
    if (company) {
      query.company = { $regex: company, $options: "i" };
    }

    //  Pagination logic
    const skip = (page - 1) * limit;

    const jobs = await Job.find(query)
      .populate("createdBy", "name email")
      .skip(skip)
      .limit(Number(limit));

    const totalJobs = await Job.countDocuments(query);

    res.json({
      totalJobs,
      currentPage: Number(page),
      totalPages: Math.ceil(totalJobs / limit),
      jobs,
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete job (Recruiter + Admin)
export const deleteJob = async (req, res) => {
  try {
    const jobId = req.params.id;

    const job = await Job.findById(jobId);

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    // ✅ If recruiter → can delete only own job
    if (req.user.role === "recruiter" && job.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized to delete this job" });
    }

    // ✅ Admin can delete any job (no restriction)

    await job.deleteOne();

    res.json({ message: "Job deleted successfully" });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};