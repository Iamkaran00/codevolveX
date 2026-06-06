import express from "express";
const router = express.Router();
import { uploadVideo,uploadImage } from "../middleware/multer.middleware.js";
import {auth ,isInstructor, isStudent} from '../middleware/auth.middleware.js';
import {updateProfile,deleteAccount,getAllUserDetails,updateDisplayPicture,getEnrolledCourses,instructorDashboard} from "../controller/profile.controller.js";
// ********************************************************************************************************
//                                      Profile routes
// ********************************************************************************************************
// Delete User Account
router.delete("/deleteProfile", auth,isStudent, deleteAccount);
router.put("/updateProfile", auth, updateProfile );
router.get("/getUserDetails", auth, getAllUserDetails);
// Get Enrolled Courses->
router.get("/getEnrolledCourses", auth, getEnrolledCourses);
router.put("/updateDisplayPicture", auth,uploadImage.single("image") ,updateDisplayPicture);
router.get("/instructorDashboard", auth, isInstructor, instructorDashboard);
export default router;