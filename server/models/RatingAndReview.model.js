import  mongoose,{Schema } from "mongoose";

const ratingsAndReviewSchema = new Schema (
    {
        user : {
            type : Schema.Types.ObjectId,
            required : true,
            ref : "User"
        },
        rating : {
            type : Number,
            required : true
        },
        review : {
            type : String,
            required : true 
        },
        course : {
            type : Schema.Types.ObjectId,
            required : true,
            ref : "Course",
            index : true,
        }
    }
)

export const ratingsAndReview = mongoose.model("RatingsAndReview",ratingsAndReviewSchema);