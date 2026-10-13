import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { HiArrowLeft, HiArrowRight, HiEnvelope, HiCheck } from "react-icons/hi2";
import { getPasswordResetToken } from "../services/operations/authAPI";

const EASE = [0.23, 1, 0.32, 1];

const display = "font-['Space_Grotesk',ui-sans-serif,system-ui,sans-serif]";
const mono = "font-['JetBrains_Mono',ui-monospace,monospace]";

const GRAIN = `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.8' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>")`;

const inputStyles =
  "w-full rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3.5 text-[15px] text-[#f3ece0] placeholder-zinc-600 outline-none transition-all duration-500 hover:border-white/20 focus:border-[#ffb454]/70 focus:bg-[#ffb454]/[0.04] focus:ring-4 focus:ring-[#ffb454]/10";

const Grain = ({ opacity = "opacity-[0.06]" }) => (
  <div
    aria-hidden
    className={`pointer-events-none absolute inset-0 mix-blend-overlay ${opacity}`}
    style={{ backgroundImage: GRAIN }}
  />
);

/* envelope that gains a tick once the email is sent */
const MailBadge = ({ sent, reduce }) => (
  <div className="relative mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-white/15">
    <motion.span
      aria-hidden
      initial={false}
      animate={{ scale: sent ? [1, 1.6] : 1, opacity: sent ? [0.5, 0] : 0 }}
      transition={{ duration: reduce ? 0 : 1.2, ease: EASE }}
      className="absolute inset-0 rounded-full border border-[#ffb454]"
    />
    <HiEnvelope
      className={`h-7 w-7 transition-colors duration-700 ${
        sent ? "text-[#ffb454]" : "text-zinc-400"
      }`}
    />
    <AnimatePresence>
      {sent && (
        <motion.span
          initial={reduce ? false : { scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0, opacity: 0 }}
          transition={{ duration: 0.6, ease: EASE, delay: 0.15 }}
          className="absolute -right-1 -top-1 flex h-6 w-6 items-center justify-center rounded-full bg-[#ffb454] text-[#1d1a16] ring-4 ring-[#14130f]"
        >
          <HiCheck className="h-3.5 w-3.5" />
        </motion.span>
      )}
    </AnimatePresence>
  </div>
);

export const ForgotPassword = () => {
  const { loading } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const reduce = useReducedMotion();
  const [email, setEmail] = useState("");
  const [emailSent, setEmailSent] = useState(false);

  const handleOnSubmit = (e) => {
    e.preventDefault();
    dispatch(getPasswordResetToken(email, setEmailSent));
  };

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
            Processing request
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
            <div className="flex items-center justify-center gap-3">
              <span className="h-px w-8 bg-[#ffb454]" />
              <p className={`text-[11px] uppercase tracking-[0.25em] text-zinc-500 ${mono}`}>
                CodevolveX
              </p>
              <span className="h-px w-8 bg-[#ffb454]" />
            </div>

            <div className="mt-8">
              <MailBadge sent={emailSent} reduce={reduce} />
            </div>

            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={emailSent ? "sent" : "ask"}
                initial={reduce ? false : { opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduce ? { opacity: 0 } : { opacity: 0, y: -10 }}
                transition={{ duration: 0.5, ease: EASE }}
                className="mt-8 text-center"
              >
                <h1
                  className={`text-3xl font-semibold leading-[1.1] tracking-tight text-[#f3ece0] ${display}`}
                >
                  {!emailSent ? "Reset your password" : "Check your email"}
                  <span className="text-[#ffb454]">.</span>
                </h1>
                <p className="mt-4 text-sm leading-relaxed text-zinc-500">
                  {!emailSent ? (
                    "Have no fear. We'll email you instructions to reset your password. If you don't have access to your email we can try account recovery."
                  ) : (
                    <>
                      We have sent the reset email to{" "}
                      <span className="break-all font-medium text-[#ffb454]">{email}</span>
                    </>
                  )}
                </p>
              </motion.div>
            </AnimatePresence>

            <form onSubmit={handleOnSubmit} className="mt-8 flex flex-col gap-6">
              {!emailSent && (
                <div>
                  <label
                    htmlFor="email"
                    className={`mb-2 block text-[11px] uppercase tracking-[0.2em] text-zinc-500 ${mono}`}
                  >
                    Email address
                  </label>
                  <input
                    required
                    type="email"
                    id="email"
                    name="email"
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address"
                    className={inputStyles}
                  />
                </div>
              )}

              <button
                type="submit"
                className="group flex w-full cursor-pointer items-center justify-center gap-2 rounded-full bg-[#ffb454] px-8 py-4 text-sm font-semibold text-[#1d1a16] transition-all duration-500 hover:bg-[#ffc272] focus:outline-none focus-visible:ring-4 focus-visible:ring-[#ffb454]/30 active:scale-[0.98]"
              >
                {!emailSent ? "Reset password" : "Resend email"}
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

export default ForgotPassword;