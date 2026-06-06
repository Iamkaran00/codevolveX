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
        <Route path = "update-password/:id" element = {<UpdatePassword/>} />
        <Route path = "*"  element = {<NotFound/>} />
      </Routes>
    </div>
  );
}
export default App;
