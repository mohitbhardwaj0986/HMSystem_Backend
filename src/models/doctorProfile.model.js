// models/DoctorProfile.js
import mongoose from "mongoose";

const doctorProfileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true, // One-to-one relationship with User
    },
    specialization: {
      type: String,
      required: [true, "Specialization is required"],
      trim: true,
    },
    experience: {
      type: Number, // Years of experience
      required: [true, "Experience is required"],
      min: 0,
    },
    education: {
      type: String,
      required: [true, "Education details are required"],
      trim: true,
    },
    consultationFee: {
      type: Number,
      required: [true, "Consultation fee is required"],
    },
    timings: {
      start: { type: String, required: true }, // e.g., "09:00"
      end: { type: String, required: true }, // e.g., "17:00"
    },
    bio: {
      type: String,
      default: "",
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

const DoctorProfile = mongoose.model("DoctorProfile", doctorProfileSchema);

export default DoctorProfile;
