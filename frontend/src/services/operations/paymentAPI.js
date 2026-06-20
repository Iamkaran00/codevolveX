import { toast } from "react-toastify";
import { paymentendpoints } from "../apis";
import { apiConnector } from "../apiconnector";
import rzplogo from '../../assets/Razorpay.logo.png' ;
import { setPaymentLoading } from "../../slices/course.slice";
import { resetCart } from "../../slices/cart.slice";

const {COURSE_PAYMENT_API,COURSE_VERIFY_API,SEND_PAYMENT_SUCCESS_EMAIL_API} = paymentendpoints;

// razorpay does not provide an npm package for their checkout or test modal 
// so we have to dynamically inject their script tags into html body..

function loadScript(src) {

    return new Promise(resolve => {
        const script = document.createElement('script') ;
        script.src = src;

        // if the script loads done then resolve the promise with true 
        script.onload = () => {
            resolve(true) ;
        }

        // if the user is offline or script fails , resolve with 'false
        script.onerror = () => {
            resolve(false);
        }
       document.body.appendChild(script) ;
    })
}



//payment thunks =====> 

export async function buyCourse(token , courses, userDetails, navigate,dispatch) {

    const toastId = toast.loading('wait for a moment....') ; 


    try {
        const res = await loadScript('https://checkout.razorpay.com/v1/checkout.js') ;
        if(!res) {
            toast.error('Razorpay SDK failed to load.Check Connection') ;
            return ;
        }

        const orderResponse = await apiConnector(
            'POST' , 
            COURSE_PAYMENT_API , 
            {courses}, null, 
            {Authorization : `Bearer ${token}`} 
        )
 
     if(!orderResponse.data.success) {
        throw new Error(orderResponse.data.message) ;
     }
   console.log('Printing orderresponse',orderResponse) ;
 const options = {

    key : import.meta.env.VITE_RAZORPAY_KEY,
    currency : orderResponse.data.data.currency,
    amount : `${orderResponse.data.data.amount}` ,
    order_id : orderResponse.data.data.id , 
    name: 'codevolveX' , 
    description : 'Thank you for purchasing the Course' , 
    // image : rzplogo,

   prefill : {
    name : `${userDetails.firstName}`,
    email : userDetails.email
   },
   
   handler : (response)=> {
    sendPaymentSuccessEmail(response,orderResponse.data.data.amount,token) ;
    // we cannot trust the frontend alone . we must send the payment details back to server to cryptographically verify the signature
  verifyPayment({...response,courses},token,navigate,dispatch)
}

 }
 const paymentObj = new window.Razorpay(options) ;
 paymentObj.open();
 paymentObj.on('payment.failed',(response)=> {
    toast.error('OOPs,payment failed') ;
    console.log('payment error', response.error) ;
 })

    } catch (error) {
        console.log('payment api error',error) ;
        toast.error('Could Not Make Payment') ;
    }
toast.dismiss(toastId);

}

async function sendPaymentSuccessEmail(response,amount,token) {
  try {
    //hitting your backend endpoints that triggers nodemailer 
    await apiConnector('POST',SEND_PAYMENT_SUCCESS_EMAIL_API,{
        orderId : response.razorpay_order_id,
        paymentId : response.razorpay_payment_id,
        amount,
    },null,{
         Authorization : `Bearer ${token}`
    })
  } catch (error) {
    console.log('Payment success email error...',error) ;
  }

}


async function verifyPayment(bodyData,token,navigate,dispatch) {
    const toastId = toast.loading('Verifying Payment...') ;
    dispatch(setPaymentLoading(true)) ;
    try {
        const response = await apiConnector('POST',COURSE_VERIFY_API,bodyData,null,{
            Authorization : `Bearer ${token}`,
        })
        if(!response.data.success) {
            throw new Error(response.data.message) ;
        }
        toast.success('Congrats 😄 Payment Successful');
        navigate('/dashboard/enrolled-courses') ; 
        dispatch(resetCart());
    } catch (error) {
     console.log('Payment verify error...',error) ;
     toast.error('Could not verify Payment');   
    }
    toast.dismiss(toastId);
    dispatch(setPaymentLoading(false));
}