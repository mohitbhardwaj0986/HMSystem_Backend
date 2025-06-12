import DoctorProfile from "../models/doctorProfile.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const createDoctorProfile = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const existingProfile = await DoctorProfile.findOne({ user: userId });
  if (existingProfile) {
    throw new ApiError(409, "Doctor profile already exists");
  }

  const {
    specialization,
    experience,
    education,
    consultationFee,
    timings,
    bio,
  } = req.body;

  if (
    !specialization ||
    !experience ||
    !education ||
    !consultationFee ||
    !timings?.start ||
    !timings?.end
  ) {
    throw new ApiError(400, "All required fields must be filled");
  }

  const profile = await DoctorProfile.create({
    user: userId,
    specialization,
    experience,
    education,
    consultationFee,
    timings,
    bio,
  });

  res
    .status(201)
    .json(new ApiResponse(201, profile, "Doctor profile created successfully"));
});

// @desc    Get current doctor's profile
// @route   GET /api/v1/doctor-profile/me
const getMyDoctorProfile = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const profile = await DoctorProfile.findOne({ user: userId }).populate(
    "user",
    "-password -refreshToken"
  );
  if (!profile) {
    throw new ApiError(404, "Doctor profile not found");
  }

  res
    .status(200)
    .json(new ApiResponse(200, profile, "Doctor profile fetched successfully"));
});

// @desc    Update doctor profile
// @route   PUT /api/v1/doctor-profile
const updateDoctorProfile = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const updatedFields = req.body;

  const profile = await DoctorProfile.findOneAndUpdate(
    { user: userId },
    updatedFields,
    { new: true, runValidators: true }
  );

  if (!profile) {
    throw new ApiError(404, "Doctor profile not found");
  }

  res
    .status(200)
    .json(new ApiResponse(200, profile, "Doctor profile updated successfully"));
});

// @desc    Delete doctor profile
// @route   DELETE /api/v1/doctor-profile
const deleteDoctorProfile = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const deleted = await DoctorProfile.findOneAndDelete({ user: userId });

  if (!deleted) {
    throw new ApiError(404, "Doctor profile not found");
  }

  res
    .status(200)
    .json(new ApiResponse(200, {}, "Doctor profile deleted successfully"));
});

// @desc    Get all doctor profiles (admin or public)
// @route   GET /api/v1/doctor-profile
const getAllDoctorProfiles = asyncHandler(async (req, res) => {
  const profiles = await DoctorProfile.find().populate(
    "user",
    "-password -refreshToken"
  );

  res
    .status(200)
    .json(new ApiResponse(200, profiles, "All doctor profiles fetched"));
});

export {
  createDoctorProfile,
  getMyDoctorProfile,
  updateDoctorProfile,
  deleteDoctorProfile,
  getAllDoctorProfiles,
};
