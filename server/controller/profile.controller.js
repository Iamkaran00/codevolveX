import { Profile } from "../models/Profile.js";
import { User } from "../models/User.js";
import { Course } from "../models/Course.js";
import { uploadOnCloudinary } from "../utils/cloudinaryuploader.js";
import mongoose, { mongo } from "mongoose";

const updateProfile = async (req, res) => {
  try {
    const { gender, dateOfBirth, contactNumber, about } = req.body;
    const id = req.user.id;
    const data = [gender, dateOfBirth, contactNumber, about];
    if (data.some((ele) => !ele || ele.trim() === "")) {
      return res.status(402).json({
        success: false,
        message: "fill all the entries",
      });
    }
    const userDetails = await User.findById(id);
    const profileId = userDetails.additionalDetails;
    const profileDetails = await Profile.findById(profileId);

    profileDetails.dateOfBirth = dateOfBirth;
    profileDetails.gender = gender;
    profileDetails.contactNumber = contactNumber;
    profileDetails.about = about;

    await profileDetails.save();
    return res.status(200).json({
      success: true,
      message: "Profile Details updated",
      profileDetails,
    });
  } catch (error) {
    return res.status(402).json({
      success: false,
      message: error.message,
    });
  }
};
const deleteAccount = async (req, res) => {
  try {
    const id = req.user.id;
    const userDetails = await User.findById({ _id: id });
    if (!userDetails) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    const profileDetailsid = userDetails.additionalDetails;
    await Profile.findByIdAndDelete(profileDetailsid);
    const courseids = userDetails.courses;
        //delete profile
    //delete profile
if (courseids.length !== 0) {
  await Course.deleteMany({ _id: { $in: courseids } });
}
    await User.findByIdAndDelete(id);
    return res.status(200).json({
      success: true,
      message: "User Removed Successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "User Cannot be deleted successfully",
    });
  }
};
const getAllUserDetails = async (req, res) => {
  try {
    const id = req.user.id;

    const userdetails = await User.findById({ _id: id })
      .populate("additionalDetails")
      .exec();
    return res.status(200).json({
      success: true,
      message: "User Details got find",
      data: userdetails,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: "User did not found",
    });
  }
};
const updateDisplayPicture = async (req, res) => {
  try {
    const displayPicture = req.file?.path;
    const userId = req.user.id;
    const image = await uploadOnCloudinary(displayPicture);

    if (!image || !image.secure_url) {
      return res
        .status(500)
        .json({ success: false, message: "Cloudinary upload failed" });
    }

    const updatedProfile = await User.findByIdAndUpdate(
      { _id: userId },
      { image: image.secure_url },
      { new: true },
    );
    res.send({
      success: true,
      message: `Image Updated successfully`,
      data: updatedProfile,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getEnrolledCourses = async (req, res) => {
  try {
    console.log('hello in profile');
    const userId = req.user.id;
    let userDetails = await User.findOne({
      _id: userId,
    })
      .populate({
        path: "courses",
        populate: {
          path: "courseContent",
          populate: {
            path: "subSection",
          },
        },
      })
      .exec();
    userDetails = userDetails.toObject();
    var SubsectionLength = 0;
    for (var i = 0; i < userDetails.courses.length; i++) {
      let totalDurationInSeconds = 0;
      SubsectionLength = 0;
      for (let j = 0; j < userDetails.courses[i].courseContent.length; j++) {
        totalDurationInSeconds += userDetails.courses[i].courseContent[
          j
        ].subSection.reduce(
          (acc, curr) => acc + parseInt(curr.timeDuration),
          0,
        );
        userDetails.courses[i].totalDuration = convertSecondsToDuration(
          totalDurationInSeconds,
        );
        SubsectionLength +=
          userDetails.courses[i].courseContent[j].subSection.length;
      }
      let courseProgressCount = await CourseProgress.findOne({
        courseID: userDetails.courses[i]._id,
        userId: userId,
      });
      courseProgressCount = courseProgressCount?.completedVideos.length;
      if (SubsectionLength === 0) {
        userDetails.courses[i].progressPercentage = 100;
      } else {
        // To make it up to 2 decimal point
        const multiplier = Math.pow(10, 2);
        userDetails.courses[i].progressPercentage =
          Math.round(
            (courseProgressCount / SubsectionLength) * 100 * multiplier,
          ) / multiplier;
      }
    }

    if (!userDetails) {
      return res.status(400).json({
        success: false,
        message: `Could not find user with id: ${userDetails}`,
      });
    }
    return res.status(200).json({
      success: true,
      data: userDetails.courses,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};
const instructorDashboard = async (req, res) => {
  try {
    const courseDetails = await Course.find({ instructor: req.user.id });

    const courseData = courseDetails.map((course) => {
      const totalStudentsEnrolled = course.studentsEnroled.length;
      const totalAmountGenerated = totalStudentsEnrolled * course.price;

      // Create a new object with the additional fields
      const courseDataWithStats = {
        _id: course._id,
        courseName: course.courseName,
        courseDescription: course.courseDescription,
        // Include other course properties as needed
        totalStudentsEnrolled,
        totalAmountGenerated,
      };

      return courseDataWithStats;
    });

    res.status(200).json({ courses: courseData });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};
export {
  updateProfile,
  deleteAccount,
  getAllUserDetails,
  updateDisplayPicture,
  getEnrolledCourses,
  instructorDashboard,
};
