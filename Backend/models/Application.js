import mongoose from "mongoose";

const applicationSchema = new mongoose.Schema(
  {
    candidate: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    job: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
      required: true,
    },

    status: {
      type: String,
      enum: ["pending", "accepted", "rejected"],
      default: "pending",
    },

    // Application details
    coverLetter: {
      type: String,
    },

    phone: {
      type: String,
    },

    currentLocation: {
      type: String,
    },

    yearsOfExperience: {
      type: String,
    },

    expectedSalary: {
      type: String,
    },

    availableNoticePeriod: {
      type: String,
    },

    // Recruiter notes on this application
    recruiterNotes: {
      type: String,
      default: "",
    },

    // Shortlisted flag
    isShortlisted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const Application = mongoose.model("Application", applicationSchema);

export default Application;