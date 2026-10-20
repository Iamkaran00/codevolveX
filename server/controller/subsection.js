import { SubSection } from "../models/SubSection.model.js";
import { Section } from "../models/Section.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { CourseProgress } from "../models/CourseProgress.model.js";
import mongoose from "mongoose";
import s3 from "../config/S3Client.js";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import fs from 'fs' ;
import { uploadToB2 } from "../utils/b2.js";
import { deleteFromB2 ,getSignedVideoUrl} from "../utils/b2.js";
const createSubSection = async (req, res) => {
  try {
    const { title, description, sectionId ,duration} = req.body;

    if (!sectionId || !title || !description) {
      return res.status(400).json({
        success: false,
        message: "Missing Properties",
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Video file is required",
      });
    }

    
    const videoKey = await uploadToB2(req.file) ; 
   
    const SubSectionDetails = await SubSection.create({
      title,
      description,
      videoUrl: videoKey ,
      timeDuration: String( duration || 0),
    });

    const secid = new mongoose.Types.ObjectId(sectionId);

    const updatedSection = await Section.findByIdAndUpdate(
      { _id: secid },
      { $push: { SubSection: SubSectionDetails._id } },
      { new: true }
    )
      .populate("SubSection")
      .exec();

    return res.status(200).json({
      success: true,
      message: "SubSection Created Successfully",
      updatedSection,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const updateSubSection = async (req, res) => {
  try {
    const { title, description, subSectionId, sectionId,duration } = req.body;

    if (!subSectionId || !sectionId) {
      return res.status(400).json({
        success: false,
        message: "Missing Properties",
      });
    }

    const updateData = {};
    if (title) updateData.title = title;
    if (description) updateData.description = description;

    
     if (req.file) {
  const existing = await SubSection.findById(subSectionId);
  updateData.videoUrl = await uploadToB2(req.file);
  
  if (duration) updateData.timeDuration = String(duration);
  if (existing?.videoUrl && !existing.videoUrl.startsWith("http"))
    deleteFromB2(existing.videoUrl).catch(() => {});
}
    
 
    await SubSection.findByIdAndUpdate(subSectionId, updateData, { new: true });

    const updatedSection = await Section.findById(sectionId)
      .populate("SubSection")
      .exec();

    return res.status(200).json({
      success: true,
      message: "SubSection Updated Successfully",
      data: updatedSection,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const deleteSubSection = async (req, res) => {
  try {
    const { subSectionId, sectionId } = req.body;
 
    if (!subSectionId || !sectionId) {
      return res.status(400).json({
        success: false,
        message: "Missing Properties",
      });
    }
 
    const sub = await SubSection.findByIdAndDelete(subSectionId);
 
    await Section.findByIdAndUpdate(sectionId, {
      $pull: { SubSection: subSectionId },
    });
 
    // remove the deleted lecture from every student's progress
  
    await CourseProgress.updateMany(
      { completedVideos: subSectionId },
      { $pull: { completedVideos: subSectionId } }
    );
 
    // remove the video file from B2 (old Cloudinary links start with http, so skip those)
    if (sub?.videoUrl && !sub.videoUrl.startsWith("http")) {
      deleteFromB2(sub.videoUrl).catch((e) =>
        console.log("B2 delete failed:", e.message)
      );
    }
 
    const updatedSection = await Section.findById(sectionId)
      .populate("SubSection")
      .exec();
 
    return res.status(200).json({
      success: true,
      message: "SubSection Deleted Successfully",
      data: updatedSection,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
 
const getLectureVideoUrl = async(req ,res) => {
  try {
    const sub = await SubSection.findById(req.body.subSectionId) ; 
    if(!sub) return res.status(404).json({success : false , message : 'Not Found'}) ; 
    const url = sub.videoUrl.startsWith('http')  ? sub.videoUrl : await getSignedVideoUrl(sub.videoUrl) ; 
    return res.status(200).json({success : true , url}) ; 

  } catch (error) {
    console.log('getLectureVideoUrl error : ', error) ; 
    return res.status(500).json({success : false , message : error.message}) ; 
  }
}

export { createSubSection, updateSubSection, deleteSubSection , getLectureVideoUrl };