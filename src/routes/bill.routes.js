import express from "express";
import {
  createBill,
  updateBill,
  deleteBill,
  getAllBills,
  getMyBills,
} from "../controllers/bill.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = express.Router();

// Admin routes
router.route("/create/:appointmentId").post(verifyJWT, createBill);
router.route("/update/:id").patch(verifyJWT, updateBill);
router.route("/delete/:id").delete(verifyJWT, deleteBill);
router.route("/all").get(verifyJWT, getAllBills);

// User route
router.route("/me").get(verifyJWT, getMyBills);

export default router;
