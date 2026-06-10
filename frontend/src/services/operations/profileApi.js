import { toast } from "react-toastify";
import { setUser, setLoading ,setEnrolledCourses} from "../../slices/profile.slice";
import { apiConnector } from "../apiconnector";
import { endpoints } from "../apis";
const {
  UPDATE_PROFILE_PICTURE,
  GET_ENROLLED_COURSES,
  INSTRUCTOR_DASHBOARD,
  GET_USER_DETAILS,
  UPDATE_PROFILE_DETAILS,
  DELETE_PROFILE
} = endpoints;
  
export function updateDisplayPicture(token, formData) {
  return async (dispatch) => {
    const toastId = toast.loading("Uploading image...");
    try {
      const response = await apiConnector("PUT", UPDATE_PROFILE_PICTURE, formData,null, {
        Authorization: `Bearer ${token}`,
      });

      if (response.data.success === false) throw new Error(response.data.message);
      toast.success("Profile Photo updated!!");
      const updatedUser = response.data.data;
      dispatch(setUser(updatedUser));
      localStorage.setItem("user", JSON.stringify(updatedUser));
    } catch (error) {
      console.log("failed to update profile image", error);
      toast.error("Failed To Update Image");
       console.log("status →", error.response?.status);
      console.log("error data →", error.response?.data);
    }
    toast.dismiss(toastId);
  };
}

export function updateProfile(token, formData) {

  return async (dispatch) => {
    const toastId = toast.loading("Updating Profile...");
    dispatch(setLoading(true));
    try {
      
      const response = await apiConnector("PUT", UPDATE_PROFILE_DETAILS, formData,null, {
        Authorization: `Bearer ${token}`,
      });
 
      if (!response.data.success) throw new Error(response.data.message);

      toast.success("Profile Updated Successfully");

      const localUser = JSON.parse(localStorage.getItem("user"));
      localUser.additionalDetails = response.data.profileDetails;
      dispatch(setUser(localUser));
      localStorage.setItem("user", JSON.stringify(localUser));
    } catch (error) {
      console.log("failed to update details", error);
      toast.error(error.message || "failed to update profile details");
        console.log("status →", error.response?.status);
      console.log("error data →", error.response?.data);
    }
    dispatch(setLoading(false));
    toast.dismiss(toastId);
  };
} 

export function deleteProfile (token,navigate) { 
  console.log(DELETE_PROFILE);
  return async (dispatch) =>{
    const toastId = toast.loading('Deleting Profile...') ;
    dispatch(setLoading(true));
    try {
       const response = await apiConnector('DELETE' , DELETE_PROFILE,null ,null, {
        Authorization : `Bearer ${token}` 
       } );

       if(!response.data.success) throw new Error(response.data.message) ;
       localStorage.removeItem("token");
      dispatch(setUser(null));
      localStorage.removeItem("user");
    navigate('/');
    } catch (error) {
      console.log('Failed To Delete User' , error) ;

      toast.error(error.message ||  'An Error Occured');
    }
  dispatch(setLoading(false)) ;
  toast.dismiss(toastId);
  }
} 
export function getEnrolledCourse (token) {
  return async dispatch => {
    try {
   console.log(GET_ENROLLED_COURSES)
      const response = await apiConnector('GET' , GET_ENROLLED_COURSES , null , null , {
        Authorization : `Bearer ${token}`
      });

      if(!response.data.success) throw new Error(response.data.message) ;
     dispatch(setEnrolledCourses(response.data.data));
      
    } catch (error) {
      console.log(error) ; 
      toast.error('Could not fetch enrolled courses');
      console.log(error.response.status) ;
      console.log(error.response.message);
    }
    dispatch(setLoading(false)) ;
  }

}