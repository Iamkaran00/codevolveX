import { createSlice } from "@reduxjs/toolkit";
import { getStoredAuth } from "../utils/tokenUtils";

const initialState = {
 loading : false,
 user : getStoredAuth().user , 
enrolledCourses : [], 
}
const profileSlice = createSlice({
    name : "profile",
    initialState : initialState,
    reducers : {
        setUser(state,value){
            state.user = value.payload;
        },
        setLoading(state,value){
            state.loading = value.payload;
        } , 
        setEnrolledCourses(state,action) {
            state.enrolledCourses = action.payload ;
        },
    },
});
export const {setUser,setLoading, setEnrolledCourses} = profileSlice.actions;
export default profileSlice.reducer;