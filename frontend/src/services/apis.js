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
    UPDATE_PROFILE_DETAILS : BASE_URL + 'profile/updateProfile',
    DELETE_PROFILE : BASE_URL  + 'profile/deleteProfile',


  }
  
export const course_endpoints = {
  // Course
  CREATE_COURSE_API: BASE_URL + "course/createCourse",
  EDIT_COURSE_API: BASE_URL + "course/editCourse",
  DELETE_COURSE_API: BASE_URL + "course/deleteCourse",

  // Section
  CREATE_SECTION_API: BASE_URL + "course/addSection",
  UPDATE_SECTION_API: BASE_URL + "course/updateSection",
  DELETE_SECTION_API: BASE_URL + "course/deleteSection",

  // Sub Section
  CREATE_SUBSECTION_API: BASE_URL + "course/addSubSection",
  UPDATE_SUBSECTION_API: BASE_URL + "course/updateSubSection",
  DELETE_SUBSECTION_API: BASE_URL + "course/deleteSubSection",

  // Course Details
  GET_ALL_COURSE_API: BASE_URL + "course/getAllCourses",
  COURSE_DETAILS_API: BASE_URL + "course/getCourseDetails",
  GET_FULL_COURSE_DETAILS_AUTHENTICATED:
    BASE_URL + "course/getFullCourseDetails",
  GET_ALL_INSTRUCTOR_COURSES_API:
    BASE_URL + "course/getInstructorCourses",

  // Category
  CREATE_CATEGORY_API: BASE_URL + "course/createCategory",
  COURSE_CATEGORIES_API: BASE_URL + "course/showAllCategories",
  GET_CATEGORY_PAGE_DETAILS_API:
    BASE_URL + "course/getCategoryPageDetails",

  // Ratings & Reviews
  CREATE_RATING_API: BASE_URL + "course/createRating",
  GET_AVERAGE_RATING_API: BASE_URL + "course/getAverageRating",
  GET_REVIEWS_API: BASE_URL + "course/getReviews",
  GET_REVIEWS_FOR_COURSE_API:
    BASE_URL + "course/getReviewForCourse",
    LECTURE_COMPLETION_API : BASE_URL + 'course/updatecourseprogress',
};

//payment endpoints ->
export const paymentendpoints = {

  COURSE_PAYMENT_API : BASE_URL + 'payment/capturePayment',
  COURSE_VERIFY_API : BASE_URL + 'payment/verifySignature', 
  SEND_PAYMENT_SUCCESS_EMAIL_API : BASE_URL + 'payment/sendPaymentSuccessEmail'

}