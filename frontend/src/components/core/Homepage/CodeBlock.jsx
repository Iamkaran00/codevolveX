import React from "react";
import { TypeAnimation } from "react-type-animation";
import { CTAbutton } from "./button";
import "./CodeBlock.css";
export const CodeBlock = ({ heading, subheading, codeanimation ,linkto ,flag}) => {
  return (
    <div className= {flag?"codeblock1":"codeblock"}>
        <div className = "sec2block1"><p id="text1">{heading}</p>
        <p id = "text2">{subheading}</p> 
       <div className="butcodeblock">
  <CTAbutton active = {true} linkto={linkto}  >{flag?'Continue Lessons' : 'Learn More'}</CTAbutton>
  <CTAbutton active = {false} linkto= {linkto} >Learn More</CTAbutton>
  </div>
       </div>
       <div className="animatedblock">
       <TypeAnimation
        sequence={[codeanimation, 2000, ""]}
        omitDeletionAnimation={true}
        speed={150}
        repeat={Infinity}
        cursor={true}
        style={ flag?{ whiteSpace: "pre-line",
          display: "block",
          color : "rgba(150, 110, 174, 0.9)",
          fontSize : "1.2rem"}:{
            whiteSpace: "pre-line",
            display: "block",
            color : "#FFD700",
            fontSize : "1.2rem"
          }} />
       </div>
    </div>
  );
};
