import { apiConnector } from "../apiconnector";
import { course_endpoints } from "../apis";
import {toast} from 'react-toastify'

const {
  CREATE_COURSE_API,
  EDIT_COURSE_API,
  DELETE_COURSE_API,
  CREATE_SECTION_API,
  UPDATE_SECTION_API,
  DELETE_SECTION_API,
  CREATE_SUBSECTION_API,
  UPDATE_SUBSECTION_API,
  DELETE_SUBSECTION_API,
  GET_ALL_COURSE_API,
  COURSE_DETAILS_API,
  GET_FULL_COURSE_DETAILS_AUTHENTICATED,
  GET_ALL_INSTRUCTOR_COURSES_API,
  CREATE_CATEGORY_API,
  COURSE_CATEGORIES_API,
  GET_CATEGORY_PAGE_DETAILS_API,
  CREATE_RATING_API,
  GET_AVERAGE_RATING_API,
  GET_REVIEWS_API,
  GET_REVIEWS_FOR_COURSE_API,
  LECTURE_COMPLETION_API,
} = course_endpoints;
 
export const addCourseDetails = async (data, token) => {
  let result = null;
  const toastId = toast.loading("Creating course...");
  console.log(CREATE_COURSE_API);
  try {
    const response = await apiConnector("POST", CREATE_COURSE_API, data, null
     ,{
      Authorization: `Bearer ${token}`,
  }
    );
    if (!response?.data?.success) {
      throw new Error("Could not add course details");
    }
    toast.success("Course created successfully");
    console.log(response)
    result = response?.data?.data;
    console.log(result);
  } catch (error) {
    console.log("CREATE_COURSE_API ERROR", error);
    console.log(error.response) ;
    console.log(error.response.status)
    toast.error(error.message);
  }
  toast.dismiss(toastId);
  return result;
};

export const editCourseDetails = async (data, token) => {
  
  let result = null;
  const toastId = toast.loading("Saving changes...");
  try {
    const response = await apiConnector("POST", EDIT_COURSE_API,data, null ,{
      Authorization: `Bearer ${token}`,
    });
    console.log("EDIT_COURSE_API RESPONSE", response);
    if (!response?.data?.success) {
      throw new Error("Could not update course details");
    }
    toast.success("Course updated successfully");
    result = response?.data?.data;
  } catch (error) {
    console.log("EDIT_COURSE_API ERROR", error.response);
    toast.error(error.message);
  }
  toast.dismiss(toastId);
  return result;
};

export const deleteCourse = async (data, token) => {
 
  const toastId = toast.loading("Deleting course...");
  try {
    const response = await apiConnector("DELETE", DELETE_COURSE_API, data, {
      Authorization: `Bearer ${token}`,
    });
    console.log("DELETE_COURSE_API RESPONSE", response);
    if (!response?.data?.success) {
      throw new Error("Could not delete course");
    }
    toast.success('Course Deleted');
    
  } catch (error) {
    console.log("DELETE_COURSE_API ERROR", error);
    console.log(error.response);
    toast.error(error.message);
    
  }
  toast.dismiss(toastId);
};

export const getAllCourses = async () => {
  const toastId = toast.loading("Loading...");
  let result = [];
  try {
    const response = await apiConnector("GET", GET_ALL_COURSE_API);
    console.log("GET_ALL_COURSE_API RESPONSE", response);
    if (!response?.data?.success) {
      throw new Error("Could not fetch courses");
    }
    result = response?.data?.data;
  } catch (error) {
    console.log("GET_ALL_COURSE_API ERROR", error);
    console.log(error.response);
    toast.error(error.message);
  }
  toast.dismiss(toastId);
  return result;
};

export const fetchCourseDetails = async (courseId) => {
  const toastId = toast.loading("Loading...");
  let result = null;
  try {
    const response = await apiConnector("GET", COURSE_DETAILS_API,null,{
      courseId,
    });
    console.log("COURSE_DETAILS_API RESPONSE", response);
    if (!response?.data?.success) {
      throw new Error(response?.data?.message);
    }
    result = response.data;
  } catch (error) {
    console.log("COURSE_DETAILS_API ERROR", error);
    result = error?.response?.data;
    console.log(error.response);
  }
  toast.dismiss(toastId);
  return result;
};

export const getFullDetailsOfCourse = async (courseId, token) => {
  const toastId = toast.loading("Loading...");
  console.log(GET_FULL_COURSE_DETAILS_AUTHENTICATED);
  let result = null;
  try {
    const response = await apiConnector(
      "POST",
      GET_FULL_COURSE_DETAILS_AUTHENTICATED,
      { courseId },
      null,
      { Authorization: `Bearer ${token}` }
    );
    console.log("GET_FULL_COURSE_DETAILS_AUTHENTICATED RESPONSE", response);
    if (!response?.data?.success) {
      throw new Error(response?.data?.message);
    }
    result = response?.data?.data;
    console.log(result);
  } catch (error) {
    console.log("GET_FULL_COURSE_DETAILS_AUTHENTICATED ERROR", error);
    result = error?.response?.data;
    console.log(error.response);
  }
  toast.dismiss(toastId);
  return result;
};

