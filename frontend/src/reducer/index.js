import { combineReducers } from "redux";
import authReducer from "../slices/auth.slice.js";
//creating rootReducers
import  profileReducer  from "../slices/profile.slice.js";
import cartReducer from "../slices/cart.slice.js";
const rootReducers = combineReducers(
    {
    auth : authReducer,
    profile : profileReducer,
    cart : cartReducer
    }
)
export default rootReducers; 