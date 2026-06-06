import React, { useState } from "react";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai"; // Grouped imports
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { login } from "../../../services/operations/authAPI";

export const LoginForm = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const { email, password } = formData;

  const handleOnChange = (e) => {
    setFormData((prevData) => ({
      ...prevData,
      [e.target.name]: e.target.value,
    }));
  };

  const handleOnSubmit = (e) => {
    e.preventDefault();
    dispatch(login(email, password, navigate));
  };

  return (
    <form 
      onSubmit={handleOnSubmit} 
      className="flex flex-col gap-y-5 w-full max-w-md mx-auto p-6 bg-white rounded-lg  relative right-13"
    >
      {/* Email Input Field */}
      <div className="flex flex-col gap-y-1">
        <label htmlFor="email" className="text-sm font-medium text-gray-700">
          Email Address <span className="text-red-500">*</span>
        </label>
        <input
          id="email"
          required
          type="email"  
          name="email"
          value={email}
          onChange={handleOnChange}
          placeholder="Enter email address"
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
        />
      </div>

      {/* Password Input Field */}
      <div className="flex flex-col gap-y-1">
        <label htmlFor="password" className="text-sm font-medium text-gray-700">
          Password <span className="text-red-500">*</span>
        </label>
        
        <div className="relative">
          <input
            id="password"
            required
            type={showPassword ? "text" : "password"}
            name="password"
            value={password}
            onChange={handleOnChange}
            placeholder="Enter Password"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all pr-10"
          />
          
          {/* Changed span to button for keyboard accessibility */}
          <button
            type="button" 
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none focus:text-blue-500 transition-colors"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? (
              <AiOutlineEyeInvisible size={20} />
            ) : (
              <AiOutlineEye size={20} />
            )}
          </button>
        </div>

        {/* Forgot Password Link */}
        <div className="flex justify-end mt-1">
          <Link 
            to="/forgot-password" 
            className="text-xs text-blue-600 hover:text-blue-800 hover:underline transition-colors"
          >
            Forgot Password?
          </Link>
        </div>
      </div>

      {/* Submit Button */}
      <button 
        type="submit"
        className="w-full mt-2 bg-blue-600 text-white font-semibold py-2.5 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all active:scale-[0.98]"
      >
        Sign In
      </button>
    </form>
  );
};

export default LoginForm;