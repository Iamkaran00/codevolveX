import { Queue } from "bullmq";
import bullConnection from "../config/bullmqRedis.js";
 
// lower number = high priority 

export const PRIORITY = {
    OTP : 1 , 
    RESET : 1 , 
    RECEIPT : 5 , 
    NOTICE : 5 ,
}

// otp expires fast , so retry quickly and give up sooner than other emails

export const OTP_OPTIONS = {
    priority : PRIORITY.OTP , 
    attempts : 3 , 
    backoff : {type : 'exponential' , delay : 1000} , 
};


export const emailQueue = new Queue('email' , {
    connection :bullConnection , 
    defaultJobOptions : {
        attempts : 5 , 
        backoff : {type : 'exponential' , delay : 2000} , // 2s , 4s , 8s
        removeOnComplete: {age : 3600 , count : 1000}, //keep redis small 
        removeOnFail : {age : 7*24*3600 , count : 5000}

    }
})

export async function  queueEmail(type , data , opts = {}) {
    try{
        await emailQueue.add(type , data , opts) ;

    }catch(err) {
console.error(data.to , data.subject , data.html) ; 
    }
}