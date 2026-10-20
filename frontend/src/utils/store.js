import { configureStore } from "@reduxjs/toolkit";
import rootReducers from "../reducer/index.js";

const store = configureStore({
    reducer : rootReducers
})

export default store ; 