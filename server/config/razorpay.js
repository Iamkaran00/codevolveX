import Razorpay from "razorpay";

const instance = new Razorpay(
    {
        key_id : `${process.env.RAZORPAY_KEY}`,
        key_secret : process.env.RAZORPAY_SECRET

    }
)
export default instance;