export const fetchInstructorCourses = async (token) => {
 
  let result = [];
  const toastId = toast.loading("Loading courses...");
  try {
    const response = await apiConnector(
      "GET",
      GET_ALL_INSTRUCTOR_COURSES_API,null,
      null,
      { Authorization: `Bearer ${token}` }
    );
    if (!response?.data?.success) {
      throw new Error("Could not fetch instructor courses");
    }
    result = response?.data?.data;
  } catch (error) {
    console.log(error.response);
    console.log("GET_ALL_INSTRUCTOR_COURSES_API ERROR", error);
    toast.error(error.message);
  }
  toast.dismiss(toastId);
  return result;
};
export const createSection = async (data, token) => {
  console.log(data,token,'here in create seciont');
  let result = null;
  const toastId = toast.loading("Adding section...");
  try {
    const response = await apiConnector("POST", CREATE_SECTION_API, data, null, {
      Authorization: `Bearer ${token}`,
    });
    console.log("CREATE_SECTION_API RESPONSE", response);
    if (!response?.data?.success) {
      throw new Error("Could not create section");
    }
    toast.success("Section created");
    result = response?.data?.data;
  } catch (error) {
    console.log("CREATE_SECTION_API ERROR", error.message);
    console.log(error.response);
    toast.error(error.message);
  }
  toast.dismiss(toastId);
  return result;
};

export const updateSection = async (data, token) => {
  let result = null;
  const toastId = toast.loading("Updating section...");
  try {
    const response = await apiConnector("POST", UPDATE_SECTION_API, data, null,{
      Authorization: `Bearer ${token}`,
    });
    console.log("UPDATE_SECTION_API RESPONSE", response);
    if (!response?.data?.success) {
      throw new Error("Could not update section");
    }
    toast.success("Section updated");
    result = response?.data?.data;
  } catch (error) {
    console.log("UPDATE_SECTION_API ERROR", error);
    toast.error(error.message);
  }
  toast.dismiss(toastId);
  return result;
};

export const deleteSection = async (data, token) => {
  let result = null;
  const toastId = toast.loading("Deleting section...");
  try {
    const response = await apiConnector("POST", DELETE_SECTION_API, data,null, {
      Authorization: `Bearer ${token}`,
    });
    console.log("DELETE_SECTION_API RESPONSE", response);
    if (!response?.data?.success) {
      throw new Error("Could not delete section");
    }
    toast.success("Section deleted");
    result = response?.data?.data;
  } catch (error) {
    console.log("DELETE_SECTION_API ERROR", error);
    toast.error(error.message);
  }
  toast.dismiss(toastId);
  return result;
};
 

export const createSubSection = async (data, token) => {
  let result = null;
  const toastId = toast.loading("Uploading lecture...");
  try {
    const response = await apiConnector("POST", CREATE_SUBSECTION_API, data,null, {
      
      Authorization: `Bearer ${token}`,
    });
    console.log("CREATE_SUBSECTION_API RESPONSE", response);
    if (!response?.data?.success) {
      throw new Error("Could not add lecture");
    }
    toast.success("Lecture added");
    result = response?.data?.updatedSection;
  } catch (error) {
    console.log("CREATE_SUBSECTION_API ERROR", error);
    toast.error(error.message);
  }
  toast.dismiss(toastId);
  return result;
};

export const updateSubSection = async (data, token) => {
  let result = null;
  const toastId = toast.loading("Updating lecture...");
  try {
    const response = await apiConnector("POST", UPDATE_SUBSECTION_API, data,null, {
      Authorization: `Bearer ${token}`,
    });
    console.log("UPDATE_SUBSECTION_API RESPONSE", response);
    if (!response?.data?.success) {
      throw new Error("Could not update lecture");
    }
    toast.success("Lecture updated");
    result = response?.data?.data;
  } catch (error) {
    console.log("UPDATE_SUBSECTION_API ERROR", error);
    toast.error(error.message);
  }
  toast.dismiss(toastId);
  return result;
};

export const deleteSubSection = async (data, token) => {
  let result = null;
  const toastId = toast.loading("Deleting lecture...");
  try {
    const response = await apiConnector("POST", DELETE_SUBSECTION_API, data,null, {
      Authorization: `Bearer ${token}`,
    });
    console.log("DELETE_SUBSECTION_API RESPONSE", response);
    if (!response?.data?.success) {
      throw new Error("Could not delete lecture");
    }
    toast.success("Lecture deleted");
    result = response?.data?.data;
  } catch (error) {
    console.log("DELETE_SUBSECTION_API ERROR", error);
    toast.error(error.message);
  }
  toast.dismiss(toastId);
  return result;
};

