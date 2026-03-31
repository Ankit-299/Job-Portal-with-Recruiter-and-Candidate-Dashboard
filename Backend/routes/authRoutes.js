import express from "express";
import { registerUser, loginUser } from "../controllers/authController.js";

const router = express.Router();
//login route
router.post("/login", loginUser);

// Register Route
router.post("/register", registerUser);

export default router;