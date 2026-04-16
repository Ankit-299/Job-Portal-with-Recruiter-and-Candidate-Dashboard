import express from "express";
import { createJob,getAllJobs,deleteJob,getMyJobs,getJobById,getSimilarJobs} from "../controllers/jobController.js";
import { protect, authorizeRoles } from "../middleware/authMiddleware.js";

const router = express.Router();

// Only recruiter can create job
router.post("/", protect, authorizeRoles("recruiter"), createJob);
// Get all jobs (Public)
router.get("/", getAllJobs);
// Only recruiter or admin can delete job
router.delete("/:id", protect, authorizeRoles("recruiter", "admin"), deleteJob);

// Recruiter fetch my jobs
router.get("/my-jobs", protect, authorizeRoles("recruiter"), getMyJobs);

// Get single job by ID (Public)
router.get("/:id", getJobById);

// Get similar jobs (Public)
router.get("/:id/similar", getSimilarJobs);

export default router;