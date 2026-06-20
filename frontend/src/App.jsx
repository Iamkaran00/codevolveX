import React from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import { useSelector } from "react-redux"; // Added to read profile state roles

import { Home } from "./pages/Home";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import VerifyEmail from "./pages/VerifyEmail";
import NotFound from "./pages/NotFound";
import { ForgotPassword } from "./pages/ForgotPassword";
import UpdatePassword from "./pages/UpdatePassword";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Dashboard from "./pages/Dashboard";
import Settings from "./pages/Settings";

import { Navbar } from "./components/common/Navbar";
import PrivateRoute from "./components/core/auth/PrivateRoute";
import "./App.css";

import MyProfile from "./components/core/Dashboard/MyProfile";
import PurchaseHistory from "./components/core/Dashboard/PurchaseHistory";
import EnrolledCourse from "./components/core/Dashboard/EnrolledCourse";
import Cart from "./components/core/Dashboard/Cart";
import Catalogue from "./pages/Catalogue";

import MyCourses from "./components/core/Dashboard/InstructorCourses/MyCourses";
import AddCourse from "./components/core/Dashboard/AddCourse/AddCourse";
import EditCourse from "./components/core/Dashboard/EditCourse/index";
import { Footer } from "./components/common/Footer";
import CourseDetails from "./pages/CourseDetails";
import ViewCourse from "./pages/ViewCourse";


function App() {
  const { user } = useSelector((state) => state.profile);

  return (
    <div id="wrapper">
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="signup" element={<Signup />} />
        <Route path="login" element={<Login />} />
        <Route path="verify-email" element={<VerifyEmail />} />
        <Route path="forgot-password" element={<ForgotPassword />} />
        <Route path="update-password/:id" element={<UpdatePassword />} />
        <Route path="about-us" element={<About />} />
        <Route path="contact-us" element={<Contact />} />
        <Route
          path="dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        >
          <Route path="purchase-history" element={<PurchaseHistory />} />
          <Route path="enrolled-courses" element={<EnrolledCourse />} />
          <Route path="mycart" element={<Cart />} />
          <Route
            path="my-courses"
            element={
              user?.accountType === "Instructor" ? (
                <MyCourses />
              ) : (
                <Navigate to="dashboard/enrolled-courses" replace />
              )
            }
          />
          <Route
            path="add-course"
            element={
              user?.accountType === "Instructor" ? (
                <AddCourse />
              ) : (
                <Navigate to="dashboard/enrolled-courses" replace />
              )
            }
          />
          <Route
            path="edit-course/:courseId"
            element={
              user?.accountType === "Instructor" ? (
                <EditCourse />
              ) : (
                <Navigate to="dashboard/enrolled-courses" replace />
              )
            }
          />
        </Route>
        <Route
          path="my-profile"
          element={
            <PrivateRoute>
              <MyProfile />
            </PrivateRoute>
          }
        />
        <Route path="settings" element={<Settings />} />
         { 
          user?.accountType == 'Student' && (
         <>
            <Route path = 'catalogue' element = {<Catalogue/>} />
            <Route path = 'catalogue/:courseId' element = {<CourseDetails/>} />
            <Route path = 'dashboard/view-courses/:courseId' element = {<ViewCourse/>} />
         </>

         
          )
         }
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Footer/>
    </div>
  );
}

export default App;