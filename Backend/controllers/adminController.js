import User from "../models/User.js";
import Job from "../models/job.js";
import Application from "../models/Application.js";
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
          _id: recruiter._id,
          recruiterName: recruiter.name,
          email: recruiter.email,
          company: recruiter.company,
          isVerified: recruiter.isVerified,
          isBlocked: recruiter.isBlocked,
          totalJobsPosted: jobs.length,
          totalApplicants: jobs.length > 0 ? jobs.reduce(
            (acc, job) => acc + job.applicants.length,
          ) : 0,
        };
      })
    );

    res.status(200).json({ success: true, data: stats });
  } catch (error) {
    res.status(500).json({ message: error.message });
    console.log(error);
  }
};
// 4. Block/Unblock user
export const toggleUserBlock = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // Prevent admin from blocking themselves
    if (user._id.toString() === req.user._id.toString()) {
      return res.status(403).json({ success: false, message: "You cannot block yourself" });
    }

    user.isBlocked = !user.isBlocked;
    await user.save();

    res.status(200).json({
      success: true,
      message: `User ${user.isBlocked ? "blocked" : "unblocked"} successfully`,
      data: { _id: user._id, isBlocked: user.isBlocked },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 5. Verify recruiter
export const verifyRecruiter = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    if (user.role !== "recruiter") {
      return res.status(400).json({ success: false, message: "User is not a recruiter" });
    }

    user.isVerified = true;
    await user.save();

    res.status(200).json({
      success: true,
      message: "Recruiter verified successfully",
      data: { _id: user._id, isVerified: user.isVerified },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 6. Delete user
export const deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // Prevent admin from deleting themselves
    if (user._id.toString() === req.user._id.toString()) {
      return res.status(403).json({ success: false, message: "You cannot delete yourself" });
    }

    // If recruiter, delete their jobs and applications
    if (user.role === "recruiter") {
      await Job.deleteMany({ createdBy: userId });
      await Application.deleteMany({ candidate: userId });
    }

    // If candidate, delete their applications
    if (user.role === "candidate") {
      await Application.deleteMany({ candidate: userId });
    }

    await user.deleteOne();

    res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 7. Delete job
export const deleteJobByAdmin = async (req, res) => {
  try {
    const jobId = req.params.id;
    const job = await Job.findById(jobId);

    if (!job) {
      return res.status(404).json({ success: false, message: "Job not found" });
    }

    // Delete related applications
    await Application.deleteMany({ job: jobId });
    await job.deleteOne();

    res.status(200).json({
      success: true,
      message: "Job deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 8. Get dashboard statistics
export const getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalCandidates = await User.countDocuments({ role: "candidate" });
    const totalRecruiters = await User.countDocuments({ role: "recruiter" });
    const totalJobs = await Job.countDocuments();
    const totalApplications = await Application.countDocuments();
    const pendingRecruiters = await User.countDocuments({ role: "recruiter", isVerified: false });
    const blockedUsers = await User.countDocuments({ isBlocked: true });

    res.status(200).json({
      success: true,
      data: {
        totalUsers,
        totalCandidates,
        totalRecruiters,
        totalJobs,
        totalApplications,
        pendingRecruiters,
        blockedUsers,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 9. Get admin notifications
export const getAdminNotifications = async (req, res) => {
  try {
    const pendingRecruiters = await User.countDocuments({ 
      role: "recruiter", 
      isVerified: false 
    });
    
    const recentRecruiters = await User.find(
      { role: "recruiter", isVerified: false },
      "name email createdAt"
    )
    .sort({ createdAt: -1 })
    .limit(5);
    
    const notifications = [];
    
    if (pendingRecruiters > 0) {
      notifications.push({
        id: "pending-recruiters",
        type: "warning",
        title: `${pendingRecruiters} Recruiter${pendingRecruiters > 1 ? 's' : ''} Pending Verification`,
        message: "New recruiters are waiting for approval",
        timestamp: new Date(),
        action: "/admin/recruiters"
      });
    }
    
    recentRecruiters.slice(0, 3).forEach((recruiter) => {
      notifications.push({
        id: `recruiter-${recruiter._id}`,
        type: "info",
        title: `New Registration: ${recruiter.name}`,
        message: `${recruiter.email} - requires verification`,
        timestamp: recruiter.createdAt,
        action: "/admin/recruiters"
      });
    });
    
    res.status(200).json({
      success: true,
      data: {
        notifications,
        unreadCount: pendingRecruiters
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};