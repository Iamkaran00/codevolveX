import { combineReducers } from "redux";
import authReducer from "../slices/auth.slice.js";
 
import  profileReducer  from "../slices/profile.slice.js";
import cartReducer from "../slices/cart.slice.js";
import courseReducer from '../slices/course.slice.js'
const rootReducers = combineReducers(
    {
    auth : authReducer,
    profile : profileReducer,
    cart : cartReducer ,
   course :  courseReducer,
    }
)
export default rootReducers; 