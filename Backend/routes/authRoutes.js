import express from "express";
import { registerUser, loginUser, getUserProfile, updateUserProfile } from "../controllers/authController.js";
import { upload } from "../middleware/uploadMiddleware.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();
//login route
router.post("/login", loginUser);

// Register Route with files
router.post(
  "/register",
  upload.fields([{ name: "resume", maxCount: 1 }, { name: "companyProof", maxCount: 1 }]),
  registerUser
);

// Protected routes
router.get("/me", protect, getUserProfile);
router.put("/profile", protect, updateUserProfile);

export default router;