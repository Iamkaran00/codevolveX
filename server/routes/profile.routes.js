import express from "express";
const router = express.Router();
import { uploadVideo,uploadImage } from "../middleware/multer.middleware.js";
import {auth ,isInstructor, isStudent} from '../middleware/auth.middleware.js';
import {updateProfile,deleteAccount,getAllUserDetails,updateDisplayPicture,getEnrolledCourses,instructorDashboard} from "../controller/profile.js";
 
// Delete User Account
const isStudentOrInstructor = (req, res, next) => {
  if (req.user.accountType === "Student" || req.user.accountType === "Instructor") {
    return next();
  }
  return res.status(403).json({ success: false, message: "Access denied" });
};
router.delete('/deleteProfile',auth,isStudentOrInstructor,deleteAccount)
router.put("/updateProfile", auth, updateProfile );
router.get("/getUserDetails", auth, getAllUserDetails);
// Get Enrolled Courses->
router.get("/getEnrolledCourses", auth, getEnrolledCourses);
router.put("/updateDisplayPicture", auth,uploadImage.single("image") ,updateDisplayPicture);
router.get("/instructorDashboard", auth, isInstructor, instructorDashboard);
export default router;