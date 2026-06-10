import {mongoose, Schema } from "mongoose";

const progressSchema = new Schema(
  {
    courseId: {
      type: Schema.Types.ObjectId,
      ref: "Course",
    },userId : {
      type : Schema.Types.ObjectId,
      ref : "User"
    },
    completedVideo: [
      {
        type: Schema.Types.ObjectId,
        ref: "SubSection",
      },
    ],
  },
  {
    timestamps: true,
  }
);
export const CourseProgress = mongoose.model("courseProgress", progressSchema);
