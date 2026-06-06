import React from "react";
import { Template } from "../components/core/auth/Template";
import signupImg from "../assets/girl2.jpg";
import { Coloring } from "../components/core/Homepage/Coloring";

function Signup() {
  return (
    <Template
      title={
        <>
          Join the millions learning to code with <br className="hidden lg:block"/>
          <Coloring>CodevolveX</Coloring> for free
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