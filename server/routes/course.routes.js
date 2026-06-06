// Import the required modules
import express from "express";
const router = express.Router();

// Import the Controllers

// Course Controllers Import

import {
  createCourse,editCourse,showAllCourses,deleteCourse,getInstructorCourses,getFullCourseDetails,getCourseDetails
} from "../controller/course.controller.js";
// Categories Controllers Import
import {
  showAllCategory,
  createCategory,
  categoryPageDetails,
} from "../controller/category.controller.js";


import {
  createSection,
  updateSection,
  deleteSection,
} from "../controller/section.controller.js";
// Sub-Sections Controllers Import
import {
  createSubSection,
  updateSubSection,
  deleteSubSection,
} from "../controller/Subsection.controller.js";

// Rating Controllers Import
import {
  gettingAllRatings,reviewsAndRatingForCourse,createRating,averageRatings
} from "../controller/ratingsAndReviews.controller.js";



// Importing Middlewares
import {auth , isInstructor,isAdmin,isStudent} from "../middleware/auth.middleware.js";
import { uploadVideo,uploadImage } from "../middleware/multer.middleware.js";
 
 
// Courses can Only be Created by Instructors
router.post("/createCourse", auth, isInstructor,uploadImage.single("thumbnail"), createCourse);
//Add a Section to a Course
router.post("/addSection", auth, isInstructor, createSection);
// Update a Section
router.post("/updateSection", auth, isInstructor, updateSection);
// Delete a Section
router.post("/deleteSection", auth, isInstructor, deleteSection);
// Edit Sub Section
router.post("/updateSubSection", auth, isInstructor, updateSubSection);
// Delete Sub Section
router.post("/deleteSubSection", auth, isInstructor, deleteSubSection);
// Add a Sub Section to a Section
router.post("/addSubSection", auth, isInstructor,uploadVideo.single("videoFile"), createSubSection);
// Get all Registered Courses
router.get("/getAllCourses",  showAllCourses);
// Get Details for a Specific Courses
router.get("/getCourseDetails", getCourseDetails);
// Get Details for a Specific Courses
// Get Details for a Specific Courses
// Get Details for a Specific Courses
router.post("/getFullCourseDetails", auth, getFullCourseDetails)
// router.post("/getFullCourseDetails", auth, getFullCourseDetails);
// Edit Course routes
router.post("/editCourse", auth, isInstructor, editCourse);
// Get all Courses Under a Specific Instructor
router.get("/getInstructorCourses", auth, isInstructor, getInstructorCourses);
// Delete a Course
router.delete("/deleteCourse", deleteCourse);
 
router.post("/createCategory", auth, isAdmin, createCategory);
router.get("/showAllCategories", showAllCategory);
router.post("/getCategoryPageDetails", categoryPageDetails);
 
router.post("/createRating", auth, isStudent, createRating);
router.get("/getAverageRating", averageRatings);
router.get("/getReviews", gettingAllRatings);
router.get("/get",reviewsAndRatingForCourse);

export default router;
