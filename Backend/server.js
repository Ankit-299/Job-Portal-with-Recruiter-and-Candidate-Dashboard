import express from "express";
import dotenv from "dotenv";
import connectDB from"./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import jobRoutes from "./routes/jobRoutes.js";
import { protect,authorizeRoles } from "./middleware/authMiddleware.js";
import applicationRoutes from "./routes/applicationRoutes.js";
const app = express();
app.use(express.json());


// Use routes
app.use("/api/jobs", jobRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/applications", applicationRoutes);
dotenv.config();

app.use(express.json());
// or ye DB connect 
connectDB();
// all request below  
app.get("/",(req,res)=>{
    res.send("API is running");
});  
const port=process.env.PORT|| 5000;

app.listen(port,()=>{
    console.log(`server is running on port ${port}`);
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