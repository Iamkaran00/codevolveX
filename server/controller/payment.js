 
import instance from "../config/razorpay.js";
import { Course } from "../models/Course.model.js";
import { User } from "../models/User.model.js";
import mailSender from "../utils/mailsender.js";
import courseEnrollmentEmail from "../mail/templates/courseEnrollmentEmail.js"
import mongoose from "mongoose";
import crypto from "crypto";
import paymentSuccessEmail from '../mail/templates/payementSuccessEmail.js';
import { CourseProgress } from "../models/CourseProgress.model.js";
import { Order } from "../models/Payment.model.js";
//Capture payment and intitate razorpay order->create order for multiple items buy
const capturePayment=async(req,res)=>{
  
  const {courses}=req.body;
  const userId=req.user.id;

  if(courses.length===0){
    return res.json({
      success:false, 
      message:"Please provide Course Id"
    });
  }
  
  let totalAmount=0;
  console.log(courses);
  for(const course_id of Object.values(courses)){
    let course;
    try{
      course=await Course.findById(course_id);
      if(!course){
        return res.status(404).json({
          success:false,
          message:"Could not find the course"
        });
      }
      const uid=new mongoose.Types.ObjectId(userId);
      if(course.studentsEnrolled.includes(uid)){
        return res.status(200).json({success:false,message:"Student is already enrolled"})
      }
      totalAmount+=course.price;
    }
    catch(error){
      console.log(error);
      return res.status(500).json({
        success:false,
        message:error.message
      })
    }
  }
  
  //Creating options to create order
  const options={
    amount:totalAmount*100,
    currency:"INR",
    receipt:Math.random(Date.now()).toString(),
  }


  try{
    const paymentResponse = await instance.orders.create(options);
    return res.json({
      success:true,
      data:paymentResponse
    })
  }
  catch(error){
    console.log(error);
    return res.status(500).json({
      success:false,
      message:"Could not Intitate Order"
    })
  }
}


//verify the payment 
const verifySignature=async(req,res)=>{
  const razorpay_order_id=req.body?.razorpay_order_id;
  const razorpay_payment_id=req.body?.razorpay_payment_id;
  const razorpay_signature=req.body?.razorpay_signature;
  const courses=req.body?.courses;
  const userId=req.user.id;

  if(!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !courses || !userId){
    return res.status(404).json({
      success:false,
      message:"Payment failed",
    })
  }

  let body=razorpay_order_id + "|" + razorpay_payment_id;
  const expectedSignature=crypto.createHmac("sha256",process.env.RAZORPAY_SECRET).update(body.toString()).digest("hex");
  if(expectedSignature===razorpay_signature){
   

    await enrollStudents(courses,userId,res);
    
    const courseDocs = await Course.find({_id : {$in : Object.values(courses)}}) ;
    const totalAmount = courseDocs.reduce((sum,currentsum) => sum + currentsum.price,0);
    await Order.create({
      user:userId,
      courses : Object.values(courses) , 
      amount : totalAmount,
      razorpay_order_id ,
      razorpay_payment_id,
      status : 'Success'
    })
    return res.status(200).json({
      success:true,
      message:"Payment Verified",
    })
  }  

  return res.status(200).json({
    success:false,
    message:"Payment Failed"
  })
}

const enrollStudents=async(courses,userId,res)=>{

  //first append user id in all courses
  //then append course id in user's courses
  if(!courses || !userId){
    return res.status(400).json({
      success:false,
      message:"Please Provide data for Courses"
    })
  }

  for(const courseId of Object.values(courses)){
        try{
             const enrolledCourse=await Course.findOneAndUpdate({_id:courseId},{
      $push:{
        studentsEnrolled:userId
      }
    },{
      new:true
    });

    if(!enrolledCourse){
      return res.status(500).json({
        success:false,
        message:"Course Not Found"
      })
    }


    const progress=await CourseProgress.create({
      courseId:courseId,
      userId:userId,
      completedVideo:[],
    })



    // find the student and add the course to their list of courses
  const enrolledStudent=await User.findByIdAndUpdate(userId,{
    $push:{
      courses:courseId,
      courseProgress: progress._id,      
    }
  },{new:true});

  //Send mail to the  student

  const emailResponse=await mailSender(
    enrolledStudent.email,
    `Successfully enrolled into ${enrolledCourse.courseName}`,
    courseEnrollmentEmail(enrolledCourse.courseName,`${enrolledStudent.firstName}`)
  );

  console.log("Email Sent Successfully",emailResponse.response);


        }
  catch(error){
    console.log(error);
    return res.status(500).json({
      success:false,
      message:error.message,
    })
  }

  }

}

//for sending the mail
const sendPaymentSuccessEmail=async(req,res)=>{
  const {orderId,paymentId,amount}=req.body;
  const userId=req.user.id;

  if(!orderId || !paymentId || !amount || !userId){
    return res.status(400).json({
      success:false,
      message:"Please provide all the fields"
    })
  } //find student data with the userId

  try{
    const enrolledStudent=await User.findById(userId);
    await mailSender(
      enrolledStudent.email,
      `Payment Received`,
      paymentSuccessEmail(`${enrolledStudent.firstName}`,amount/100,orderId,paymentId)

    )
  }

  catch(error){
    console.log("error in sending mail",error);
    return res.status(500).json({
      success:false,
      message:"Could not send email"
    })
  }

}

 const getPurchaseHistory = async (req,res) => {
  try {
    const userId = req.user.id;
    const orders = await Order.find({user : userId}).populate('courses','courseName thumbnail').sort({createdAt : -1});

    return res.status(200).json({success : true,data : orders})
    
  } catch (error) {
    return res.status(500).json({success : false, response : 'Internal Server Error',message : error.message})
  }
 }




 export {capturePayment,verifySignature,enrollStudents,sendPaymentSuccessEmail,getPurchaseHistory};