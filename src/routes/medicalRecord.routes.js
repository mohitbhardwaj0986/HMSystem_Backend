import express from "express";
import {
  createMedicalRecord,
  getAllMedicalRecords,
  getMedicalRecordById,
  updateMedicalRecord,
  deleteMedicalRecord,
  getMedicalRecordsByPatient,
} from "../controllers/medicalRecord.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = express.Router();

// Routes
router.route("/create/:id").post(verifyJWT, createMedicalRecord);
router.route("/update/:id").patch(verifyJWT, updateMedicalRecord);
router.route("/delete/:id").delete(verifyJWT, deleteMedicalRecord);
router.route("/all").get(verifyJWT, getAllMedicalRecords);
router.route("/patient").get(verifyJWT, getMedicalRecordsByPatient);
router.route("/:id").get(verifyJWT, getMedicalRecordById);

export default router;
