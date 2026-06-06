import { SubSection } from "../models/SubSection.js";
import { Section } from "../models/Sections.js";
import {uploadOnCloudinary} from "../utils/cloudinaryuploader.js";
import mongoose, { mongo } from "mongoose";

//create logic of Subsection

const createSubSection = async (req, res) => {
  try {
    const { title, timeDuration, description, sectionId } = req.body;
    //extract file
    console.log(req.file);
    const video = req.file.path;
    //validation
    if (!sectionId || !title || !timeDuration) {
      return res.status(400).json({
        success: false,
        message: "fill entries",
      });
    }
    console.log(video , "here is video");
    
    const video_url = await uploadOnCloudinary(video);
    console.log(video_url , "url is here");
    //create a subsection
    const payload = {
      title: title,
      timeDuration: timeDuration,
      description: description,
      videoUrl: video_url.secure_url,
    };
    const SubSectionDetails = await SubSection.create(payload);
 
    const secid = new mongoose.Types.ObjectId(sectionId)
    const updatedSection = await Section.findByIdAndUpdate(
      { _id : secid },
      {
        $push: {
          SubSection: SubSectionDetails._id,
        },
      },
      {
        new: true,
      }
    )
      .populate("SubSection")
      .exec();
    //return res.
    return res
      .status(200)
      .json({
        success: true,
        message: "Subsection created Successfully",
        updatedSection,
      });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "could not do this",
    });
  }
};

//hw update subsection
const updateSubSection = async (req, res) => {
  try {
    const { title, timeDuration, description, subSectionId } = req.body;
    const data = [title, timeDuration, description];
    if (data.some((ele) => ele.length == "")) {
      return res.status(401).json({
        success: false,
        message: "fill entries",
      });
    }
    const subSectionupdate = await SubSection.findByIdAndUpdate(
      subSectionId,
      {
        title,
        timeDuration,
        description,
      },
      { new: true }
    );
    return res.status(200).json(
        {
            success : true,
            message : "subSection Updated Successfully"
        }
    )
  } catch (error) {
    return res.status(401).json(
        {
            success : false,
            message : "Sub Section could not be updated right now"
        }
    )
  }
};
//delete subsection
 const deleteSubSection = async(req,res)=>{
     
try {
  const id = request.params;
    await SubSection.findByIdAndDelete(id);
    return res.status(200).json(
      {
        success : true,
        message : "Deletion of subsection got succeed"

      }
    )
} catch (error) {
  return res.status(500).json(
    {
      success : false,
      message : "Deletion of Section Failed"
    }
  )
  
}

 }

 export {deleteSubSection,createSubSection,updateSubSection};