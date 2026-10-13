import { StrictMode } from 'react'
import { BrowserRouter } from 'react-router-dom'
import { createRoot } from 'react-dom/client'
import './index.css';
import { Provider } from 'react-redux';
import { Slide, ToastContainer } from 'react-toastify';
import { configureStore } from '@reduxjs/toolkit';
  import rootReducer from './reducer/index.js';
import {GoogleOAuthProvider} from '@react-oauth/google' ; 
  import React from 'react';
 const store = configureStore({
     reducer : rootReducer,
 });
import App from './App.jsx'
 
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store = {store}>
    <BrowserRouter>
    <GoogleOAuthProvider clientId = {import.meta.env.VITE_GOOGLE_CLIENT_ID}>
    <App />
     </GoogleOAuthProvider>
    <ToastContainer autoClose = {1000} transition={Slide} hideProgressBar = {true} position='top-center'/>
    </BrowserRouter>
    </Provider>
  </StrictMode>,
)
 