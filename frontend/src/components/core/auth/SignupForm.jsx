import React, { useState } from "react";
import { toast } from "react-toastify";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ACCOUNT_TYPE } from "../../../utils/constants";
import { sendOtp } from "../../../services/operations/authAPI";
import { setSignupData } from "../../../slices/auth.slice";
import { Link } from "react-router-dom";
export const SignupForm = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [accountType, setAccountType] = useState(ACCOUNT_TYPE.STUDENT);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const { firstName, lastName, email, password, confirmPassword } = formData;

  const handleOnChange = (e) => {
    setFormData((prevData) => ({
      ...prevData,
      [e.target.name]: e.target.value,
    }));
  };

  const handleOnSubmit = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    const signupData = { ...formData, accountType };
    dispatch(setSignupData(signupData));
    dispatch(sendOtp(formData.email, navigate));

    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
    });
    setAccountType(ACCOUNT_TYPE.STUDENT);
  };

  
  const inputStyles = "w-full rounded-xl bg-white px-4 py-3 text-gray-900 border border-gray-200 placeholder-gray-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/15 outline-none transition-all duration-200 shadow-sm";
  const labelStyles = "mb-1.5 text-sm font-medium text-gray-700 block";

  return (
    <div className="w-full">
     
      <div className="relative flex w-max bg-black p-1.5 rounded-full mb-8 backdrop-blur-sm border border-gray-200/50">
        {Object.values([ACCOUNT_TYPE.STUDENT, ACCOUNT_TYPE.INSTRUCTOR]).map((type) => (
          <button
            key={type}
            type="button"
            onClick={() => setAccountType(type)}
            className={`relative z-10 px-6 py-2 rounded-full text-sm font-semibold transition-colors duration-300  ${
              accountType === type ? "text-indigo-700" : "text-black-500 hover:text-black-700"
            }`}
          >
            {accountType === type && (
              <motion.div
                layoutId="activeTab"
                className="absolute inset-0 bg-white/50 rounded-full shadow-sm border border-gray-200/50"
                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
              />
            )}
            <span className="relative z-20 capitalize">{type.toLowerCase()}</span>
          </button>
        ))}
      </div>

      <form onSubmit={handleOnSubmit} className="flex flex-col gap-y-5">
        <div className="flex flex-col md:flex-row gap-5">
          <label className="w-full">
            <p className={labelStyles}>First Name <span className="text-red-500">*</span></p>
            <input
              required
              type="text"
              name="firstName"
              value={firstName}
              onChange={handleOnChange}
              placeholder="John"
              className={inputStyles}
            />
          </label>
          <label className="w-full">
            <p className={labelStyles}>Last Name <span className="text-red-500">*</span></p>
            <input
              required
              type="text"
              name="lastName"
              value={lastName}
              onChange={handleOnChange}
              placeholder="Doe"
              className={inputStyles}
            />
          </label>
        </div>

        <label className="w-full">
          <p className={labelStyles}>Email Address <span className="text-red-500">*</span></p>
          <input
            required
            type="email"
            name="email"
            value={email}
            onChange={handleOnChange}
            placeholder="john@example.com"
            className={inputStyles}
          />
        </label>

        <div className="flex flex-col md:flex-row gap-5">
          <label className="relative w-full">
            <p className={labelStyles}>Password <span className="text-red-500">*</span></p>
            <div className="relative">
              <input
                required
                type={showPassword ? "text" : "password"}
                name="password"
                value={password}
                onChange={handleOnChange}
                placeholder="••••••••"
                className={`${inputStyles} pr-10`}
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 transition-colors"
              >
                {showPassword ? <AiOutlineEyeInvisible size={20} /> : <AiOutlineEye size={20} />}
              </button>
            </div>
          </label>
          
          <label className="relative w-full">
            <p className={labelStyles}>Confirm <span className="text-red-500">*</span></p>
            <div className="relative">
              <input
                required
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                value={confirmPassword}
                onChange={handleOnChange}
                placeholder="••••••••"
                className={`${inputStyles} pr-10`}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword((prev) => !prev)}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 transition-colors"
              >
                {showConfirmPassword ? <AiOutlineEyeInvisible size={20} /> : <AiOutlineEye size={20} />}
              </button>
            </div>
          </label>
        </div>

        <motion.button
          whileHover={{ y: -1 }}
          whileTap={{ scale: 0.98 }}
          type="submit"
          className="mt-6 w-full rounded-xl bg-gradient-to-r bg-indigo-600 py-3.5  text-white shadow-lg shadow-indigo-200 transition-all hover:shadow-xl hover:shadow-indigo-300 focus:outline-none focus:ring-4 focus:ring-indigo-500/30"
        >
          Create Account
        </motion.button>
        <div className="flex m-auto gap-2">
        <p>Already have an account ? </p>
         <Link to = '/login' className="underline text-indigo-600" > 
         Login
         </Link>
        </div>
      </form>
    </div>
  );
};