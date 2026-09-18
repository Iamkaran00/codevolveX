import express from "express";
import {
  uploadVideo,
  uploadImage,
} from "../middleware/multer.middleware.js";
const router = express.Router();
 
import { login ,signUp, sendOTP, changePassword } from "../controller/auth.js";
import { createSubSection } from "../controller/subsection.js";
import { createSection } from "../controller/section.js";

import {
  resetPasswordToken,
  resetPassword,
} from "../controller/resetPassword.js";
import { auth } from "../middleware/auth.middleware.js";
import { slidingWindowLimiter } from "../middleware/rateLimiter.js";
import { createCourse } from "../controller/course.js";
 router.post(
  "/createCourse",
  auth,
  uploadImage.single("thumbnail"),
  createCourse
);

router.post(
  "/createSubSection",
  auth,
  uploadVideo.single("video"),
  createSubSection
);
// Route for user login
router.post("/login",slidingWindowLimiter(10,900), login);
// Route for user signup
router.post(
  "/signup",
  slidingWindowLimiter(5,900) , 
  signUp
);
// Route for sending OTP to the user's email
router.post("/sendotp",slidingWindowLimiter(5 ,900) , sendOTP);
// Route for Changing the password
router.post("/changepassword", auth, changePassword);
 
// Route for generating a reset password token
router.post("/reset-password-token", resetPasswordToken);
// Route for resetting user's password after verification
router.post("/reset-password", resetPassword);
// Export the router for use in the main application
export default router;
