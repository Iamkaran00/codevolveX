import {mongoose, Schema } from "mongoose";

const courseSchema = new Schema ({
    courseName : {
        type : String, 
        trim : true,
        required : true,
    },
   courseDescription :  {
    type : String,
    required : true,
    trim : true
        
    },
    instructor : {
        type : Schema.Types.ObjectId,
        ref : "User",
        required : true,
    },
    whatWillYouLearn : {
        type : String, 
        trim : true,
    }
    ,
    courseContent : [{
        type : Schema.Types.ObjectId,
        ref : "Section"
    }
],
ratingsAndReview : [
    {
        type : Schema.Types.ObjectId,
        ref :"RatingsAndReview"
    }
],
price : {
    type : Number,
    required : true
},
thumbnail : {
    type : String,
},
category : {
    type : Schema.Types.ObjectId,
    ref : "Category"
},
tag : {
    type : [String],
},
studentsEnrolled : [{
type : Schema.Types.ObjectId,
ref : "User",
required : true,
}],
instructions : {
    type : [String],
},
status : {
    type : String,
    enum : ["Draft","Published"]
}
},{
    timestamps : true
})

export const Course = mongoose.model("Course",courseSchema);



// Define the Courses schema
 