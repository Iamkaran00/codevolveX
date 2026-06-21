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
  }, []);

  const handleVerifyAndSignup = (e) => {
    e.preventDefault();
    const { firstName, lastName, email, password, confirmPassword, accountType } = signupData;
    dispatch(signup(firstName, lastName, email, password, confirmPassword, accountType, otp, navigate));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      {loading ? (
        <div className="flex flex-col items-center gap-4">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 bg-indigo-500 rounded-full animate-bounce" />
            <div className="w-3 h-3 bg-indigo-500 rounded-full animate-bounce [animation-delay:-.2s]" />
            <div className="w-3 h-3 bg-indigo-500 rounded-full animate-bounce [animation-delay:-.4s]" />
          </div>
          <p className="text-sm font-medium text-slate-500 tracking-wide">Authenticating...</p>
        </div>
      ) : (
        <div className="bg-white p-8 md:p-10 rounded-[2rem] w-full max-w-md border border-indigo-50 shadow-[0_4px_40px_-12px_rgba(79,70,229,0.1)]">
          <div className="mb-8 text-center">
            <h1 className="text-2xl font-semibold text-indigo-950 mb-2">Verify your email</h1>
            <p className="text-[14px] text-slate-500 leading-relaxed">
              We've sent a 6-digit code to <br />
              <span className="font-semibold text-indigo-700">{signupData?.email}</span>
            </p>
          </div>

          <form onSubmit={handleVerifyAndSignup} className="flex flex-col gap-8">
            <OtpInput
              value={otp}
              onChange={setOtp}
              numInputs={6}
              renderSeparator={<span className="w-2" />}
              renderInput={(props) => (
                <input
                  {...props}
                  className="!w-12 !h-14 bg-slate-50 border border-indigo-100 rounded-2xl text-indigo-950 text-xl font-semibold text-center transition-all outline-none focus:border-violet-400 focus:ring-4 focus:ring-violet-500/10"
                />
              )}
              containerStyle="flex justify-between w-full"
            />

            <button
              type="submit"
              disabled={otp.length < 6}
              className="w-full py-3.5 bg-indigo-600 text-white rounded-2xl text-sm font-semibold hover:bg-indigo-700 transition-all disabled:bg-slate-200 disabled:text-slate-400"
            >
              Verify & Continue
            </button>
          </form>

          <div className="flex justify-between items-center mt-8 pt-6 border-t border-slate-100">
            <Link
              to="/signup"
              className="flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-indigo-600 transition-colors"
            >
              <BiArrowBack size={16} /> Back
            </Link>

            <button
              onClick={() => dispatch(sendOtp(signupData.email, navigate))}
              className="flex items-center gap-2 text-sm font-medium text-indigo-600 hover:text-indigo-700 transition-colors"
            >
              <RxCountdownTimer size={16} /> Resend Code
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default VerifyEmail;