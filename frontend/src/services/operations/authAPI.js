import { toast } from "react-toastify";
import { setLoading, setToken } from "../../slices/auth.slice";
import {setUser} from "../../slices/profile.slice";
import { apiConnector } from "../apiconnector";
import { endpoints } from "../apis";
import VerifyEmail from "../../pages/VerifyEmail";
const {
  SENDOTP_API,
  SIGNUP_API,
  LOGIN_API,
  RESETPASSTOKEN_API,
  RESETPASSWORD_API,
} = endpoints;
export function sendOtp(email, navigate) {
  return async (dispatch) => {
    dispatch(setLoading(true));
    try {
      const response = await apiConnector("POST", SENDOTP_API, {
        email,
        checkUserPresent: true,
      });
      
      if (!response.data.success) {
        console.log("hey there",response.data.message)
        throw new Error(response.data.message);
      }
      toast.success("OTP sent successfully");
      navigate("/verify-email");
    } catch (error) {
    
      console.log("Send otp api error >", error);
      
    }
    dispatch(setLoading(false));
   
  };
}

export function signup(
  firstName,
  lastName,
  email,
  password,
  confirmPassword,
  accountType,
  otp,
  navigate
) {
  return async (dispatch) => {
    const toastid = toast.loading("Loading...");
    dispatch(setLoading(true));
    try {
      const response = await apiConnector("POST", SIGNUP_API, {
        accountType,
        firstName,
        lastName,
        email,
        password,
        confirmPassword,
        otp,
      });
      if (!response.data.success) {
        throw new Error(response.data.message);
      }
      toast.success("Signup Succeed");
      navigate('/login');
    } catch (error) {
      console.log("Singup api error", error);
      toast.error("Signup failed");
      navigate("/signup");
    }
    dispatch(setLoading(false));
    toast.dismiss(toastid);
  };
}

export function login(email, password, navigate) {
  return async (dispatch) => {
    const toastId = toast.loading("Loading...");
    dispatch(setLoading(true));
    try {
      const response = await apiConnector("POST", LOGIN_API, {
        email,
        password,
      });

      if (!response.data.success) {
        throw new Error(response.data.message);
      }
      toast.success("Login Successful");
      dispatch(setToken(response.data.token));
      const userImage = response.data?.user?.image
       ? response.data.user.image
       : `https://api.dicebear.com/5.x/initials/svg?seed=${response.data.user.firstName} ${response.data.user.lastName}`;
      dispatch(setUser({ ...response.data.user, image: userImage }));
      localStorage.setItem("token", JSON.stringify(response.data.token));
      localStorage.setItem("user", JSON.stringify(response.data.user));
      navigate("/");
    } catch (error) {
      console.log("LOGIN API ERROR............", error);
      toast.error("Login Failed");
    }
    dispatch(setLoading(false));
    toast.dismiss(toastId);
  };
}
export function logout(navigate) {
  return (dispatch) => {
    dispatch(setToken(null));
    dispatch(setUser(null));
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    toast.success("User Logged Out");
    navigate("/");
  };
}
export function getPasswordResetToken(email, setEmailSent) {
  return async (dispatch) => {
    dispatch(setLoading(true));
    try {
      const response = await apiConnector("POST", RESETPASSTOKEN_API, { email });
      if (!response.data.success) {
        throw new Error(response.data.message);
      }
      toast.success("Reset Email Sent");
      setEmailSent(true);
    } catch (error) {
      console.log("Reset Password Token Error",error);
      toast.error("failed to sent email");
    }
  finally { dispatch(setLoading(false));}
  
  };
}

export function resetPassword(password,confirmPassword, token , navigate) {

  return async(dispatch) => {
    dispatch(setLoading(true)) ; 

    try {
      const response = await apiConnector("POST", RESETPASSWORD_API, {
        password, confirmPassword, token,
      })
      if(!response.data.success) {
        throw new Error(response.data.message);
      }

      toast.success("password has been reset successfully") ; 
      navigate("/login");
    } catch (error) {
      console.log("RESET PASSWORD ERROR" , error);
      toast.error(error.response?.data.message || "Unable to reset password");

    } finally {
      dispatch(setLoading(false));
    }



  }

}