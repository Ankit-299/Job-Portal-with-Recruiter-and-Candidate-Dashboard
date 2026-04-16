import express from "express";
import {
  getAllUsers,
  getAllJobs,
  getRecruiterStats,
  toggleUserBlock,
  verifyRecruiter,
  deleteUser,
  deleteJobByAdmin,
  getDashboardStats,
  getAdminNotifications,
} from "../controllers/adminController.js";

import { protect, authorizeRoles } from "../middleware/authMiddleware.js";

const router = express.Router();

// All routes protected and admin only
router.use(protect);
router.use(authorizeRoles("admin"));

// Dashboard stats
router.get("/stats", getDashboardStats);

// User management
router.get("/users", getAllUsers);
router.put("/users/:id/block", toggleUserBlock);
router.delete("/users/:id", deleteUser);

// Job management
router.get("/jobs", getAllJobs);
router.delete("/jobs/:id", deleteJobByAdmin);

// Recruiter management
router.get("/recruiters", getRecruiterStats);
router.put("/recruiters/:id/verify", verifyRecruiter);

// Notifications
router.get("/notifications", getAdminNotifications);

export default router;