// Import the required modules
import express from "express";
const router = express.Router()

import {capturePayment,verifySignature,enrollStudents,sendPaymentSuccessEmail} from '../controller/payment.js'
import {auth , isStudent} from "../middleware/auth.middleware.js";
router.post("/capturePayment", auth, isStudent, capturePayment)
router.post("/verifySignature",auth, isStudent, verifySignature)
router.post(
  "/sendPaymentSuccessEmail",
  auth,
  isStudent,
  sendPaymentSuccessEmail
)
export default router;