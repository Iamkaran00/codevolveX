import axios from "axios";
import { setToken } from "../slices/auth.slice"; 
import { setUser } from "../slices/profile.slice";
import {toast} from 'react-toastify'
import store from "../utils/store";
export const axiosInstance = axios.create({
  baseURL : "https://codevolvex.onrender.com/api/v1/",
  //  baseURL : 'https://localhost:5502/api/v1/'
});

// it handles token expire while the app is open 
axiosInstance.interceptors.response.use(
  res => res , 
  err => {
    if(err.response?.status === 401 && localStorage.getItem('token')) {
      store.dispatch(setToken(null)) ; 
      store.dispatch(setUser(null)) ; 
      localStorage.removeItem('token') ; 
      localStorage.removeItem('user') ; 
      toast.error('Session Expired. Please login again' ) ; 
    }
    return Promise.reject(err) ; 
  }
)

export const apiConnector = (method, url, bodyData, params, headers) => {
  return axiosInstance({
    method: `${method}`,
    url: `${url}`,
    data: bodyData ? bodyData : null,
    headers: headers ? headers : null,
    params: params ? params : null,
  });
};

