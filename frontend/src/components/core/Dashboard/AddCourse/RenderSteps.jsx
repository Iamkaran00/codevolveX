import React from "react";
import { FaCheck } from "react-icons/fa";
import { useSelector } from "react-redux";

import CourseBuilderForm from "./CourseBuilder/CourseBuilderForm";
import CourseInformationForm from "./CourseInformation/CourseInformationForm";
import PublishCourse from "./PublishCourse";

export default function RenderSteps() {
  const { step } = useSelector((state) => state.course);
console.log("hi there" , step);
  const steps = [
    { id: 1, title: "Course Information" },
    { id: 2, title: "Course Builder" },
    { id: 3, title: "Publish Settings" },
  ];

  return (
    <div className="w-full flex flex-col items-center">
      
       
      <div className="relative mb-4 flex w-full max-w-[600px] items-center justify-between px-4">
        {steps.map((item, index) => (
          <React.Fragment key={item.id}>
            <div className="flex items-center">
            
              <div
                className={`grid h-9 w-9 place-items-center rounded-full border-2 font-bold text-sm transition-all duration-300 shadow-sm
                  ${step === item.id
                    ? "border-indigo-600 bg-white text-indigo-600 ring-4 ring-indigo-50"
                    : step > item.id
                    ? "border-indigo-600 bg-indigo-600 text-white"
                    : "border-slate-200 bg-slate-50 text-slate-400"
                  }`}
              >
                {step > item.id ? (
                  <FaCheck className="text-xs transition-transform animate-scaleUp" />
                ) : (
                  item.id
                )}
              </div>
            </div>

            {/* Dashed Connecting Line Tracker Bar */}
            {index !== steps.length - 1 && (
              <div
                className={`h-0.5 flex-1 border-t-2 border-dashed transition-all duration-500 mx-2
                  ${step > item.id ? "border-indigo-500" : "border-slate-200"}`}
              />
            )}
          </React.Fragment>
        ))}
      </div>

      
      <div className="relative mb-12 flex w-full max-w-[660px] select-none justify-between px-1 text-center">
        {steps.map((item) => (
          <div key={item.id} className="flex min-w-[140px] flex-col items-center">
            <p
              className={`text-xs font-bold tracking-tight uppercase
                ${step >= item.id ? "text-slate-800" : "text-slate-400"}`}
            >
              {item.title}
            </p>
          </div>
        ))}
      </div>

      <div className="w-150 animate-fadeIn">
        {step === 1 && <CourseInformationForm />}
        {step === 2 && <CourseBuilderForm />}
        {step === 3 && <PublishCourse />}
      </div>
    </div>
  );
}