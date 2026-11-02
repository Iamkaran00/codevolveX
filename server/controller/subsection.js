import { SubSection } from "../models/SubSection.model.js";
import { Section } from "../models/Section.model.js";
import { CourseProgress } from "../models/CourseProgress.model.js";
import mongoose from "mongoose";
import {
  deleteFromB2,
  getSignedVideoUrl,
  uploadToB2,
  getObjectSize,
  isB2Key,
  buildVideoKey,
  PART_SIZE,

  getPartUrls,
  finishMultipart,
  abortMultipart,
} from "../utils/b2.js";
import { startMultiPart } from "../utils/b2.js";
const MAX_SIZE = 500 * 1024 * 1024;

const isOwner = (sub, req) => String(sub.owner) === String(req.user?.id);


const createSubSection = async (req, res) => {
  try {
    const { title, description, sectionId, duration } = req.body;

    if (!sectionId || !title || !description) {
      return res.status(400).json({ success: false, message: "Missing Properties" });
    }
    if (!req.file) {
      return res.status(400).json({ success: false, message: "Video file is required" });
    }

    console.log(Date.now(), "date 1");
    const videoKey = await uploadToB2(req.file);
    console.log(Date.now(), "date 2");
    const SubSectionDetails = await SubSection.create({
      title,
      description,
      videoUrl: videoKey,
      timeDuration: String(duration || 0),
    });

    const secid = new mongoose.Types.ObjectId(sectionId);

    const updatedSection = await Section.findByIdAndUpdate(
      { _id: secid },
      { $push: { SubSection: SubSectionDetails._id } },
      { new: true },
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
    return res.status(500).json({ success: false, message: error.message });
  }
};

const updateSubSection = async (req, res) => {
  try {
    const { title, description, subSectionId, sectionId, duration } = req.body;

    if (!subSectionId || !sectionId) {
      return res.status(400).json({ success: false, message: "Missing Properties" });
    }

    const updateData = {};
    if (title) updateData.title = title;
    if (description) updateData.description = description;

    if (req.file) {
      const existing = await SubSection.findById(subSectionId);
      updateData.videoUrl = await uploadToB2(req.file);

      if (duration) updateData.timeDuration = String(duration);
      if (existing?.videoUrl && isB2Key(existing.videoUrl))
        deleteFromB2(existing.videoUrl).catch(() => {});
    }

    await SubSection.findByIdAndUpdate(subSectionId, updateData, { new: true });

    const updatedSection = await Section.findById(sectionId).populate("SubSection").exec();

    return res.status(200).json({
      success: true,
      message: "SubSection Updated Successfully",
      data: updatedSection,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

const deleteSubSection = async (req, res) => {
  try {
    const { subSectionId, sectionId } = req.body;

    if (!subSectionId || !sectionId) {
      return res.status(400).json({ success: false, message: "Missing Properties" });
    }

    const sub = await SubSection.findByIdAndDelete(subSectionId);

    await Section.findByIdAndUpdate(sectionId, { $pull: { SubSection: subSectionId } });

    // remove the deleted lecture from every student's progress
    await CourseProgress.updateMany(
      { completedVideos: subSectionId },
      { $pull: { completedVideos: subSectionId } },
    );

    // remove the video file from B2 (old Cloudinary links start with http, so skip those)
    if (sub?.videoUrl && isB2Key(sub.videoUrl)) {
      deleteFromB2(sub.videoUrl).catch((e) => console.log("B2 delete failed:", e.message));
    }

    const updatedSection = await Section.findById(sectionId).populate("SubSection").exec();

    return res.status(200).json({
      success: true,
      message: "SubSection Deleted Successfully",
      data: updatedSection,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

const getLectureVideoUrl = async (req, res) => {
  try {
    const sub = await SubSection.findById(req.body.subSectionId);
    if (!sub) return res.status(404).json({ success: false, message: "Not Found" });
    if (sub.videoStatus !== "uploaded")
      return res.status(409).json({ success: false, message: "Video is not ready" });
    const url = isB2Key(sub.videoUrl) ? await getSignedVideoUrl(sub.videoUrl) : sub.videoUrl;

    return res.status(200).json({ success: true, url });
  } catch (error) {
    console.log("getLectureVideoUrl error : ", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

/* ---------------- NEW: direct-to-B2 multipart upload ---------------- */

// STAGE 1: authorize, open the multipart upload, hand out one signed URL per part
const initSubSectionUpload = async (req, res) => {
  try {
    const { title, description, sectionId, courseId, duration, fileName, size, contentType } = req.body;

    if (!sectionId || !title || !description || !fileName)
      return res.status(400).json({ success: false, message: "Missing Properties" });
    if (!contentType?.startsWith("video/") || !size || size > MAX_SIZE)
      return res.status(400).json({ success: false, message: "Invalid video file" });

    // add your existing check here: this instructor owns the course and section

    const sub = await SubSection.create({
      title,
      description,
      timeDuration: String(duration || 0),
      owner: req.user?.id,
      course: courseId,
      fileSize: size,
      contentType,
      videoStatus: "uploading",
    });

    const key = buildVideoKey(sub._id, fileName);
    const uploadId = await startMultipart(key, contentType);
    sub.videoUrl = key;
    sub.uploadId = uploadId;
    await sub.save();

    await Section.findByIdAndUpdate(sectionId, { $addToSet: { SubSection: sub._id } });
    const updatedSection = await Section.findById(sectionId).populate("SubSection").exec();

    const partCount = Math.ceil(size / PART_SIZE);
    const urls = await getPartUrls(
      key,
      uploadId,
      Array.from({ length: partCount }, (_, i) => i + 1),
    );

    return res.status(200).json({
      success: true,
      subSectionId: sub._id,
      partSize: PART_SIZE,
      urls,
      updatedSection,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// STAGES 3-4: join the parts on B2, verify the size, record the status
const completeSubSectionUpload = async (req, res) => {
  const { subSectionId, sectionId, parts } = req.body;
  try {
    const sub = await SubSection.findOne({ _id: subSectionId, videoStatus: "uploading" });
    if (!sub || !isOwner(sub, req))
      return res.status(409).json({ success: false, message: "Not found or already completed" });

    const expected = Math.ceil(sub.fileSize / PART_SIZE);
    if (!Array.isArray(parts) || parts.length !== expected) throw new Error("wrong number of parts");

    await finishMultipart(sub.videoUrl, sub.uploadId, parts);
    if ((await getObjectSize(sub.videoUrl)) !== sub.fileSize) throw new Error("size mismatch");

    await SubSection.findOneAndUpdate(
      { _id: sub._id, videoStatus: "uploading" },
      { videoStatus: "uploaded" },
    );
    const updatedSection = await Section.findById(sectionId).populate("SubSection").exec();
    return res.status(200).json({ success: true, updatedSection });
  } catch (error) {
    console.log(error);
    await SubSection.findOneAndUpdate(
      { _id: subSectionId, owner: req.user?.id, videoStatus: "uploading" },
      { videoStatus: "failed", error: error.message },
    );
    return res.status(422).json({ success: false, message: "Upload could not be verified" });
  }
};

// a signed part URL expired mid-upload: issue fresh ones for just those parts
const refreshPartUrls = async (req, res) => {
  try {
    const { subSectionId, partNumbers } = req.body;
    if (!subSectionId || !Array.isArray(partNumbers) || !partNumbers.length)
      return res.status(400).json({ success: false, message: "Missing Properties" });

    const sub = await SubSection.findOne({ _id: subSectionId, videoStatus: "uploading" });
    if (!sub || !isOwner(sub, req))
      return res.status(404).json({ success: false, message: "Upload not found" });

    const maxPart = Math.ceil(sub.fileSize / PART_SIZE);
    const valid = partNumbers.filter((n) => Number.isInteger(n) && n >= 1 && n <= maxPart).slice(0, 50);
    const urls = await getPartUrls(sub.videoUrl, sub.uploadId, valid, 3600);
    return res.status(200).json({ success: true, urls });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// instructor cancels mid-upload: discard the parts on B2 and remove the record
const abortSubSectionUpload = async (req, res) => {
  try {
    const { subSectionId, sectionId } = req.body;
    if (!subSectionId || !sectionId)
      return res.status(400).json({ success: false, message: "Missing Properties" });

    const sub = await SubSection.findOne({ _id: subSectionId, videoStatus: "uploading" });
    if (!sub || !isOwner(sub, req))
      return res.status(404).json({ success: false, message: "Upload not found" });

    await abortMultipart(sub.videoUrl, sub.uploadId).catch(() => {});
    await sub.deleteOne();
    await Section.findByIdAndUpdate(sectionId, { $pull: { SubSection: subSectionId } });

    const updatedSection = await Section.findById(sectionId).populate("SubSection").exec();
    return res.status(200).json({ success: true, updatedSection });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

export {
  createSubSection,
  updateSubSection,
  deleteSubSection,
  getLectureVideoUrl,
  initSubSectionUpload,
  completeSubSectionUpload,
  refreshPartUrls,
  abortSubSectionUpload,
};