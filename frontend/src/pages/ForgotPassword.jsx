import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { BiArrowBack } from 'react-icons/bi';
import { getPasswordResetToken } from '../services/operations/authAPI';
import { useNavigate } from 'react-router-dom';
export const ForgotPassword = () => {
  const { loading } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [emailSent, setEmailSent] = useState(false);

  const handleOnSubmit = (e) => {
    e.preventDefault();
    dispatch(getPasswordResetToken(email, setEmailSent));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 font-sans p-4">
      {loading ? (
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin"></div>
          <p className="text-gray-500 font-medium text-sm">Processing request...</p>
        </div>
      ) : (
        <div className="bg-white border border-gray-100 p-8 sm:p-10 rounded-2xl w-full max-w-md shadow-xl relative overflow-hidden">
          
          <div className="absolute top-0 left-0 w-full h-1 bg-blue-600"></div>

          
          <div className="text-blue-600 text-xs font-bold tracking-widest uppercase mb-6 text-center">
            CodevolveX
          </div>

          <div className="mb-8">
            <h1 className="text-2xl font-bold mb-3 text-gray-900 tracking-tight text-center">
              {!emailSent ? "Reset Your Password" : "Check your email"}
            </h1>
            <p className="text-sm text-gray-500 leading-relaxed text-center">
              {!emailSent 
                ? "Have no fear. We'll email you instructions to reset your password. If you don't have access to your email we can try account recovery." 
                : `We have sent the reset email to `}
              {emailSent && <span className="font-semibold text-gray-900">{email}</span>}
            </p>
          </div>

          <form onSubmit={handleOnSubmit} className="flex flex-col gap-6">
            {!emailSent && (
              <div className="flex flex-col gap-2">
                <label htmlFor="email" className="text-sm font-medium text-gray-700">
                  Email Address
                </label>
                <input
                  required
                  type="email"
                  id="email"
                  name="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 text-sm transition-all outline-none focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 placeholder:text-gray-400"
                />
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3 px-4 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 active:scale-[0.98] transition-all focus:outline-none focus:ring-4 focus:ring-blue-500/30 shadow-sm"
            >
              {!emailSent ? "Reset Password" : "Resend Email"}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-gray-100 flex justify-center">
            <Link
              to="/login"
              className="flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-blue-600 transition-colors group"
            >
              <BiArrowBack className="text-lg transition-transform group-hover:-translate-x-1" />
              Back To Login
            </Link>
          </div>

        </div>
      )}
    </div>
  );
};