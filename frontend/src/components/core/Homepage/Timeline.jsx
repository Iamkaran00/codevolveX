import personality from "../../../assets/personality.png";
import logo1 from "../../../assets/logo1.svg";
import logo2 from "../../../assets/logo2.svg";
import logo3 from "../../../assets/logo3.svg";
import logo4 from "../../../assets/logo4.svg";
import React from "react";
import "./timeline.css";
export const Timeline = () => {
  const timeline = [
    {
      logo: logo1,
      title: "Leadership",
      subheading: "fully commited to the success company",
    },
    {
      logo: logo2,
      title: "Responsibility",
      subheading: "Student will always be our priority",
    },
    {
      logo: logo3,
      title: "Flexibility",
      subheading: "The ability to switch is an important skill",
    },
    {
      logo: logo4,
      title: "Solving Problems",
      subheading: "Code your way to a solution",
    },
  ];
  return (
    <div id="timelinediv">
      {
        <div className="logosinfo">
          {timeline.map((Element, index) => (
            <div id="logocontainer" key={index}>
              <img src={Element.logo} alt="" height="40px" width={"40px"} />
              <div id="info">
                <p id="title">{Element.title}</p>
                <p id="subheading">{Element.subheading}</p>
              </div>
            </div>
          ))}
          <div className="ExpInfo">
            <div id="textinfor">
              <p>10+</p>
              <p>Years Experiences</p>
            </div>
            <div id="textinfor">
              <p>250+</p>
              <p>Courses</p>
            </div>
          </div>
        </div>
      }
      <img src={personality} height={"750px"} width={"750px"} />
    </div>
  );
};
