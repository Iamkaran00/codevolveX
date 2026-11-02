import { combineReducers } from "redux";
import authReducer from "../slices/auth.slice.js";
 
import  profileReducer  from "../slices/profile.slice.js";
import cartReducer from "../slices/cart.slice.js";
import courseReducer from '../slices/course.slice.js'
import viewCourseReducer from '../slices/viewCourse.slice.js';
import uploadReducer from '../slices/upload.slice.js'
const rootReducers = combineReducers(
    {
    auth : authReducer,
    profile : profileReducer,
    cart : cartReducer ,
    course :  courseReducer,
    viewCourse : viewCourseReducer,
    uploads : uploadReducer
    }
)
export default rootReducers; 