// Import the required modules
import express from "express";
import {
  uploadVideo,
  uploadImage,
} from "../middleware/multer.middleware.js";
const router = express.Router();
 
import { login ,signUp, sendOTP, changePassword } from "../controller/Auth.js";
import { createSubSection } from "../controller/Subsection.controller.js";
import { createSection } from "../controller/section.controller.js";
import {
  resetPasswordToken,
  resetPassword,
} from "../controller/resetPassword.controller.js";
import { auth } from "../middleware/auth.middleware.js";
 router.post(
  "/createCourse",
  auth,
  uploadImage.single("thumbnail"),
  
);

router.post(
  "/createSubSection",
  auth,
  uploadVideo.single("video"),
  createSubSection
);
// Route for user login
router.post("/login", login);
// Route for user signup
router.post(
  "/signup",
  
  signUp
);
// Route for sending OTP to the user's email
router.post("/sendotp", sendOTP);
// Route for Changing the password
router.post("/changepassword", auth, changePassword);
 
// Route for generating a reset password token
router.post("/reset-password-token", resetPasswordToken);
// Route for resetting user's password after verification
router.post("/reset-password", resetPassword);
// Export the router for use in the main application
export default router;
