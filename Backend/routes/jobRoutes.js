import express from "express";
import { createJob,getAllJobs,deleteJob} from "../controllers/jobController.js";
import { protect, authorizeRoles } from "../middleware/authMiddleware.js";

const router = express.Router();

// Only recruiter can create job
router.post("/", protect, authorizeRoles("recruiter"), createJob);
// Get all jobs (Public)
router.get("/", getAllJobs);
// Only recruiter or admin can delete job
router.delete("/:id", protect, authorizeRoles("recruiter", "admin"), deleteJob);

export default router;