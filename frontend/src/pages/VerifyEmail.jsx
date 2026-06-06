import React, { useEffect, useState } from "react";
import OtpInput from "react-otp-input";
import { BiArrowBack } from "react-icons/bi";
import { RxCountdownTimer } from "react-icons/rx";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { signup, sendOtp } from "../services/operations/authAPI";

function VerifyEmail() {
  const [otp, setOtp] = useState("");
  const { signupData, loading } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (!signupData) {
      navigate("/signup");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleVerifyAndSignup = (e) => {
    e.preventDefault();
    const {
      firstName,
      lastName,
      email,
      password,
      confirmPassword,
      accountType,
    } = signupData;

    dispatch(
      signup(
        firstName,
        lastName,
        email,
        password,
        confirmPassword,
        accountType,
        otp,
        navigate
      )
    );
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0F172A] font-sans text-slate-200 p-4">
      {loading ? (
        <div className="flex flex-col items-center gap-4">
          {/* IDE-style loader */}
          <div className="flex gap-1">
            <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce"></div>
            <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce [animation-delay:-.3s]"></div>
            <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce [animation-delay:-.5s]"></div>
          </div>
          <p className="text-slate-400 font-mono text-sm">Compiling request...</p>
        </div>
      ) : (
        <div className="bg-[#1E293B] border border-slate-700/50 p-8 sm:p-10 rounded-xl w-full max-w-md shadow-2xl relative overflow-hidden">
          
          {/* Top accent line representing a code editor tab */}
          <div className="absolute top-0 left-0 w-full h-1 bg-blue-600"></div>
          
          <div className="mb-8 text-center">
            <h1 className="text-2xl font-bold mb-2 text-white tracking-tight">
              Verify your email
            </h1>
            <p className="text-sm text-slate-400">
              A 6-digit code has been sent to <br/>
              <span className="text-slate-200 font-medium">{signupData?.email}</span>
            </p>
          </div>

          <form onSubmit={handleVerifyAndSignup} className="flex flex-col gap-8">
            <div className="flex justify-center">
              <OtpInput
                value={otp}
                onChange={setOtp}
                numInputs={6}
                renderSeparator={<span className="w-2 sm:w-3"></span>}
                renderInput={(props) => (
                  <input
                    {...props}
                    // Added font-mono to make the numbers look like code
                    className="!w-12 !h-14 bg-[#0F172A] border border-slate-600 rounded-md text-white text-2xl font-mono font-semibold text-center transition-all outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 shadow-sm placeholder:text-slate-700"
                    placeholder="0"
                  />
                )}
                containerStyle="flex justify-between w-full"
              />
            </div>

            <button
              type="submit"
              disabled={otp.length < 6}
              className="w-full py-3 px-4 bg-blue-600 text-white rounded-md text-sm font-semibold hover:bg-blue-700 focus:ring-4 focus:ring-blue-500/30 transition-all disabled:bg-slate-700 disabled:text-slate-500 disabled:cursor-not-allowed"
            >
              Verify & Continue
            </button>
          </form>

          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-8 pt-6 border-t border-slate-700/50">
            <Link
              to="/signup"
              className="flex items-center gap-2 text-sm font-medium text-slate-400 hover:text-blue-400 transition-colors"
            >
              <BiArrowBack className="text-lg" /> 
              Back to Signup
            </Link>

            <button
              onClick={() => dispatch(sendOtp(signupData.email, navigate))}
              className="flex items-center gap-2 text-sm font-medium text-slate-400 hover:text-blue-400 transition-colors bg-transparent border-none cursor-pointer p-0"
            >
              <RxCountdownTimer className="text-lg" />
              Resend Code
            </button>
          </div>
          
        </div>
      )}
    </div>
  );
}

export default VerifyEmail;