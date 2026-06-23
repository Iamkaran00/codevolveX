//reseting password
import { User } from "../models/User.model.js";
import mailSender from "../utils/mailsender.js"
import bcrypt from "bcrypt";
import crypto from "crypto";
const resetPasswordToken = async (req, res) => {
  try {
    const { email } = req.body;
   console.log("hello from reset password");
    //check user for this email , email validation
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User is Not registered",
      });
    }
 
    const token = crypto.randomUUID();
    const updatedDetails = await User.findOneAndUpdate(
      { email },
      { token: token, resetPasswordExpires: Date.now() + 5 * 60 * 60 * 1000 },
      {
        new: true,
      }
    );
    //createurl
    const url = `http://localhost:5173/update-password/${token}`;
    //send mail
    await mailSender(
      email,
      "Click The below link to reset Password",
      `Password Reset Link :${url} `
    );
    //return response
    return res.status(200).json({
      success: true,
      message: "Link generated Successfully and Sent to Email ",
    });
  } catch (error) {
    console.log("An error Occured", error);
    return res.status(401).json({
      success: false,
      message: "Error while generating link",
    });
  }
};

const resetPassword  = async(req,res)=>{
   try {
    

     const {token,password,confirmPassword} = req.body;
     //validation
     if(password !== confirmPassword)return res.status(400).json(
         {
             success : false,
             message : "password unmatched"
         }
     )
     //get userDetails from db using token
     const userDetails = await User.findOne({token : token});
     //if no entry - inavalid token
     if(!userDetails){
         return res.json(
             {
                 success : false,
                 message : "Token is invalid"
             }
         )
     }
     //token time check
     if(userDetails.resetPasswordExpires < Date.now()){
         return res.status(401).json(
             {
                 success : false,
                 message : "time has expired"
             }
         )
     }
     //hash password
     const hashedPassword = await bcrypt.hash(password,10);
     //update password
     await User.findOneAndUpdate({token: token },
         {password : hashedPassword,
          token : undefined,
         },
         {new : true}
     )
     //return response
     return res.status(200).json(
         {
             success : true,
             message:  "Password reset Successfully"
         }
     )
   } catch (error) {
    return res.status(401).json(
        {
            success : false,
            message : "cannot reset password"
        }
    )
    
   }
}

export  {resetPasswordToken,resetPassword};
