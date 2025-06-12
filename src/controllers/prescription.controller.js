import Prescription from "../models/prescription.model.js";
import Appointment from "../models/appointment.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// Create prescription (Doctor only)
const createPrescription = asyncHandler(async (req, res) => {
  const userRole = req.user.role;
  if (userRole !== "doctor") {
    throw new ApiError(403, "Only doctors can create prescriptions");
  }
  const { id: appointmentId } = req.params;
  const { diagnosis, medicines, advice, nextVisitDate } = req.body;

  if (!diagnosis || !medicines?.length) {
    throw new ApiError(400, "Required fields: diagnosis, medicines");
  }

  const existing = await Prescription.findOne({ appointment: appointmentId });
  if (existing) {
    throw new ApiError(409, "Prescription already exists for this appointment");
  }

  const appointmentData = await Appointment.findOne({_id:appointmentId});
  if (!appointmentData) {
    throw new ApiError(404, "Appointment not found");
  }
appointmentData.status = "completed"
appointmentData.save()
  const prescription = await Prescription.create({
    appointment:appointmentId,
    doctor: req.user._id,
    patient: appointmentData.patient,
    diagnosis,
    medicines,
    advice,
    nextVisitDate,
  });

  return res
    .status(201)
    .json(
      new ApiResponse(201, prescription, "Prescription created successfully")
    );
});

// Get prescription by appointment (Doctor, Patient)
const getPrescriptionByAppointment = asyncHandler(async (req, res) => {
  const { appointmentId } = req.params;

  const prescription = await Prescription.findOne({
    appointment: appointmentId,
  })
    .populate("doctor", "fullName email")
    .populate("patient", "fullName email");

  if (!prescription) {
    throw new ApiError(404, "Prescription not found");
  }

  // Allow only doctor or patient
  if (
    req.user.role !== "admin" &&
    !prescription.doctor._id.equals(req.user._id) &&
    !prescription.patient._id.equals(req.user._id)
  ) {
    throw new ApiError(403, "Not authorized to view this prescription");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, prescription, "Prescription fetched"));
});

// Update prescription (Doctor only)
const updatePrescription = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { diagnosis, medicines, advice, nextVisitDate } = req.body;

  const prescription = await Prescription.findById(id);
  if (!prescription) {
    throw new ApiError(404, "Prescription not found");
  }

  if (req.user.role !== "doctor" || !prescription.doctor.equals(req.user._id)) {
    throw new ApiError(403, "Only the prescribing doctor can update this");
  }

  prescription.diagnosis = diagnosis || prescription.diagnosis;
  prescription.medicines = medicines || prescription.medicines;
  prescription.advice = advice || prescription.advice;
  prescription.nextVisitDate = nextVisitDate || prescription.nextVisitDate;

  await prescription.save();

  return res
    .status(200)
    .json(new ApiResponse(200, prescription, "Prescription updated"));
});

// Delete prescription (Admin only)
const deletePrescription = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (req.user.role !== "admin") {
    throw new ApiError(403, "Only admin can delete prescriptions");
  }

  const deleted = await Prescription.findByIdAndDelete(id);
  if (!deleted) {
    throw new ApiError(404, "Prescription not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Prescription deleted successfully"));
});

// Get all prescriptions (Admin only)
const getAllPrescriptions = asyncHandler(async (req, res) => {
  if (req.user.role !== "admin") {
    throw new ApiError(403, "Only admin can view all prescriptions");
  }

  const prescriptions = await Prescription.find()
    .populate("doctor", "fullName")
    .populate("patient", "fullName");

  return res
    .status(200)
    .json(new ApiResponse(200, prescriptions, "All prescriptions fetched"));
});

// Get my prescriptions (Patient or Doctor)
const getMyPrescriptions = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const role = req.user.role;

  const filter = role === "doctor"
      ? { doctor: userId }
      : role === "patient"
      ? { patient: userId }
      : {};

  if (!Object.keys(filter).length) {
    throw new ApiError(403, "Unauthorized");
  }

  const prescriptions = await Prescription.find(filter)
    .populate("appointment")
    .populate("doctor", "fullName")
    .populate("patient", "fullName");

  return res
    .status(200)
    .json(new ApiResponse(200, prescriptions, "Your prescriptions"));
});

export {
  createPrescription,
  getPrescriptionByAppointment,
  updatePrescription,
  deletePrescription,
  getAllPrescriptions,
  getMyPrescriptions,
};
