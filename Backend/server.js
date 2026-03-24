import express from "express";
import dotenv from "dotenv";
import connectDB from"./config/db.js";
dotenv.config();
const app= express();
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
