import { mongoose,Schema } from "mongoose";

const profileSchema  = new Schema(
 {
    gender : {
        type : String, 
        trim : true,
        
    },
    dateOfBirth : {
        type : String,
        trim : true,
    },
    about : { 
         type : String, 
         trim : true,
    },
    contactNumber : {
        type : String,
        trim : true
    }
},
{
timestamps : true
})
export const Profile = mongoose.model("Profile", profileSchema);