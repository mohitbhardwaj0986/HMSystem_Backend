// routes/notification.routes.js

import express from "express";
import {
  createNotification,
  deleteNotification,
  getAllNotifications,
  getMyNotifications,
  markNotificationAsRead,
} from "../controllers/notification.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.route("/create").post(verifyJWT, createNotification); // admin
router.route("/delete/:id").delete(verifyJWT, deleteNotification); // admin
router.route("/all").get(verifyJWT, getAllNotifications); // admin

router.route("/me").get(verifyJWT, getMyNotifications); // user
router.route("/read/:id").patch(verifyJWT, markNotificationAsRead); // user

export default router;
