import React, { useState } from "react";
import { HiEye, HiEyeSlash, HiArrowRight } from "react-icons/hi2";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import GoogleAuthButton from "./GoogleAuthButton";
import { login } from "../../../services/operations/authAPI";

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

export const LoginForm = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const reduce = useReducedMotion();

  const loading = useSelector((state) => state.auth?.loading);

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
    <motion.form
      variants={formV}
      initial={reduce ? false : "hidden"}
      animate="show"
      onSubmit={handleOnSubmit}
      className="flex w-full flex-col gap-y-5"
    >
      <motion.div variants={fieldV}>
        <label htmlFor="email" className={labelStyles}>
          Email address
          <Required />
        </label>
        <input
          id="email"
          required
          type="email"
          name="email"
          autoComplete="email"
          value={email}
          onChange={handleOnChange}
          placeholder="Enter email address"
          className={inputStyles}
        />
      </motion.div>

      <motion.div variants={fieldV}>
        <div className="flex items-baseline justify-between">
          <label htmlFor="password" className={labelStyles}>
            Password
            <Required />
          </label>
          <Link
            to="/forgot-password"
            className={`mb-2 text-[11px] uppercase tracking-[0.15em] text-zinc-500 underline decoration-white/10 underline-offset-4 transition-colors duration-500 hover:text-[#ffb454] hover:decoration-[#ffb454] ${mono}`}
          >
            Forgot password?
          </Link>
        </div>

        <div className="relative">
          <input
            id="password"
            required
            type={showPassword ? "text" : "password"}
            name="password"
            autoComplete="current-password"
            value={password}
            onChange={handleOnChange}
            placeholder="Enter password"
            className={`${inputStyles} pr-12`}
          />
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            aria-label={showPassword ? "Hide password" : "Show password"}
            className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer rounded-full p-1.5 text-zinc-500 transition-colors duration-500 hover:text-[#ffb454] focus-visible:text-[#ffb454] focus-visible:outline-none"
          >
            {showPassword ? <HiEyeSlash size={18} /> : <HiEye size={18} />}
          </button>
        </div>
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
            Signing in...
          </>
        ) : (
          <>
            Sign in
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
        <GoogleAuthButton />
      </motion.div>

      <motion.p variants={fieldV} className="text-center text-sm text-zinc-500">
        New here?{" "}
        <Link
          to="/signup"
          className={`font-medium text-[#ffb454] underline decoration-[#ffb454]/30 underline-offset-4 transition-colors duration-500 hover:decoration-[#ffb454] ${display}`}
        >
          Create an account
        </Link>
      </motion.p>
    </motion.form>
  );
};

export default LoginForm;