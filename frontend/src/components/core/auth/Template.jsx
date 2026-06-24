import React from "react";
import { motion } from "framer-motion";
import { SignupForm } from "./SignupForm";
import { LoginForm } from "./LoginForm";
import img from '../../../assets/login.png';

export const Template = ({ title, description1, description2, formType }) => {
  return (
    <div className="min-h-[calc(130vh-3.5rem)] flex items-center justify-center p-6 bg-slate-50">
      <div className="flex flex-col-reverse lg:flex-row w-full max-w-6xl mx-auto gap-12 lg:gap-20 items-center">

        {/* Left Content (Form) */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="w-full lg:w-1/2 flex flex-col gap-4"
        >
          <h1 className="text-4xl font-bold text-slate-900 tracking-tight">
            {title}
          </h1>
          <div className="flex flex-col text-lg">
            <span className="text-slate-600">{description1}</span>
            <span className="font-medium text-indigo-600 italic">
              {description2}
            </span>
          </div>

          <div className="mt-6">
            {formType === "signup" ? <SignupForm /> : <LoginForm />}
          </div>
        </motion.div>

        {/* Right Content (Images) */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
          className="w-full lg:w-1/2 relative hidden md:block"
        >
          <div className="relative w-full max-w-[500px] mx-auto aspect-square">
            <img
              src={img}
              alt="Students learning"
              className="absolute top-4 right-4 w-full h-full object-cover rounded-2xl z-10 transition-transform duration-500 hover:scale-[1.02]"
            />
          </div>
        </motion.div>

      </div>
    </div>
  );
};