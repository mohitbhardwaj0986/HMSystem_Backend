import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());


import userRouter from "./src/routes/user.routes.js"
import doctorProfileRouter from "./src/routes/doctorProfile.routes.js"
import appointmentRouter from "./src/routes/appointment.routes.js"
import prescriptionRouter from "./src/routes/prescription.routes.js"
import medicalRecordRouter from "./src/routes/medicalRecord.routes.js"
import notificationRouter from "./src/routes/notification.routes.js"
import billRouter from "./src/routes/bill.routes.js"

app.use("/api/v1/user", userRouter)
app.use("/api/v1/doctorprofile", doctorProfileRouter)
app.use("/api/v1/appointment", appointmentRouter)
app.use("/api/v1/prescription", prescriptionRouter)
app.use("/api/v1/medicalrecord", medicalRecordRouter)
app.use("/api/v1/notification", notificationRouter)
app.use("/api/v1/bill", billRouter)


export default app;
