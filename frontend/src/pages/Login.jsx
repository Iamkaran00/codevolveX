import React from "react";
import { Template } from "../components/core/auth/Template";
import img from "../assets/girl1.jpg";

function Login() {
  return (
    <Template
      title="Join the millions learning to code with codevolveX for free.."
      description1="Build skills for today, tomorrow, and beyond"
      description2="Education to future-proof your career"
      image={img}
      formType="login"
    />
  );
}
export default Login;
