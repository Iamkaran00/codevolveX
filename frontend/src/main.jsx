import { StrictMode } from 'react'
import { BrowserRouter } from 'react-router-dom'
import { createRoot } from 'react-dom/client'
import './index.css';
import { Provider } from 'react-redux';
import { Slide, ToastContainer } from 'react-toastify';
import { configureStore } from '@reduxjs/toolkit';
  import rootReducer from './reducer/index.js';
  import React from 'react';
 const store = configureStore({
     reducer : rootReducer,
 });
import App from './App.jsx'
 
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store = {store}>
    <BrowserRouter>
    <App />
    <ToastContainer autoClose = {1000} transition={Slide} hideProgressBar = {true}/>
    </BrowserRouter>
    </Provider>
  </StrictMode>,
)
 