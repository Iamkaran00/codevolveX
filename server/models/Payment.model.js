import mongoose, { Schema } from "mongoose";
const orderSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  courses: [
    {
      type: Schema.Types.ObjectId,
      ref: "Course",
    },
  ],
  amount : {
    type : Number,
    required : true,
  },
  razorpay_order_id : {
    type : String,
    required : true,
  },
  razorpay_payment_id : {
    type:String,
    required : true,
  },
  status : {
    type : String,
    enum : ['Success','failed'],
    default : 'Success'
  }
},{timestamps : true});

export const Order = mongoose.model('Order' , orderSchema);
 