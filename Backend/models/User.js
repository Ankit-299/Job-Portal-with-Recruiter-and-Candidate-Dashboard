import mongoose from "mongoose";
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
    },

    password: {
      type: String,
      required: true,
    },

    role: {
      type: String,
      enum: ["candidate", "recruiter","admin"],
      required: true,
    },
    isBlocked: {
      type: Boolean,
      default: false,
    },
    phone: { type: String },
    location: { type: String },
    bio: { type: String },
    
    // Candidate fields
    skills: { type: String },
    experience: { type: String },
    resume: { type: String }, // path to the uploaded resume

    // Recruiter fields
    company: { type: String },
    companyWebsite: { type: String },
    companyProof: { type: String }, // path to proof document
    isVerified: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;