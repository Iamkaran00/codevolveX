import { SubSection } from "../models/SubSection.model.js";
import { Section } from "../models/Section.model.js";
import { uploadOnCloudinary } from "../utils/Cloudinary.Uploader.js";
import mongoose from "mongoose";

const createSubSection = async (req, res) => {
  try {
    const { title, description, sectionId } = req.body;

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

    const video = req.file.path;
    const video_url = await uploadOnCloudinary(video);

    const SubSectionDetails = await SubSection.create({
      title,
      description,
      videoUrl: video_url.secure_url,
      timeDuration: String(video_url.duration || 0),
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
    const { title, description, subSectionId, sectionId } = req.body;

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
      const video_url = await uploadOnCloudinary(req.file.path);
      updateData.videoUrl = video_url.secure_url;
      updateData.timeDuration = String(video_url.duration || 0);
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

    await SubSection.findByIdAndDelete(subSectionId);

    await Section.findByIdAndUpdate(sectionId, {
      $pull: { SubSection: subSectionId },
    });

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

export { createSubSection, updateSubSection, deleteSubSection };