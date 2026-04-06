import express from "express";
import { applyJob } from "../controllers/applicationController.js";
import { protect, authorizeRoles } from "../middleware/authMiddleware.js";
import { getApplicants } from "../controllers/applicationController.js";
import { updateApplicationStatus } from "../controllers/applicationController.js";
import { getMyApplications } from "../controllers/applicationController.js";
const router = express.Router();

// Only candidate can apply
router.post("/:id/apply", protect, authorizeRoles("candidate"), applyJob);
//recruiter can see all applicants for a job
router.get("/:id/applicants", protect, authorizeRoles("recruiter"), getApplicants);
router.put(
  "/:id/status",
  protect,
  authorizeRoles("recruiter"),
  updateApplicationStatus
);
// Candidate dashboard
router.get(
  "/my-applications",
  protect,
  authorizeRoles("candidate"),
  getMyApplications
);
export default router;