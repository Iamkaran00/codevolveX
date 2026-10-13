import React, { useEffect, useState } from "react";
import OtpInput from "react-otp-input";
import { HiArrowLeft, HiArrowPath, HiArrowRight, HiEnvelope } from "react-icons/hi2";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import { signup, sendOtp } from "../services/operations/authAPI";

const EASE = [0.23, 1, 0.32, 1];

const display = "font-['Space_Grotesk',ui-sans-serif,system-ui,sans-serif]";
const mono = "font-['JetBrains_Mono',ui-monospace,monospace]";

const GRAIN = `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.8' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>")`;

const OTP_LENGTH = 6;

function VerifyEmail() {
  const [otp, setOtp] = useState("");
  const { signupData, loading } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const reduce = useReducedMotion();

  useEffect(() => {
    if (!signupData) {
      navigate("/signup");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleVerifyAndSignup = (e) => {
    e.preventDefault();
    const { firstName, lastName, email, password, confirmPassword, accountType } = signupData;
    dispatch(
      signup(firstName, lastName, email, password, confirmPassword, accountType, otp, navigate)
    );
  };

  const complete = otp.length === OTP_LENGTH;

  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#100f0d] px-5 pb-16 pt-28 sm:px-8">
      {/* grain */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.06] mix-blend-overlay"
        style={{ backgroundImage: GRAIN }}
      />
      {/* ambient amber glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/3 h-96 w-96 -translate-x-1/2 rounded-full bg-[#ffb454] opacity-[0.06] blur-3xl"
      />

      <motion.div
        initial={reduce ? false : { opacity: 0, y: 28 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: EASE }}
        className="relative w-full max-w-md overflow-hidden rounded-3xl border border-white/[0.08] bg-[#14130f] p-8 sm:p-10"
      >
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.06] mix-blend-overlay"
          style={{ backgroundImage: GRAIN }}
        />

        <div className="relative">
          {/* header */}
          <div className="flex items-center justify-center gap-3">
            <span className="h-px w-8 bg-[#ffb454]" />
            <p className={`text-[11px] uppercase tracking-[0.25em] text-zinc-500 ${mono}`}>
              Verification
            </p>
            <span className="h-px w-8 bg-[#ffb454]" />
          </div>

          <div className="mx-auto mt-8 flex h-16 w-16 items-center justify-center rounded-full border border-white/15">
            <HiEnvelope className="h-7 w-7 text-[#ffb454]" />
          </div>

          <div className="mt-8 text-center">
            <h1
              className={`text-3xl font-semibold leading-[1.1] tracking-tight text-[#f3ece0] ${display}`}
            >
              Verify your email<span className="text-[#ffb454]">.</span>
            </h1>
            <p className="mt-4 text-sm leading-relaxed text-zinc-500">
              We've sent a 6-digit code to <br />
              <span className="break-all font-medium text-[#ffb454]">{signupData?.email}</span>
            </p>
          </div>

          <form onSubmit={handleVerifyAndSignup} className="mt-9 flex flex-col gap-6">
            <div>
              <OtpInput
                value={otp}
                onChange={setOtp}
                numInputs={OTP_LENGTH}
                inputType="tel"
                shouldAutoFocus
                renderSeparator={<span className="w-2" />}
                renderInput={(props, index) => (
                  <input
                    {...props}
                    autoComplete={index === 0 ? "one-time-code" : "off"}
                    aria-label={`Digit ${index + 1} of ${OTP_LENGTH}`}
                    className={`!h-14 !w-11 rounded-2xl border text-center text-xl font-semibold text-[#f3ece0] outline-none transition-all duration-500 sm:!w-12 ${display} ${
                      props.value
                        ? "border-[#ffb454]/60 bg-[#ffb454]/[0.06]"
                        : "border-white/10 bg-white/[0.03] hover:border-white/20"
                    } focus:border-[#ffb454] focus:bg-[#ffb454]/[0.06] focus:ring-4 focus:ring-[#ffb454]/10`}
                  />
                )}
                containerStyle="flex justify-between w-full"
              />

              {/* fills as digits are entered */}
              <div className="mt-5 h-px w-full bg-white/10">
                <motion.div
                  animate={{ width: `${(otp.length / OTP_LENGTH) * 100}%` }}
                  transition={{ duration: reduce ? 0 : 0.5, ease: EASE }}
                  className="h-px bg-[#ffb454]"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={!complete || loading}
              className="group flex w-full cursor-pointer items-center justify-center gap-2 rounded-full bg-[#ffb454] px-8 py-4 text-sm font-semibold text-[#1d1a16] transition-all duration-500 hover:bg-[#ffc272] focus:outline-none focus-visible:ring-4 focus-visible:ring-[#ffb454]/30 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-[#ffb454] disabled:active:scale-100"
            >
              {loading ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-[#1d1a16] border-t-transparent" />
                  Verifying...
                </>
              ) : (
                <>
                  Verify &amp; continue
                  <HiArrowRight className="h-4 w-4 transition-transform duration-500 group-hover:translate-x-1" />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 flex items-center justify-between border-t border-white/[0.07] pt-6">
            <Link
              to="/signup"
              className="group flex items-center gap-2 text-sm text-zinc-500 transition-colors duration-500 hover:text-[#ffb454]"
            >
              <HiArrowLeft className="h-4 w-4 transition-transform duration-500 group-hover:-translate-x-1" />
              Back
            </Link>

            <button
              type="button"
              onClick={() => dispatch(sendOtp(signupData.email, navigate))}
              disabled={loading}
              className="group flex cursor-pointer items-center gap-2 text-sm text-[#ffb454] transition-opacity duration-500 hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <HiArrowPath className="h-4 w-4 transition-transform duration-700 group-hover:rotate-180" />
              Resend code
            </button>
          </div>
        </div>
      </motion.div>
    </section>
  );
}

export default VerifyEmail;