import express from "express";
import {
  createPrescription,
  getPrescriptionByAppointment,
  updatePrescription,
  deletePrescription,
  getAllPrescriptions,
  getMyPrescriptions,
} from "../controllers/prescription.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.route("/create/:id").post(verifyJWT, createPrescription);
router
  .route("/appointment/:appointmentId")
  .get(verifyJWT, getPrescriptionByAppointment);
router.route("/update/:id").patch(verifyJWT, updatePrescription);
router.route("/delete/:id").delete(verifyJWT, deletePrescription);
router.route("/all").get(verifyJWT, getAllPrescriptions);
router.route("/me").get(verifyJWT, getMyPrescriptions);

export default router;
