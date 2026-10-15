import { createSlice } from "@reduxjs/toolkit";
import { getStoredAuth } from "../utils/tokenUtils";

const initialState = {

token : getStoredAuth().token  ,
signupData : null , 
loading : false, 

}
const authSlice = createSlice({

    name : "auth",
    initialState : initialState,
    reducers : {
        setSignupData(state,value){
            state.signupData = value.payload
        },
        setToken(state,value){
            state.token = value.payload;
        },
        setLoading(state,value){
            state.loading = value.payload
        }
    },
});
export const {setToken,setLoading,setSignupData} = authSlice.actions;
export default authSlice.reducer;