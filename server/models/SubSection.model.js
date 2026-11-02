import mongoose, { Schema } from "mongoose";

const SubSectionSchema = new Schema(
  {
    title : {
        type : String,
    
    },
    timeDuration : {
        type : String, 

    },
    description : {
        type : String,
    },
    videoUrl : {
        type : String,
    }, 
    videoStatus : {
        type : String , 
        enum : ['uploading' , 'uploaded' , 'failed'] , 
       index : true , 
        default : 'uploaded' // old lectures taken count as uploaded 
    } ,
    owner : {type : Schema.Types.ObjectId,ref : 'User'} , 
    course : {type : Schema.Types.ObjectId , ref : "Course"} , 
    fileSize : Number , 
    contentType : String , 
    error : String , 

  } , 
  {timestamps : true} 
  
);
export const SubSection = mongoose.model("SubSection", SubSectionSchema);
