import { createSlice } from "@reduxjs/toolkit";
import { setLoading } from "./auth.slice";

const initialState = {

 user : localStorage.getItem('user') ? JSON.parse(localStorage.getItem("user")) : null,

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
        }
    },
});
export const {setUser} = profileSlice.actions;
export default profileSlice.reducer;