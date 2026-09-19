import { ratingsAndReview } from "../models/RatingAndReview.model.js";
import { Course } from "../models/Course.model.js";
import mongoose from "mongoose";
import { getOrSetCache ,invalidateCache,invalidateCacheByPattern} from "../utils/cache.js";

const createRating = async (req, res) => {
  try {
    const { rating, review, courseId } = req.body;
    const uid = req.user.id; 

    if (!rating || !review) {
      return res.status(400).json({ success: false, message: "All fields are mandatory" });
    }

    const courseDetails = await Course.findOne({
      _id: courseId,
      studentsEnrolled: { $elemMatch: { $eq: uid } },
    });
    if (!courseDetails) {
      return res.status(404).json({ success: false, message: "You are not enrolled in this course" });
    }

    const reviewed = await ratingsAndReview.findOne({ user: uid, course: courseId });
    if (reviewed) {
      return res.status(400).json({ success: false, message: "You have already reviewed this course" });
    }

    const rAndr = await ratingsAndReview.create({ rating, review, user: uid, course: courseId });

    await Course.findByIdAndUpdate(courseId, { $push: { ratingsAndReview: rAndr._id } }, { new: true });
 await invalidateCache(
      `course:${courseId}:avgRating`,
      `course:${courseId}:reviews`,
      `course:${courseId}:details`
    );
    await invalidateCacheByPattern("reviews:all*");
    await invalidateCacheByPattern("courses:all*"); // avg rating shows in catalogue cards too

    return res.status(200).json({ success: true, message: "Rating and review added successfully" });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Something went wrong" });
  }
};

const averageRatings = async (req, res) => {
  try {
    const { courseId } = req.query;
    const cacheKey = `course:${courseId}:avgRating` ; 
    const {data : averageRatings} = await getOrSetCache(cacheKey,600 , async()=>{
     const result = await ratingsAndReview.aggregate([
      { $match: { course: new mongoose.Types.ObjectId(courseId) } },
      { $group: { _id: null, averageRatings: { $avg: "$rating" } } },
    ]);
  
    if (result.length > 0) {
      return result[0].averageRatings ; 
    }
    return 0;
    })
   
    return res.status(200).json({ success: true, message: "No ratings yet", averageRatings: averageRatings });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Something went wrong" });
  }
};

const reviewsAndRatingForCourse = async (req, res) => {
  try {
    const { courseId } = req.query;
     const cacheKey = `course:${courseId}:reviews` ;
     const {data:reviews} = await getOrSetCache(cacheKey , 600,async()=>{
      const reviews = await ratingsAndReview
      .find({ course: courseId })
      .sort({ rating: "desc" })
      .populate({ path: "course", select: "courseName" })
      .populate({ path: "user", select: "firstName lastName email image" })
      .exec();
      return reviews;
     })
    
    return res.status(200).json({
      success: true,
      message: "Ratings and reviews fetched successfully",
      data: reviews,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Something went wrong" });
  }
};

const gettingAllRatings = async (req, res) => {
  try {
    const {data:AllReviews} = await getOrSetCache('reviews:all',300,async()=>{
    const AllReviews = await ratingsAndReview
      .find({})
      .populate({ path: "user", select: "firstName lastName email image" })
      .populate({ path: "course", select: "courseName" });
return AllReviews;
    })
    
    return res.status(200).json({ success: true, message: "All reviews fetched", data: AllReviews });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Something went wrong" });
  }
};

export { gettingAllRatings, reviewsAndRatingForCourse, createRating, averageRatings };