const BASE_URL = import.meta.env.VITE_BASE_URL;
export const categories = {
    CATEGORIES_API : BASE_URL + "course/showAllCategories",
   
}
export const endpoints = {
    // auth api
    SENDOTP_API: BASE_URL + "auth/sendotp",
    SIGNUP_API: BASE_URL + "auth/signup",
    LOGIN_API: BASE_URL + "auth/login",
    RESETPASSTOKEN_API: BASE_URL + "auth/reset-password-token",
    RESETPASSWORD_API: BASE_URL + "auth/reset-password",
    //contact us api
    CONTACTUS_API : BASE_URL + "contact/contact-us", 
    //profile api 
    UPDATE_PROFILE_PICTURE  : BASE_URL + 'profile/updateDisplayPicture' , 
    GET_ENROLLED_COURSES : BASE_URL + 'profile/getEnrolledCourses',
    INSTRUCTOR_DASHBOARD : BASE_URL + 'profile/instructorDashboard',
    GET_USER_DETAILS : BASE_URL + 'profile/getUserDetails' , 
    UPDATE_PROFILE_DETAILS : BASE_URL + 'profile/updateProfile'


  }