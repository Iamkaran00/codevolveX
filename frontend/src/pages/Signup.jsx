import React from "react";
import { Template } from "../components/core/auth/Template";
import signupImg from "../assets/login.png";

function Signup() {
  return (
    <Template
      title={
        <>
          Join the millions learning to code with{" "}
          <span className="whitespace-nowrap">
            codevolve<span className="text-[#ffb454]">X</span>
          </span>{" "}
          for free<span className="text-[#ffb454]">.</span>
        </>
      }
      description1="Build skills for today, tomorrow, and beyond."
      description2="Education to future-proof your career."
      image={signupImg}
      formType="signup"
    />
  );
}

export default Signup;