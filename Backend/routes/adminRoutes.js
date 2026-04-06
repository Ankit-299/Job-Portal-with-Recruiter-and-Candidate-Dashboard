import express from "express";
import {
  getAllUsers,
  getAllJobs,
  getRecruiterStats,
} from "../controllers/adminController.js";

import { protect, authorizeRoles } from "../middleware/authMiddleware.js";

const router = express.Router();

// Only admin can access all routes
router.get("/users", protect, authorizeRoles("admin"), getAllUsers);
router.get("/jobs", protect, authorizeRoles("admin"), getAllJobs);
router.get("/recruiters", protect, authorizeRoles("admin"), getRecruiterStats);

export default router;