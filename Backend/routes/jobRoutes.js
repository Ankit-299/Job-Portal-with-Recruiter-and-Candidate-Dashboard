import express from "express";
import { createJob } from "../controllers/jobController.js";
import { protect, authorizeRoles } from "../middleware/authMiddleware.js";

const router = express.Router();

// Only recruiter can create job
router.post("/", protect, authorizeRoles("recruiter"), createJob);

export default router;