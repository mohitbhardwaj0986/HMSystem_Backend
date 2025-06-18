// routes/doctorProfile.routes.js
import express from "express";
import {
  createDoctorProfile,
  getMyDoctorProfile,
  updateDoctorProfile,
  deleteDoctorProfile,
  getAllDoctorProfiles,
  getsingledoctor,
} from "../controllers/doctorProfile.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.route("/create").post(verifyJWT, createDoctorProfile);
router.route("/update").patch(verifyJWT, updateDoctorProfile);
router.route("/delete").delete(verifyJWT, deleteDoctorProfile);
router.route("/all-doctors").get(getAllDoctorProfiles);
router.route("/singledoctor/:id").get(verifyJWT,getsingledoctor);

router.route("/me").get(verifyJWT, getMyDoctorProfile);

export default router;
