import { createSlice } from "@reduxjs/toolkit";

const initialState = {

token : localStorage.getItem("token")?localStorage.getItem("token"):null,

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