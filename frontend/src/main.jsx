import { StrictMode } from 'react'
import { BrowserRouter } from 'react-router-dom'
import { createRoot } from 'react-dom/client'
import './index.css';
import { Provider } from 'react-redux';
import { Slide, ToastContainer } from 'react-toastify';
import { configureStore } from '@reduxjs/toolkit';
  import rootReducer from './reducer/index.js';
  import store from './utils/store.js';
import {GoogleOAuthProvider} from '@react-oauth/google' ; 
  import React from 'react';

import App from './App.jsx'
 
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store = {store}>
    <BrowserRouter>
    <GoogleOAuthProvider clientId = {import.meta.env.VITE_GOOGLE_CLIENT_ID}>
    <App />
     </GoogleOAuthProvider>
   <ToastContainer
  autoClose={2500}
  transition={Slide}
  hideProgressBar={true}
  position="top-center"
  theme="dark"
/>
    </BrowserRouter>
    </Provider>
  </StrictMode>,
)
 