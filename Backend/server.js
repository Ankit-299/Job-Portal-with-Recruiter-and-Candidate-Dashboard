import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

// Load environment variables FIRST
dotenv.config();

import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import jobRoutes from "./routes/jobRoutes.js";
import { protect, authorizeRoles } from "./middleware/authMiddleware.js";
import applicationRoutes from "./routes/applicationRoutes.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Middleware
app.use(express.json());

// CORS configuration
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://jobportal-rho-six.vercel.app",
      /\.vercel\.app$/,
    ],
    credentials: true,
  })
);

// Static files for uploads
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Connect to database
connectDB();

// Routes
app.use("/api/jobs", jobRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/applications", applicationRoutes);

// Test routes
app.get("/", (req, res) => {
  res.send("API is running");
});

app.get("/api/test", protect, (req, res) => {
  res.json({
    message: "Protected route accessed",
    user: req.user,
  });
});

app.get(
  "/api/recruiter-only",
  protect,
  authorizeRoles("recruiter"),
  (req, res) => {
    res.json({ message: "Welcome Recruiter!" });
  }
);

app.get(
  "/api/candidate-only",
  protect,
  authorizeRoles("candidate"),
  (req, res) => {
    res.json({ message: "Welcome Candidate!" });
  }
);

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});