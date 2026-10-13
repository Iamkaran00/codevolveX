import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { SignupForm } from "./SignupForm";
import { LoginForm } from "./LoginForm";
import img from "../../../assets/login.png";

const EASE = [0.23, 1, 0.32, 1];

const display = "font-['Space_Grotesk',ui-sans-serif,system-ui,sans-serif]";
const mono = "font-['JetBrains_Mono',ui-monospace,monospace]";

const GRAIN = `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.8' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>")`;

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
};
const item = {
  hidden: { opacity: 0, y: 22 },
  show: { opacity: 1, y: 0, transition: { duration: 0.95, ease: EASE } },
};

export const Template = ({ title, description1, description2, image, formType }) => {
  const reduce = useReducedMotion();

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
        className="pointer-events-none absolute -left-32 top-1/4 h-96 w-96 rounded-full bg-[#ffb454] opacity-[0.06] blur-3xl"
      />

      <div className="relative mx-auto flex w-full max-w-6xl flex-col-reverse items-center gap-14 lg:flex-row lg:gap-20">
        {/* left: words + form */}
        <motion.div
          variants={container}
          initial={reduce ? false : "hidden"}
          animate="show"
          className="flex w-full flex-col lg:w-1/2"
        >
          <motion.div variants={item} className="flex items-center gap-3">
            <span className="h-px w-8 bg-[#ffb454]" />
            <p className={`text-[11px] uppercase tracking-[0.25em] text-zinc-500 ${mono}`}>
              {formType === "signup" ? "Create your account" : "Welcome back"}
            </p>
          </motion.div>

          <motion.h1
            variants={item}
            className={`mt-6 text-4xl font-semibold leading-[1.08] tracking-tight text-[#f3ece0] sm:text-5xl ${display}`}
          >
            {title}
          </motion.h1>

          <motion.div variants={item} className="mt-6 flex flex-col gap-1 text-base sm:text-lg">
            <span className="text-zinc-400">{description1}</span>
            <span className="text-[#ffb454]">{description2}</span>
          </motion.div>

          <motion.div
            variants={item}
            className="mt-10 border-t border-white/[0.07] pt-10"
          >
            {formType === "signup" ? <SignupForm /> : <LoginForm />}
          </motion.div>
        </motion.div>

        {/* right: image */}
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.1, ease: EASE, delay: 0.4 }}
          className="relative hidden w-full md:block lg:w-1/2"
        >
          <div className="group relative mx-auto aspect-square w-full max-w-[500px]">
            {/* offset amber frame behind the photo */}
            <span
              aria-hidden
              className="absolute inset-0 translate-x-4 translate-y-4 rounded-3xl border border-[#ffb454]/40 transition-transform duration-700 group-hover:translate-x-6 group-hover:translate-y-6"
            />

            <div className="relative h-full w-full overflow-hidden rounded-3xl border border-white/[0.08] bg-[#14130f]">
              <img
                src={image ?? img}
                alt="Students learning"
                className="h-full w-full object-cover opacity-80 saturate-[0.7] transition-all duration-[1200ms] ease-out group-hover:scale-[1.04] group-hover:opacity-100 group-hover:saturate-100"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#100f0d] via-transparent to-transparent" />
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0 opacity-[0.08] mix-blend-overlay"
                style={{ backgroundImage: GRAIN }}
              />

              <span
                className={`absolute bottom-5 left-5 rounded-full border border-[#ffb454]/40 bg-[#100f0d]/70 px-3 py-1 text-[10px] uppercase tracking-[0.2em] text-[#ffb454] backdrop-blur-sm ${mono}`}
              >
                Learn by building real things
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};