import express from "express";
import dotenv from "dotenv";
import connectDB from"./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import { protect } from "./middleware/authMiddleware.js";
const app = express();
app.use(express.json());

// Use routes
app.use("/api/auth", authRoutes);
dotenv.config();

app.use(express.json());
// or ye DB connect 
connectDB();
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
