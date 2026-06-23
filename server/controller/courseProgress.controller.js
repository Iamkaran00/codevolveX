import mongoose from "mongoose";
import { Section } from "../models/Section.model.js"
import { CourseProgress } from "../models/CourseProgress.model.js";
import { Course } from '../models/Course.model.js' ;
import { SubSection } from "../models/SubSection.model.js"

const updateCourseProgress = async (req, res) => {
  const { courseId, subsectionId } = req.body
  const userId = req.user.id
  try {
    const subsection = await SubSection.findById(subsectionId)
    if (!subsection) {
      return res.status(404).json({ error: "Invalid subsection" })
    }

    let courseProgress = await CourseProgress.findOne({
      courseId: courseId,
      userId: userId,
    })

    if (!courseProgress) {
      return res.status(404).json({
        success: false,
        message: "Course progress Does Not Exist",
      })
    }

    const alreadyCompleted = courseProgress.completedVideo.includes(subsectionId)

    if (alreadyCompleted) {
      
      courseProgress.completedVideo = courseProgress.completedVideo.filter(
        (id) => id.toString() !== subsectionId
      )
    } else {
      courseProgress.completedVideo.push(subsectionId)
    }
    await courseProgress.save()
    return res.status(200).json({
      message: alreadyCompleted ? "Marked as incomplete" : "Course progress updated",
      completed: !alreadyCompleted,
    })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ error: "Internal server error" })
  }
}
export { updateCourseProgress }