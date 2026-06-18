import { Section } from "../models/Sections.js";
import { Course } from "../models/Course.js";
import mongoose from "mongoose";

const createSection = async (req, res) => {
  try {
    //fetch data
    const { sectionName, courseId } = req.body;
    //data validation
    if (!sectionName || !courseId)
      return res.status(401).json({
        success: false,
        message: "Missing Properties",
      });
    //creating Section
    const payload = {
      sectionName,
    };
   
    const objectIdOFCourse = new mongoose.Types.ObjectId(courseId);
    const newSection = await Section.create(payload);
    console.log("hello again"); 
    const updatedCourseDetails = await Course.findByIdAndUpdate(
      {_id :  objectIdOFCourse },
      {
        $push: {
          courseContent: newSection._id,
        },
      },
      {
        new: true,
      }
    ).populate("courseContent").exec();
 
console.log("sections in ")
    return res.status(201).json({
      data : updatedCourseDetails,
      success: true,
      message: " Section created Successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: error.message,
    
    });
  }
};
 const updateSection = async(req,res)=>{
    try {
        const {sectionName,sectionId} = req.body;
        if(!sectionName || !sectionId){
            return res.status(400).json(
                {
                    success : false,
                    message : "fill entries"
                }
            )
        }

    const section = await Section.findByIdAndUpdate(sectionId,{
         sectionName
        },{new : true})
   return res.status(200).json(
    {
        success : true,
        message : "Section Updated Successfully"
    }
)
    } catch (error) {
        return res.status(500).json(
            {
                success : false,
                message : "Section Updated denied"
            }
        )
    }
 }

 const deleteSection = async(req,res)=>{
    try {
        const { sectionId, courseId } = req.body;  // add courseId

await Section.findByIdAndDelete(sectionId);
await Course.findByIdAndUpdate(courseId, {
  $pull: { courseContent: sectionId },
});

const updatedCourse = await Course.findById(courseId)
  .populate({
    path: "courseContent",
    populate: { path: "SubSection" },
  })
  .exec();

return res.status(200).json({
  success: true,
  message: "Section Deleted Successfully",
  data: updatedCourse,
})
} catch (error) {
        return res.status(500).json(
            {
                success : false,
                message : "Section Updated denied"
            }
        )
        
    }
 }
 export {createSection,deleteSection,updateSection};