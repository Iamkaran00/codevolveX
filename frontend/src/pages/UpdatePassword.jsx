import React, { useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import {
  HiArrowLeft,
  HiArrowRight,
  HiCheck,
  HiEye,
  HiEyeSlash,
  HiLockClosed,
  HiXMark,
} from "react-icons/hi2";
import { resetPassword } from "../services/operations/authAPI";

const EASE = [0.23, 1, 0.32, 1];

const display = "font-['Space_Grotesk',ui-sans-serif,system-ui,sans-serif]";
const mono = "font-['JetBrains_Mono',ui-monospace,monospace]";

const GRAIN = `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.8' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>")`;

const inputStyles =
  "w-full rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3.5 pr-12 text-[15px] text-[#f3ece0] placeholder-zinc-600 outline-none transition-all duration-500 hover:border-white/20 focus:border-[#ffb454]/70 focus:bg-[#ffb454]/[0.04] focus:ring-4 focus:ring-[#ffb454]/10";
const labelStyles = `mb-2 block text-[11px] uppercase tracking-[0.2em] text-zinc-500 ${mono}`;

const Grain = () => (
  <div
    aria-hidden
    className="pointer-events-none absolute inset-0 opacity-[0.06] mix-blend-overlay"
    style={{ backgroundImage: GRAIN }}
  />
);

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

const UpdatePassword = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const reduce = useReducedMotion();

  const { loading } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { password, confirmPassword } = formData;

  const handleOnChange = (e) => {
    setFormData((prevData) => ({
      ...prevData,
      [e.target.name]: e.target.value,
    }));
  };

  const handleOnSubmit = (e) => {
    e.preventDefault();
    const token = location.pathname.split("/").at(-1);
    dispatch(resetPassword(password, confirmPassword, token, navigate));
  };

  const showMatch = confirmPassword.length > 0;
  const matches = password === confirmPassword;

  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#100f0d] px-5 pb-16 pt-28 sm:px-8">
      <Grain />
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/3 h-96 w-96 -translate-x-1/2 rounded-full bg-[#ffb454] opacity-[0.06] blur-3xl"
      />

      {loading ? (
        <div className="relative flex flex-col items-center gap-5" role="status">
          <span className="h-10 w-10 animate-spin rounded-full border-2 border-white/10 border-t-[#ffb454]" />
          <p className={`text-[11px] uppercase tracking-[0.25em] text-zinc-500 ${mono}`}>
            Updating password
          </p>
        </div>
      ) : (
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: EASE }}
          className="relative w-full max-w-md overflow-hidden rounded-3xl border border-white/[0.08] bg-[#14130f] p-8 sm:p-10"
        >
          <Grain />

          <div className="relative">
            {/* brand */}
            <div className="flex items-center justify-center gap-3">
              <span className="h-px w-8 bg-[#ffb454]" />
              <p className={`text-[11px] uppercase tracking-[0.25em] text-zinc-500 ${mono}`}>
                codevolveX
              </p>
              <span className="h-px w-8 bg-[#ffb454]" />
            </div>

            <div className="mx-auto mt-8 flex h-16 w-16 items-center justify-center rounded-full border border-white/15">
              <HiLockClosed className="h-7 w-7 text-[#ffb454]" />
            </div>

            <div className="mt-8 text-center">
              <h1
                className={`text-3xl font-semibold leading-[1.1] tracking-tight text-[#f3ece0] ${display}`}
              >
                Choose new password<span className="text-[#ffb454]">.</span>
              </h1>
              <p className="mt-4 text-sm leading-relaxed text-zinc-500">
                Almost there. Enter your new password and you're all set to get back into your
                account.
              </p>
            </div>

            <form onSubmit={handleOnSubmit} className="mt-9 flex flex-col gap-5">
              <div>
                <label htmlFor="password" className={labelStyles}>
                  New password
                  <Required />
                </label>
                <div className="relative">
                  <input
                    id="password"
                    required
                    type={showPassword ? "text" : "password"}
                    name="password"
                    autoComplete="new-password"
                    value={password}
                    onChange={handleOnChange}
                    placeholder="Enter new password"
                    className={inputStyles}
                  />
                  <PasswordToggle shown={showPassword} onClick={() => setShowPassword((p) => !p)} />
                </div>
              </div>

              <div>
                <label htmlFor="confirmPassword" className={labelStyles}>
                  Confirm new password
                  <Required />
                </label>
                <div className="relative">
                  <input
                    id="confirmPassword"
                    required
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    autoComplete="new-password"
                    value={confirmPassword}
                    onChange={handleOnChange}
                    placeholder="Confirm new password"
                    className={inputStyles}
                  />
                  <PasswordToggle
                    shown={showConfirmPassword}
                    onClick={() => setShowConfirmPassword((p) => !p)}
                  />
                </div>

                {/* live match hint */}
                <div className="mt-3 h-4" aria-live="polite">
                  <AnimatePresence mode="wait" initial={false}>
                    {showMatch && (
                      <motion.p
                        key={matches ? "match" : "nomatch"}
                        initial={reduce ? false : { opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.4, ease: EASE }}
                        className={`flex items-center gap-1.5 text-[11px] uppercase tracking-[0.15em] ${mono} ${
                          matches ? "text-[#ffb454]" : "text-zinc-500"
                        }`}
                      >
                        {matches ? (
                          <>
                            <HiCheck className="h-3.5 w-3.5" />
                            Passwords match
                          </>
                        ) : (
                          <>
                            <HiXMark className="h-3.5 w-3.5" />
                            Passwords don't match yet
                          </>
                        )}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              <button
                type="submit"
                className="group mt-1 flex w-full cursor-pointer items-center justify-center gap-2 rounded-full bg-[#ffb454] px-8 py-4 text-sm font-semibold text-[#1d1a16] transition-all duration-500 hover:bg-[#ffc272] focus:outline-none focus-visible:ring-4 focus-visible:ring-[#ffb454]/30 active:scale-[0.98]"
              >
                Reset password
                <HiArrowRight className="h-4 w-4 transition-transform duration-500 group-hover:translate-x-1" />
              </button>
            </form>

            <div className="mt-8 flex justify-center border-t border-white/[0.07] pt-6">
              <Link
                to="/login"
                className="group flex items-center gap-2 text-sm text-zinc-500 transition-colors duration-500 hover:text-[#ffb454]"
              >
                <HiArrowLeft className="h-4 w-4 transition-transform duration-500 group-hover:-translate-x-1" />
                Back to login
              </Link>
            </div>
          </div>
        </motion.div>
      )}
    </section>
  );
};

export default UpdatePassword;