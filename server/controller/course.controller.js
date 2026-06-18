import { Course } from "../models/Course.js";
import { User } from "../models/User.js";
import { Category } from "../models/Category.model.js";
import {uploadOnCloudinary} from "../utils/cloudinaryuploader.js";
import { CourseProgress } from "../models/CourseProgress.js";
import convertSecondsToDuration from "../utils/secToDuration.js";
import { Section } from "../models/Sections.js";
import { SubSection } from "../models/SubSection.js";
import mongoose from "mongoose";
const createCourse = async (req, res) => {
  console.log('here arrived in course controller') ;
  try {
    let {
      courseName,
      courseDescription,
      whatYouWillLearn,
      price,
      category,
      status ,
    } = req.body;
    
     let thumbnail = req.file.path;
     const thumbnail1 = thumbnail.toString();
     console.log(thumbnail,"thumbnailImage");
     const arr = [
      courseName,
      courseDescription,
      whatYouWillLearn,
      price,
      category,
      thumbnail1,
     
    ];
    if (arr.some((elem) => elem == "")) {
      return res.status(401).json({
        success: false,
        message: "Fill All The Entries",
      });
    }
    if(!status || status === undefined){
      status = "Draft"
    }
    const userId = req.user.id;
    const instructorDetails = await User.findById(userId,{
      accountType : "Instructor",
    })
    if (!instructorDetails) {
      return res.status(404).json({
        success: false,
        message: "Instructor Details not found",
      });
    }
    console.log(category, typeof category,'hi there in createcourse');
      const categoryid = new mongoose.Types.ObjectId(category);

    //check given tag is valid
    const categoryDetails = await Category.findById({_id : categoryid});
    if (!categoryDetails) {
      return res.status(404).json({
        success: false,
        message: "category details not found",
      });
    }
   
    const thumbnailImage = await uploadOnCloudinary( thumbnail
    );
   const newCourse = await Course.create({
  courseName,
  courseDescription,
  instructor: instructorDetails._id,
  whatWillYouLearn: whatYouWillLearn,
  price,
  status,
  tag: JSON.parse(req.body.tag),         
  instructions: JSON.parse(req.body.instructions),
  category: categoryDetails._id,
  thumbnail: thumbnailImage.secure_url,
});
    console.log(newCourse);
    await User.findByIdAndUpdate(
      {
        _id: instructorDetails._id,
      },
      {
        $push: {
          courses: newCourse._id,
        },
      },
      {
        new: true,
      }
    );
     console.log("pushed");
    await Category.findByIdAndUpdate(
      { _id: categoryDetails.id },
      {
        $push: {
          course: newCourse._id,
        },
      }
    );
    return res.status(200).json({
     data :  newCourse,
      success: true,
      message: "New Course Created Successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(501).json({
      success: false,
      message: "failed to create new course",
    });
  }
};
const showAllCourses = async (req, res) => {
  try {
    const allCourses = await Course.find(
      {status : 'Published'},
      {
        courseName: true,
        price: true,
        thumbnail : true,
        category : true,
        courseDescription : true,
        instructor: true,
        ratingAndReviews: true,
        studentsEnrolled: true,
      }
    ).populate("instructor").populate('category')
      .exec();
    return res.status(200).json({
      success: true,
      message: "Data of All Courses fetched successfully",
      data: allCourses,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
 
const editCourse  = async(req,res)=>{
  try {
    const {courseId} = req.body;
    console.log(courseId);
    const update = req.body;
    const course = await Course.findById(courseId);
    if(!course){
      return res.status(401).json(
        {
          error : "Course not found",
        }
      )
    }
    if(req.files){
      const thumbnail = req.files.thumbnailImage;
      const thumbnailImage = await uploadOnCloudinary(
        thumbnail,
        process.env.CLOUDINARY_CLOUD_NAME
      )
      course.thumbnail = thumbnailImage.url;
    }
    for(const key in update){
      
        if(key === "tag" || key === "instructions"){
          course[key] = JSON.parse(update[key]);
        } else {
          course[key] = update[key];
        }
      
    }
    await course.save();
    const updatedCourse = await Course.findOne(
      {
        _id : courseId,
      }
    ).populate({
      path : "instructor",
      populate : {
        path : "additionalDetails"
      }
    }).populate("category").populate("ratingsAndReview").populate({
      path : "courseContent",
      populate : {
        path : "SubSection",
      }
    }).exec();
    return res.status(200).json(
      {
        success : true,
        message : "Course updated successfully",
        data : updatedCourse
      }
    )
  } catch (error) {
    console.error(error)
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    })
  }
}
const getInstructorCourses = async (req, res) => {
  try {
     
    const instructorId = req.user.id

   
    const instructorCourses = await Course.find({
      instructor: instructorId,
    }).sort({ createdAt: -1 })

    // Return the instructor's courses
    res.status(200).json({
      success: true,
      data: instructorCourses,
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({
      success: false,
      message: "Failed to retrieve instructor courses",
      error: error.message,
    })
  }
}
const deleteCourse = async (req, res) => {
  try {
    const { courseId } = req.body
 
    // Find the course
    const course = await Course.findById(courseId)
    if (!course) {
      return res.status(404).json({ message: "Course not found" })
    }

    const studentsEnrolled = course.studentsEnrolled
    for (const studentId of studentsEnrolled) {
      await User.findByIdAndUpdate(studentId, {
        $pull: { courses: courseId },
      })
    }

     
    const courseSections = course.courseContent
    for (const sectionId of courseSections) {
      // Delete sub-sections of the section
      const section = await Section.findById(sectionId)
      if (section) {
        const subSections = section.SubSection
        for (const subSectionId of subSections) {
          await SubSection.findByIdAndDelete(subSectionId)
        }
      }

      // Delete the section
      await Section.findByIdAndDelete(sectionId)
    }

    // Delete the course
    await Course.findByIdAndDelete(courseId)

    return res.status(200).json({
      success: true,
      message: "Course deleted successfully",
    })
  } catch (error) {
    console.error(error)
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    })
  }
}
const getCourseDetails = async (req, res) => {
  try {
    const { courseId } = req.query ;
    const courseDetails = await Course.findOne({
      _id: courseId,
    })
      .populate({
        path: "instructor",
        populate: {
          path: "additionalDetails",
        },
      })
      .populate("category")
      .populate('ratingsAndReview')
      .populate({
        path: "courseContent",
        populate: {
          path: "SubSection",
          select: "-videoUrl",
        },
      })
      .exec()

    if (!courseDetails) {
      return res.status(400).json({
        success: false,
        message: `Could not find course with id: ${courseId}`,
      })
    }

    

    let totalDurationInSeconds = 0
    courseDetails.courseContent.forEach((content) => {
      content.subSection.forEach((subSection) => {
        const timeDurationInSeconds = parseInt(subSection.timeDuration)
        totalDurationInSeconds += timeDurationInSeconds
      })
    })

    const totalDuration = convertSecondsToDuration(totalDurationInSeconds)

    return res.status(200).json({
      success: true,
      data: {
        courseDetails,
        totalDuration,
      },
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    })
  }
}
const getFullCourseDetails = async (req, res) => {
  try {
    const { courseId } = req.body
    const userId = req.user.id
    const courseDetails = await Course.findOne({
      _id: courseId,
    })
      .populate({
        path: "instructor",
        populate: {
          path: "additionalDetails",
        },
      })
      .populate("category")
      .populate("ratingsAndReview")
      .populate({
        path: "courseContent",
        populate: {
          path: "SubSection",
        },
      })
      .exec()

    let courseProgressCount = await CourseProgress.findOne({
      courseID: courseId,
      userId: userId,
    })

    console.log("courseProgressCount : ", courseProgressCount)

    if (!courseDetails) {
      return res.status(400).json({
        success: false,
        message: `Could not find course with id: ${courseId}`,
      })
    }

    

    let totalDurationInSeconds = 0
    courseDetails.courseContent.forEach((content) => {
      content.SubSection.forEach((subSection) => {
        const timeDurationInSeconds = parseInt(subSection.timeDuration)
        totalDurationInSeconds += timeDurationInSeconds
      })
    })

    const totalDuration = convertSecondsToDuration(totalDurationInSeconds)

    return res.status(200).json({
      success: true,
      data: {
        courseDetails,
        totalDuration,
        completedVideos: courseProgressCount?.completedVideos
          ? courseProgressCount?.completedVideos
          : [],
      },
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    })
  }
}
export  {createCourse,editCourse,showAllCourses,deleteCourse,getInstructorCourses,getFullCourseDetails,getCourseDetails};