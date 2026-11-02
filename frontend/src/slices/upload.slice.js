import { createSlice } from "@reduxjs/toolkit";

const uploadSlice = createSlice({
    name : 'uploads' , 
    initialState : {} , 
    reducers : {
        setUpload :(s , {payload : {id , ...rest}}) => {s[id] = {...s[id],...rest};}
,
removeUpload : (s , {payload}) => {delete s[payload] ; } ,
    },
}) ; 


export const {setUpload , removeUpload} = uploadSlice.actions ; 
export default uploadSlice.reducer ; 