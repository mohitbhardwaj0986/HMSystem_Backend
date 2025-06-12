import Bill from "../models/bill.model.js";
import Appointment from "../models/appointment.model.js"
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

// Admin: Create Bill

const createBill = asyncHandler(async (req, res) => {
  const { appointmentId } = req.params;
  const { services, paymentMethod, notes } = req.body;

  if (!services || services.length === 0) {
    throw new ApiError(400, "At least one service is required");
  }

  const appointment = await Appointment.findById(appointmentId).populate(
    "patient doctor"
  );
  if (!appointment) {
    throw new ApiError(404, "Appointment not found");
  }

  // Check if bill already exists for this appointment
  const existingBill = await Bill.findOne({ appointment: appointmentId });
  if (existingBill) {
    throw new ApiError(400, "Bill already exists for this appointment");
  }

  const totalAmount = services.reduce((sum, item) => sum + item.cost, 0);

  const bill = await Bill.create({
    patient: appointment.patient._id,
    doctor: appointment.doctor._id,
    appointment: appointment._id,
    services,
    totalAmount,
    paymentMethod,
    isPaid: true,
    paidAt:  new Date(),
    notes,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, bill, "Bill created successfully"));
});

// Admin: Update Bill
const updateBill = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const bill = await Bill.findById(id);
  if (!bill) {
    throw new ApiError(404, "Bill not found");
  }

  const updatedFields = req.body;
  Object.assign(bill, updatedFields);
  await bill.save();

  res.status(200).json(new ApiResponse(200, bill, "Bill updated successfully"));
});

// Admin: Delete Bill
const deleteBill = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const bill = await Bill.findByIdAndDelete(id);
  if (!bill) {
    throw new ApiError(404, "Bill not found");
  }

  res.status(200).json(new ApiResponse(200, {}, "Bill deleted successfully"));
});

// Admin: Get All Bills
const getAllBills = asyncHandler(async (req, res) => {
  const bills = await Bill.find()
    .populate("patient", "fullName email")
    .populate("doctor", "fullName email")
    .populate("appointment", "appointmentDate");

  res.status(200).json(new ApiResponse(200, bills, "All bills fetched"));
});

// User: Get Own Bills
const getMyBills = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const bills = await Bill.find({ patient: userId })
    .populate("doctor", "fullName")
    .populate("appointment", "appointmentDate");

  res.status(200).json(new ApiResponse(200, bills, "Your bills fetched"));
});

export { createBill, updateBill, getMyBills, getAllBills, deleteBill };
