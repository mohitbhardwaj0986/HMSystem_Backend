import Appointment from "../models/appointment.model.js";
import DoctorProfile from "../models/doctorProfile.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";

const createAppointment = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const {appointmentDate, timeSlot, reason } = req.body;

  if (!appointmentDate || !timeSlot) {
    throw new ApiError(
      400,
      "Doctor, appointment date, and time slot are required"
    );
  }
  const {id:doctorId} = req.params;
  
  const doctorExists = await DoctorProfile.findOne({_id:doctorId});
  if (!doctorExists) {
    throw new ApiError(404, "Doctor not found");
  }

  const appointment = await Appointment.create({
    patient: userId,
    doctor:doctorId,
    appointmentDate,
    timeSlot,
    reason,
  });

  res
    .status(201)
    .json(
      new ApiResponse(201, appointment, "Appointment created successfully")
    );
});

// @desc    Get all appointments for current patient
// @route   GET /api/v1/appointments/me
const getMyAppointments = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const appointments = await Appointment.find({ patient: userId })
    .populate("doctor", "specialization consultationFee")
    .populate("patient", "fullName");

  res.status(200).json(new ApiResponse(200, appointments, "Your appointments"));
});

// @desc    Get all appointments for doctor
// @route   GET /api/v1/appointments/doctor
const getDoctorAppointments = asyncHandler(async (req, res) => {
  const doctorProfile = await DoctorProfile.findOne({ user: req.user._id });

  if (!doctorProfile) {
    throw new ApiError(403, "Access denied. You are not a doctor.");
  }

  const appointments = await Appointment.find({ doctor: doctorProfile._id })
    .populate("patient", "fullName email")
    .sort({ appointmentDate: 1 });

  res
    .status(200)
    .json(new ApiResponse(200, appointments, "Doctor appointments"));
});



// @desc    Admin: Get all appointments
// @route   GET /api/v1/appointments
const getAllAppointments = asyncHandler(async (req, res) => {
  if (req.user.role !== "admin") {
    throw new ApiError(403, "Only admin can access all appointments");
  }

  const appointments = await Appointment.find()
    .populate("patient", "fullName email")
    .populate("doctor", "specialization")
    .sort({ createdAt: -1 });

  res.status(200).json(new ApiResponse(200, appointments, "All appointments"));
});

// @desc    Admin: Delete an appointment
// @route   DELETE /api/v1/appointments/:id
const deleteAppointment = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (req.user.role !== "admin") {
    throw new ApiError(403, "Only admin can delete appointments");
  }

  const deleted = await Appointment.findByIdAndDelete(id);

  if (!deleted) {
    throw new ApiError(404, "Appointment not found");
  }

  res
    .status(200)
    .json(new ApiResponse(200, {}, "Appointment deleted successfully"));
});

export {
  createAppointment,
  getMyAppointments,
  getDoctorAppointments,
  getAllAppointments,
  deleteAppointment,
};
