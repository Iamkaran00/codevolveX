import { Schema, mongoose } from "mongoose";

const userSchema = new Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    lastName: {
      type: String,
   
      trim: true,
      default : "" 
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase :true
    },
    password: {
      type: String,
      required: function() {return this.authProvider === 'local'},
    },
    googleId : {type : String , unique : true , sparse: true} , 
    authProvider : {type : String, enum : ['local' , 'google'] , default : 'local'},
    
    accountType: {
      type: String,
      enum: ["Student", "Instructor", "Admin"],
    },
    approved: {
      type: Boolean,
      default: true,
    },
    active: {
      type: Boolean,
      default: true,
    },
    additionalDetails: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "Profile",
    },
    courses: [
      {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "Course",
      },
    ],
    image: {
      type: String,
    },
    courseProgress: [
      {
        type: Schema.Types.ObjectId,
        ref: "CourseProgress",
      },
    ],
    token: {
      type: String,
    },
    resetPasswordExpires: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);
export const User = mongoose.model("User", userSchema);
