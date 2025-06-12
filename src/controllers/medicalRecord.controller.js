import MedicalRecord from "../models/medicalRecod.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import Appointment from "../models/appointment.model.js";
import Prescription from "../models/prescription.model.js";
import { populate } from "dotenv";

// Create Medical Record (Doctor only)
export const createMedicalRecord = asyncHandler(async (req, res) => {
  const { symptoms, diagnosis, tests, notes } = req.body;

  if (!symptoms || !diagnosis) {
    throw new ApiError(400, "Required fields are missing");
  }
  const { id: appointmentId } = req.params;
  const appointment = await Appointment.findOne({ _id: appointmentId })
    .populate({
      path: "patient",
      select: "-password -refreshToken",
    })
    .populate({
      path: "doctor",
      populate: {
        path: "user",
        select: "fullName", // Select only name (or "fullName")
      },
    });
  console.log(appointment);

  const medicalRecord = await MedicalRecord.create({
    patient: appointment.patient,
    doctor: appointment.doctor,
    appointment: appointmentId,
    symptoms,
    diagnosis,
    tests,
    notes,
  });

  res
    .status(201)
    .json(new ApiResponse(201, medicalRecord, "Medical record created"));
});

// Get all medical records (Admin only)
export const getAllMedicalRecords = asyncHandler(async (req, res) => {
  const records = await MedicalRecord.find().populate(
    "patient doctor appointment prescription"
  );
  res.status(200).json(new ApiResponse(200, records, "All medical records"));
});

// Get single medical record by ID
export const getMedicalRecordById = asyncHandler(async (req, res) => {
  const record = await MedicalRecord.findById(req.params.id).populate(
    "patient doctor appointment prescription"
  );

  if (!record) {
    throw new ApiError(404, "Medical record not found");
  }

  res.status(200).json(new ApiResponse(200, record, "Medical record details"));
});

// Update medical record (Doctor only)
export const updateMedicalRecord = asyncHandler(async (req, res) => {
  const updated = await MedicalRecord.findByIdAndUpdate(
    req.params.id,
    { $set: req.body },
    { new: true }
  );

  if (!updated) {
    throw new ApiError(404, "Medical record not found");
  }

  res.status(200).json(new ApiResponse(200, updated, "Medical record updated"));
});

// Delete medical record (Admin only)
export const deleteMedicalRecord = asyncHandler(async (req, res) => {
  const deleted = await MedicalRecord.findByIdAndDelete(req.params.id);

  if (!deleted) {
    throw new ApiError(404, "Medical record not found");
  }

  res.status(200).json(new ApiResponse(200, deleted, "Medical record deleted"));
});

// Get records for a specific patient (Patient or Admin)
export const getMedicalRecordsByPatient = asyncHandler(async (req, res) => {
  const userRole = req.user.role;
  // if(userRole!=="patient"){
  //   throw new ApiError(400, "You are not authorized")
  // }
  const userId = req.user._id;

 const records = await MedicalRecord.find({ patient: userId })
  .populate({
    path: "appointment",
    populate: [
      {
        path: "patient",
        select: "fullName email", // or whatever fields you want
      },
      {
        path: "doctor",
        populate: {
          path: "user",
          select: "fullName email", // select what you want
        },
      },
    ],
  });

  res
    .status(200)
    .json(new ApiResponse(200, records, "Patient medical records"));
});