export const fetchCourseCategories = async () => {
  let result = [];
  try {
    const response = await apiConnector("GET", COURSE_CATEGORIES_API);
    if (!response?.data?.success) {
      throw new Error("Could not fetch categories");
    }
     
result = response.data.allCategory;
  } catch (error) {
    console.log("COURSE_CATEGORIES_API ERROR", error);
    toast.error(error.message);
    console.log(error.response);
  }
  return result;
};

export const createCategory = async (data, token) => {
  let result = null;
  const toastId = toast.loading("Creating category...");
  try {
    const response = await apiConnector("POST", CREATE_CATEGORY_API, data,null, {
      Authorization: `Bearer ${token}`,
    });
    console.log("CREATE_CATEGORY_API RESPONSE", response);
    if (!response?.data?.success) {
      throw new Error("Could not create category");
    }
    toast.success("Category created");
    result = response?.data?.data;
  } catch (error) {
    console.log("CREATE_CATEGORY_API ERROR", error);
    toast.error(error.message);
  }
  toast.dismiss(toastId);
  return result;
};

export const getCategoryPageDetails = async (data) => {
  let result = null;
  const toastId = toast.loading("Loading...");
  try {
    const response = await apiConnector(
      "POST",
      GET_CATEGORY_PAGE_DETAILS_API,
      data
    );
    console.log("GET_CATEGORY_PAGE_DETAILS_API RESPONSE", response);
    if (!response?.data?.success) {
      throw new Error("Could not fetch category details");
    }
    result = response?.data?.data;
  } catch (error) {
    console.log("GET_CATEGORY_PAGE_DETAILS_API ERROR", error);
    toast.error(error.message);
  }
  toast.dismiss(toastId);
  return result;
};
 

export const createRating = async (data, token) => {
  const toastId = toast.loading("Submitting review...");
  let success = false;
  try {
    const response = await apiConnector("POST", CREATE_RATING_API, data,null, {
      Authorization: `Bearer ${token}`,
    });
    console.log("CREATE_RATING_API RESPONSE", response);
    if (!response?.data?.success) {
      throw new Error("Could not submit rating");
    }
    toast.success("Review submitted");
    success = true;
  } catch (error) {
    console.log("CREATE_RATING_API ERROR", error);
    toast.error(error.message);
  }
  toast.dismiss(toastId);
  return success;
};

export const getAverageRating = async (courseId) => {
  let result = 0;
  try {
    const response = await apiConnector("GET", GET_AVERAGE_RATING_API, null,{
      courseId,
    });
    console.log("GET_AVERAGE_RATING_API RESPONSE", response);
    if (!response?.data?.success) {
      throw new Error("Could not fetch average rating");
    }
    result = response?.data?.averageRatings;
  } catch (error) {
    console.log("GET_AVERAGE_RATING_API ERROR", error);
  }
  return result;
};

export const getAllReviews = async () => {
  let result = [];
  try {
    const response = await apiConnector("GET", GET_REVIEWS_API);
    console.log("GET_REVIEWS_API RESPONSE", response);
    if (!response?.data?.success) {
      throw new Error("Could not fetch reviews");
    }
    result = response?.data?.data;
  } catch (error) {
    console.log("GET_REVIEWS_API ERROR", error);
    toast.error(error.message);
  }
  return result;
};

export const getReviewsForCourse = async (courseid) => {
  let result = [];
  try {
    const response = await apiConnector("GET", GET_REVIEWS_FOR_COURSE_API, {
      courseid,
    });
    console.log("GET_REVIEWS_FOR_COURSE_API RESPONSE", response);
    if (!response?.data?.success) {
      throw new Error("Could not fetch course reviews");
    }
    result = response?.data?.data;
  } catch (error) {
    console.log("GET_REVIEWS_FOR_COURSE_API ERROR", error);
    toast.error(error.message);
  }
  return result;
};
 
export const markLectureAsComplete = async (data, token) => {
  let result = null;
  const toastId = toast.loading("Updating progress...");
  try {
    const response = await apiConnector(
      "POST",
      LECTURE_COMPLETION_API,
      data, null,
      { Authorization: `Bearer ${token}` }
    );
    console.log("LECTURE_COMPLETION_API RESPONSE", response);
    if (!response?.data?.message) {
      throw new Error(response?.data?.error);
    }
    toast.success(response.data.completed ? "Lecture completed" : "Marked as incomplete");
    result = response.data.completed;
  } catch (error) {
    console.log("LECTURE_COMPLETION_API ERROR", error);
    toast.error(error.message);
    result = null;
  }
  toast.dismiss(toastId);
  return result;
};