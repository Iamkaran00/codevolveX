import React, { useState } from "react";
import { toast } from "react-toastify";
import { HiEye, HiEyeSlash, HiArrowRight } from "react-icons/hi2";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import { ACCOUNT_TYPE } from "../../../utils/constants";
import { sendOtp } from "../../../services/operations/authAPI";
import { setSignupData } from "../../../slices/auth.slice";
import GoogleAuthButton from "./GoogleAuthButton";

const EASE = [0.23, 1, 0.32, 1];

const display = "font-['Space_Grotesk',ui-sans-serif,system-ui,sans-serif]";
const mono = "font-['JetBrains_Mono',ui-monospace,monospace]";

const formV = { hidden: {}, show: { transition: { staggerChildren: 0.07, delayChildren: 0.1 } } };
const fieldV = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: EASE } },
};

const inputStyles =
  "w-full rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3.5 text-[15px] text-[#f3ece0] placeholder-zinc-600 outline-none transition-all duration-500 hover:border-white/20 focus:border-[#ffb454]/70 focus:bg-[#ffb454]/[0.04] focus:ring-4 focus:ring-[#ffb454]/10";
const labelStyles = `mb-2 block text-[11px] uppercase tracking-[0.2em] text-zinc-500 ${mono}`;

const Required = () => <span className="ml-1 text-[#ffb454]">*</span>;

const PasswordToggle = ({ shown, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    aria-label={shown ? "Hide password" : "Show password"}
    className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer rounded-full p-1.5 text-zinc-500 transition-colors duration-500 hover:text-[#ffb454] focus-visible:text-[#ffb454] focus-visible:outline-none"
  >
    {shown ? <HiEyeSlash size={18} /> : <HiEye size={18} />}
  </button>
);

export const SignupForm = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const reduce = useReducedMotion();

  const loading = useSelector((state) => state.auth?.loading);
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

  return (
    <div className="w-full">
      
      <div
        role="radiogroup"
        aria-label="Account type"
        className="relative mb-8 flex w-max rounded-full border border-white/10 bg-white/[0.03] p-1"
      >
        {[ACCOUNT_TYPE.STUDENT, ACCOUNT_TYPE.INSTRUCTOR].map((type) => {
          const active = accountType === type;
          return (
            <button
              key={type}
              type="button"
              role="radio"
              aria-checked={active}
              onClick={() => setAccountType(type)}
              className={`relative cursor-pointer rounded-full px-6 py-2.5 text-[12px] uppercase tracking-[0.15em] outline-none transition-colors duration-500 focus-visible:ring-1 focus-visible:ring-[#ffb454]/70 ${mono} ${
                active ? "text-[#1d1a16]" : "text-zinc-500 hover:text-zinc-300"
              }`}
            >
              {active && (
                <motion.span
                  layoutId="activeTab"
                  className="absolute inset-0 rounded-full bg-[#ffb454]"
                  transition={
                    reduce ? { duration: 0 } : { type: "spring", bounce: 0.2, duration: 0.6 }
                  }
                />
              )}
              <span className="relative z-10 font-medium">{type.toLowerCase()}</span>
            </button>
          );
        })}
      </div>

      <motion.form
        variants={formV}
        initial={reduce ? false : "hidden"}
        animate="show"
        onSubmit={handleOnSubmit}
        className="flex flex-col gap-y-5"
      >
        <motion.div variants={fieldV} className="flex flex-col gap-5 md:flex-row">
          <label className="w-full">
            <span className={labelStyles}>
              First name
              <Required />
            </span>
            <input
              required
              type="text"
              name="firstName"
              autoComplete="given-name"
              value={firstName}
              onChange={handleOnChange}
              placeholder="John"
              className={inputStyles}
            />
          </label>
          <label className="w-full">
            <span className={labelStyles}>
              Last name
              <Required />
            </span>
            <input
              required
              type="text"
              name="lastName"
              autoComplete="family-name"
              value={lastName}
              onChange={handleOnChange}
              placeholder="Doe"
              className={inputStyles}
            />
          </label>
        </motion.div>

        <motion.label variants={fieldV} className="block w-full">
          <span className={labelStyles}>
            Email address
            <Required />
          </span>
          <input
            required
            type="email"
            name="email"
            autoComplete="email"
            value={email}
            onChange={handleOnChange}
            placeholder="john@example.com"
            className={inputStyles}
          />
        </motion.label>

        <motion.div variants={fieldV} className="flex flex-col gap-5 md:flex-row">
          <label className="w-full">
            <span className={labelStyles}>
              Password
              <Required />
            </span>
            <div className="relative">
              <input
                required
                type={showPassword ? "text" : "password"}
                name="password"
                autoComplete="new-password"
                value={password}
                onChange={handleOnChange}
                placeholder="••••••••"
                className={`${inputStyles} pr-12`}
              />
              <PasswordToggle shown={showPassword} onClick={() => setShowPassword((p) => !p)} />
            </div>
          </label>

          <label className="w-full">
            <span className={labelStyles}>
              Confirm
              <Required />
            </span>
            <div className="relative">
              <input
                required
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                autoComplete="new-password"
                value={confirmPassword}
                onChange={handleOnChange}
                placeholder="••••••••"
                className={`${inputStyles} pr-12`}
              />
              <PasswordToggle
                shown={showConfirmPassword}
                onClick={() => setShowConfirmPassword((p) => !p)}
              />
            </div>
          </label>
        </motion.div>

        <motion.button
          variants={fieldV}
          type="submit"
          disabled={loading}
          className="group mt-2 flex w-full cursor-pointer items-center justify-center gap-2 rounded-full bg-[#ffb454] px-8 py-4 text-sm font-semibold text-[#1d1a16] transition-all duration-500 hover:bg-[#ffc272] focus:outline-none focus-visible:ring-4 focus-visible:ring-[#ffb454]/30 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? (
            <>
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-[#1d1a16] border-t-transparent" />
              Creating account...
            </>
          ) : (
            <>
              Create account
              <HiArrowRight className="h-4 w-4 transition-transform duration-500 group-hover:translate-x-1" />
            </>
          )}
        </motion.button>

        {/* divider */}
        <motion.div variants={fieldV} className="flex items-center gap-4">
          <span className="h-px flex-1 bg-white/[0.07]" />
          <span className={`text-[11px] uppercase tracking-[0.25em] text-zinc-600 ${mono}`}>or</span>
          <span className="h-px flex-1 bg-white/[0.07]" />
        </motion.div>

        <motion.div variants={fieldV}>
          <GoogleAuthButton accountType={accountType} />
        </motion.div>

        <motion.p variants={fieldV} className="text-center text-sm text-zinc-500">
          Already have an account?{" "}
          <Link
            to="/login"
            className={`font-medium text-[#ffb454] underline decoration-[#ffb454]/30 underline-offset-4 transition-colors duration-500 hover:decoration-[#ffb454] ${display}`}
          >
            Login
          </Link>
        </motion.p>
      </motion.form>
    </div>
  );
};