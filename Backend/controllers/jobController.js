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
      success: true,
      message: "Job created successfully",
      data: job,
    });

  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
// Get jobs created by current recruiter
export const getMyJobs = async (req, res) => {
  try {
    const jobs = await Job.find({ createdBy: req.user.id })
      .populate("applicants", "name email")
      .sort({ createdAt: -1 });
    
    res.status(200).json({ success: true, message: "Success", data: jobs });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
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

    res.status(200).json({
      success: true,
      message: "Success",
      data: {
        totalJobs,
        currentPage: Number(page),
        totalPages: Math.ceil(totalJobs / limit),
        jobs,
      }
    });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
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

    res.status(200).json({ success: true, message: "Job deleted successfully", data: {} });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get single job by ID (Public)
export const getJobById = async (req, res) => {
  try {
    const jobId = req.params.id;

    const job = await Job.findById(jobId)
      .populate("createdBy", "name email company");

    if (!job) {
      return res.status(404).json({ success: false, message: "Job not found" });
    }

    res.status(200).json({
      success: true,
      data: job,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get similar jobs based on title, skills, or category
export const getSimilarJobs = async (req, res) => {
  try {
    const jobId = req.params.id;
    
    const currentJob = await Job.findById(jobId);
    
    if (!currentJob) {
      return res.status(404).json({ success: false, message: "Job not found" });
    }

    // Find jobs with similar title or same department
    const similarJobs = await Job.find({
      _id: { $ne: jobId },
      isOpen: true,
      $or: [
        { title: { $regex: currentJob.title.split(" ")[0], $options: "i" } },
        { department: currentJob.department },
        { requiredSkills: { $in: currentJob.requiredSkills || [] } }
      ]
    })
    .limit(5)
    .populate("createdBy", "name company");

    res.status(200).json({
      success: true,
      data: similarJobs,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};