import Notification from "../models/notification.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

// Admin: Create Notification
export const createNotification = asyncHandler(async (req, res) => {
  const { recipient, message } = req.body;

  if (!recipient || !message) {
    throw new ApiError(400, "Recipient and message are required");
  }

  const notification = await Notification.create({ recipient, message });

  res
    .status(201)
    .json(new ApiResponse(201, notification, "Notification created"));
});

// Admin: Delete Notification
export const deleteNotification = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const notification = await Notification.findByIdAndDelete(id);

  if (!notification) {
    throw new ApiError(404, "Notification not found");
  }

  res.status(200).json(new ApiResponse(200, {}, "Notification deleted"));
});

// Admin: Get All Notifications
export const getAllNotifications = asyncHandler(async (req, res) => {
  const notifications = await Notification.find().populate(
    "recipient",
    "fullName email"
  );

  res
    .status(200)
    .json(new ApiResponse(200, notifications, "All notifications fetched"));
});

// User: Get Own Notifications
export const getMyNotifications = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const notifications = await Notification.find({ recipient: userId }).sort({
    createdAt: -1,
  });

  res
    .status(200)
    .json(new ApiResponse(200, notifications, "Your notifications fetched"));
});

// User: Mark Notification as Read
export const markNotificationAsRead = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userId = req.user._id;

  const notification = await Notification.findOne({
    _id: id,
    recipient: userId,
  });

  if (!notification) {
    throw new ApiError(404, "Notification not found or unauthorized");
  }

  notification.isRead = true;
  await notification.save();

  res
    .status(200)
    .json(new ApiResponse(200, notification, "Notification marked as read"));
});
