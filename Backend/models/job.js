import mongoose from "mongoose";

const jobSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },

    description: {
      type: String,
      required: true,
    },

    company: {
      type: String,
      required: true,
    },

    location: {
      type: String,
      required: true,
    },

    salary: {
      type: Number,
      required: true,
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    applicants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    // New enhanced fields
    jobType: {
      type: String,
      enum: ["full-time", "part-time", "contract", "internship", "freelance"],
      default: "full-time",
    },

    experienceLevel: {
      type: String,
      enum: ["entry", "mid", "senior", "lead", "executive"],
      default: "mid",
    },

    requiredSkills: [
      {
        type: String,
      },
    ],

    qualifications: {
      type: String,
    },

    responsibilities: {
      type: String,
    },

    benefits: {
      type: String,
    },

    applicationDeadline: {
      type: Date,
    },

    isOpen: {
      type: Boolean,
      default: true,
    },

    remoteOption: {
      type: String,
      enum: ["on-site", "remote", "hybrid"],
      default: "on-site",
    },

    department: {
      type: String,
    },

    positions: {
      type: Number,
      default: 1,
    },
  },
  { timestamps: true }
);

const Job = mongoose.model("Job", jobSchema);

export default Job;