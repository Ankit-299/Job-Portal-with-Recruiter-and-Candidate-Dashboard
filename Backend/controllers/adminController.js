import User from "../models/User.js";
import Job from "../models/job.js";

// 1. Get all users
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");

    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 2. Get all jobs
export const getAllJobs = async (req, res) => {
  try {
    const jobs = await Job.find().populate("createdBy", "name email");

    res.json(jobs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 3. Recruiter stats
export const getRecruiterStats = async (req, res) => {
  try {
    const recruiters = await User.find({ role: "recruiter" });

    const stats = await Promise.all(
      recruiters.map(async (recruiter) => {
        const jobs = await Job.find({ createdBy: recruiter._id });

        return {
          recruiterName: recruiter.name,
          email: recruiter.email,
          totalJobsPosted: jobs.length,
          totalApplicants: jobs.reduce(
            (acc, job) => acc + job.applicants.length,
            
          ),
        };
      })
    );

    res.json(stats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};