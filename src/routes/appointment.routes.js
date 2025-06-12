// routes/appointment.routes.js
import express from "express";
import {
  createAppointment,
  getMyAppointments,
  getDoctorAppointments,
  getAllAppointments,
  deleteAppointment,
} from "../controllers/appointment.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.route("/create/:id").post(verifyJWT, createAppointment);
router.route("/my-appointments").get(verifyJWT, getMyAppointments);
router.route("/doctor-appointments").get(verifyJWT, getDoctorAppointments);
router.route("/all").get(verifyJWT, getAllAppointments);
router.route("/delete/:id").delete(verifyJWT, deleteAppointment);

export default router;
