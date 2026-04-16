import User from "./models/User.js";
import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const createAdminUser = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB Connected");

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: "admin@123.com" });
    
    if (existingAdmin) {
      console.log("✅ Admin user already exists!");
      console.log("\n📧 Email: admin@123.com");
      console.log("🔑 Password: Admin@123");
      process.exit(0);
    }

    // Create admin user
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash("Admin@123", salt);

    const adminUser = await User.create({
      name: "System Administrator",
      email: "admin@123.com",
      password: hashedPassword,
      role: "admin",
      isBlocked: false,
      phone: "+1234567890",
      location: "Head Office",
      bio: "System Administrator for  Job Portal",
    });

    console.log("✅ Admin user created successfully!");
    console.log("\n📧 Email: admin@123.com");
    console.log("🔑 Password: Admin@123");
    console.log("\n⚠️  Please change this password after first login!");
    
    process.exit(0);
  } catch (error) {
    console.error("❌ Error creating admin user:", error.message);
    process.exit(1);
  }
};

createAdminUser();