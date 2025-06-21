import MedicalRecord from "../models/medicalRecod.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import Appointment from "../models/appointment.model.js";
import DoctorProfile from "../models/doctorProfile.model.js";

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
  const records = await MedicalRecord.find()
    .populate({
      path: "patient",
      select: "fullName email role", // 🚫 No password
    })
    .populate({
      path: "doctor",
      populate: {
        path: "user",
        select: "fullName email role", // 🚫 No password
      },
    })
    .populate({
      path: "appointment",
      populate: [
        {
          path: "patient",
          select: "fullName email",
        },
        {
          path: "doctor",
          populate: {
            path: "user",
            select: "fullName email",
          },
        },
      ],
    });

  res
    .status(200)
    .json(
      new ApiResponse(200, records, "All medical records fetched successfully")
    );
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
  const { id } = req.params;


  const record = await MedicalRecord.findById(id);

  if (!record) {
    throw new ApiError(404, "Medical record not found");
  }

  // Update fields manually
  for (const key in req.body) {
    if (req.body[key] !== undefined) {
      record[key] = req.body[key];
    }
  }

  // Save updated record
  const updated = await record.save();

  res
    .status(200)
    .json(new ApiResponse(200, updated, "Medical record updated successfully"));
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
export const getMedicalRecordsByPatientorDoctor = asyncHandler(
  async (req, res) => {
    const { role, _id: userId } = req.user;
    let query = {};

    if (role === "patient") {
      query.patient = userId;
    } else if (role === "doctor") {
      const doctorProfile = await DoctorProfile.findOne({ user: userId });
      if (!doctorProfile) {
        return res
          .status(404)
          .json(new ApiResponse(404, null, "Doctor profile not found"));
      }
      query.doctor = doctorProfile._id;
    } else {
      return res.status(403).json(new ApiResponse(403, null, "Access denied"));
    }

    const records = await MedicalRecord.find(query).populate({
      path: "appointment",
      populate: [
        { path: "patient", select: "fullName email" },
        {
          path: "doctor",
          populate: { path: "user", select: "fullName email" },
        },
      ],
    });

    res
      .status(200)
      .json(new ApiResponse(200, records, `${role} medical records`));
  }
);
