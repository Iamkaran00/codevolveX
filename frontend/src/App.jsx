import React from "react";
import { Route, Routes } from "react-router-dom";
import { Home } from "./pages/Home";
import "./App.css";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import { Navbar } from "./components/common/Navbar";
import VerifyEmail from "./pages/VerifyEmail";
import NotFound from "./pages/NotFound";
import { ForgotPassword } from "./pages/ForgotPassword";
import UpdatePassword from "./pages/UpdatePassword";
import About from "./pages/About";
import Contact from "./pages/Contact";
import MyProfile from "./components/core/Dashboard/MyProfile";
import Dashboard from "./pages/Dashboard";
import Settings from "./pages/Settings";
import PrivateRoute from "./components/core/auth/PrivateRoute";
import PurchaseHistory from "./components/core/Dashboard/PurchaseHistory";
import EnrolledCourse from "./components/core/Dashboard/EnrolledCourse";
import Cart from "./components/core/Dashboard/Cart";
function App() {
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
      <Route path = "purchase-history" element = {<PurchaseHistory />} />
      <Route path = 'enrolled-courses' element = {<EnrolledCourse />} />
      <Route path = 'mycart' element = {<Cart/>} />
        </Route>
        <Route
          path="my-profile"
          element={
            <PrivateRoute>
              <MyProfile />
            </PrivateRoute>
          }
        />
        <Route path = 'settings' element = {<Settings/>} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}
export default App;
