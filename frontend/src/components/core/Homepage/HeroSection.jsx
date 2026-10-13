import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import { HiArrowRight, HiPlay } from "react-icons/hi2";
import { useSelector } from "react-redux";

const EASE = [0.23, 1, 0.32, 1];

const display = "font-['Space_Grotesk',ui-sans-serif,system-ui,sans-serif]";
const mono = "font-['JetBrains_Mono',ui-monospace,monospace]";

const GRAIN = `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.8' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>")`;

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.13, delayChildren: 0.1 } },
};
const item = {
  hidden: { opacity: 0, y: 22 },
  show: { opacity: 1, y: 0, transition: { duration: 0.95, ease: EASE } },
};

// Illustrative sample course shown in the visual
const LESSONS = [
  { title: "Hooks that actually click", time: "14 min" },
  { title: "Context without the headache", time: "11 min" },
  { title: "JWT auth, end to end", time: "22 min" },
  { title: "State at scale with Redux", time: "18 min" },
  { title: "Deploy to production", time: "9 min" },
];

const FACTS = [
  ["Structured paths", "Lessons in an order that makes sense"],
  ["Track progress", "Mark lessons done and pick up where you left off"],
  ["Built by instructors", "Courses from people who ship for a living"],
];

/* ------------------------------------------------------------------ */
/*  Learning path visual                                               */
/* ------------------------------------------------------------------ */

const StatusIcon = ({ state }) => {
  if (state === "done") {
    return (
      <motion.span
        initial={{ scale: 0.6, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.6, ease: EASE }}
        className="flex h-6 w-6 items-center justify-center rounded-full bg-[#ffb454]"
      >
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
          <motion.path
            d="M2.5 6.2l2.4 2.4 4.6-5"
            stroke="#1d1a16"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.6, ease: EASE, delay: 0.1 }}
          />
        </svg>
      </motion.span>
    );
  }
  if (state === "active") {
    return (
      <span className="flex h-6 w-6 items-center justify-center rounded-full border border-[#ffb454]/70">
        <motion.span
          animate={{ scale: [1, 1.35, 1], opacity: [1, 0.6, 1] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
          className="h-2 w-2 rounded-full bg-[#ffb454]"
        />
      </span>
    );
  }
  return <span className="h-6 w-6 rounded-full border border-white/15" />;
};

const LearningPath = ({ reduce }) => {
  const total = LESSONS.length;
  const [step, setStep] = useState(reduce ? 3 : 0); // lessons completed

  useEffect(() => {
    if (reduce) return undefined;
    const id = setInterval(() => {
      setStep((s) => (s >= total ? 0 : s + 1));
    }, 2000);
    return () => clearInterval(id);
  }, [reduce, total]);

  const pct = Math.round((step / total) * 100);
  const fill = Math.min(step, total - 1) / (total - 1);

  return (
    <div className="rounded-3xl border border-white/[0.07] bg-white/[0.02] p-7 sm:p-9">
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className={`text-[11px] uppercase tracking-[0.2em] text-zinc-600 ${mono}`}>
            Sample course
          </p>
          <h3
            className={`mt-2 text-xl font-semibold tracking-tight text-[#f3ece0] ${display}`}
          >
            React Auth Mastery
          </h3>
        </div>
        <p className={`text-3xl font-semibold tabular-nums text-[#ffb454] ${display}`}>
          {pct}%
        </p>
      </div>

      <div className="relative mt-8">
        <div className="absolute bottom-6 left-3 top-6 w-px bg-white/10">
          <motion.div
            animate={{ height: `${fill * 100}%` }}
            transition={{ duration: 1.2, ease: EASE }}
            className="w-px bg-[#ffb454]"
          />
        </div>

        <ul className="flex flex-col">
          {LESSONS.map((lesson, i) => {
            const state = i < step ? "done" : i === step ? "active" : "idle";
            return (
              <li key={lesson.title} className="relative flex items-center gap-5 py-3.5">
                <StatusIcon state={state} />
                <div className="flex min-w-0 flex-1 items-baseline justify-between gap-4">
                  <p
                    className={`truncate text-[15px] transition-colors duration-700 ${
                      state === "active"
                        ? "text-[#f3ece0]"
                        : state === "done"
                        ? "text-zinc-500"
                        : "text-zinc-600"
                    }`}
                  >
                    <span className={`mr-3 text-xs text-zinc-700 ${mono}`}>
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    {lesson.title}
                  </p>
                  <span className={`shrink-0 text-xs text-zinc-700 ${mono}`}>
                    {lesson.time}
                  </span>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

/* ------------------------------------------------------------------ */
/*  Signature credit                                                   */
/* ------------------------------------------------------------------ */

const FONT_CSS =
  "@import url('https://fonts.googleapis.com/css2?family=Mrs+Saint+Delafield&display=swap');";
const script =
  "font-['Mrs_Saint_Delafield','Segoe_Script','Brush_Script_MT',cursive]";

const WRITE_DELAY = 1.8;
const WRITE_TIME = 2.8;
const WRITE_EASE = [0.65, 0, 0.35, 1];

const Signature = ({ reduce }) => (
  <div className="pointer-events-none absolute bottom-6 right-6 z-10 select-none text-right sm:bottom-10 sm:right-10">
    <style>{FONT_CSS}</style>

    <motion.p
      initial={reduce ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.2, delay: 1.3 }}
      className={`text-[11px] tracking-wide text-zinc-600 ${mono}`}
    >
      Designed &amp; built by
    </motion.p>

    <div className="relative mt-1 inline-block">
      {/* the name, revealed left to right like it's being written */}
      <motion.span
        initial={reduce ? false : { clipPath: "inset(0 100% 0 0)" }}
        animate={{ clipPath: "inset(0 0% 0 0)" }}
        transition={{ duration: WRITE_TIME, ease: WRITE_EASE, delay: WRITE_DELAY }}
        className={`block -rotate-3 whitespace-nowrap px-1 pb-2 text-6xl leading-none text-[#f3ece0] sm:text-7xl ${script}`}
      >
        Karan Sahu
      </motion.span>

      {/* tiny ink dot that leads the pen */}
      {!reduce && (
        <motion.span
          aria-hidden
          initial={{ left: "0%", opacity: 0 }}
          animate={{ left: ["0%", "100%"], opacity: [0, 1, 1, 0] }}
          transition={{
            duration: WRITE_TIME,
            ease: WRITE_EASE,
            delay: WRITE_DELAY,
            opacity: {
              duration: WRITE_TIME,
              delay: WRITE_DELAY,
              times: [0, 0.06, 0.94, 1],
            },
          }}
          className="absolute top-[52%] h-1.5 w-1.5 -translate-x-1/2 rounded-full bg-[#ffb454]"
        />
      )}

      {/* hand-drawn flourish underneath */}
      <svg
        viewBox="0 0 260 20"
        preserveAspectRatio="none"
        className="-mt-1 block h-4 w-full"
        fill="none"
        aria-hidden
      >
        <motion.path
          d="M4 14 C 52 2, 96 20, 146 10 S 226 4, 256 12"
          stroke="#ffb454"
          strokeWidth="1.6"
          strokeLinecap="round"
          initial={reduce ? false : { pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{
            duration: 1.3,
            ease: EASE,
            delay: WRITE_DELAY + WRITE_TIME + 0.1,
          }}
        />
      </svg>
    </div>

    <motion.p
      initial={reduce ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.2, delay: WRITE_DELAY + WRITE_TIME + 0.6 }}
      className={`mt-1 text-[10px] tracking-[0.2em] text-zinc-700 ${mono}`}
    >
      CODEVOLVEX · 2026
    </motion.p>
  </div>
);

/* ------------------------------------------------------------------ */
/*  Hero                                                               */
/* ------------------------------------------------------------------ */

export default function HeroSection() {
  const { user } = useSelector((state) => state.profile);
  const reduce = useReducedMotion();

  return (
    <section className="relative overflow-hidden bg-[#100f0d] px-5 pb-24 pt-36 sm:px-8 lg:pb-32 lg:pt-44">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.06] mix-blend-overlay"
        style={{ backgroundImage: GRAIN }}
      />

      <div className="relative mx-auto grid max-w-7xl items-center gap-16 lg:grid-cols-[1.1fr_0.9fr] lg:gap-20">
        {/* left: words */}
        <motion.div
          variants={container}
          initial={reduce ? false : "hidden"}
          animate="show"
          className="max-w-2xl"
        >
          <motion.div variants={item} className="flex items-center gap-3">
            <span className="h-px w-8 bg-[#ffb454]" />
            <p className="text-sm text-zinc-500">
              {user?.firstName
                ? `Welcome back, ${user.firstName}`
                : "Video courses for developers"}
            </p>
          </motion.div>

          <motion.h1
            variants={item}
            className={`mt-7 text-5xl font-semibold leading-[1.02] tracking-tight text-[#f3ece0] sm:text-6xl lg:text-[5.25rem] ${display}`}
          >
            Learn by building
            <br />
            <span className="text-[#ffb454]">real</span> things.
          </motion.h1>

          <motion.p
            variants={item}
            className="mt-7 max-w-lg text-lg leading-relaxed text-zinc-400"
          >
            Hands-on courses from working instructors. Go at your own pace,
            ship projects as you learn, and keep your progress wherever you
            left off.
          </motion.p>

          <motion.div
            variants={item}
            className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center"
          >
            {user?.accountType == "Instructor" ? (
              <NavLink to="/dashboard/my-courses">
                <button className="group flex w-full cursor-pointer items-center justify-center gap-2 rounded-full bg-[#ffb454] px-8 py-4 text-sm font-semibold text-[#1d1a16] transition-all duration-500 hover:bg-[#ffc272] active:scale-[0.98] sm:w-auto">
                  Your Courses
                  <HiArrowRight className="h-4 w-4 transition-transform duration-500 group-hover:translate-x-1" />
                </button>
              </NavLink>
            ) : (
              <NavLink to="/catalogue">
                <button className="group flex w-full cursor-pointer items-center justify-center gap-2 rounded-full bg-[#ffb454] px-8 py-4 text-sm font-semibold text-[#1d1a16] transition-all duration-500 hover:bg-[#ffc272] active:scale-[0.98] sm:w-auto">
                  Explore Catalogue
                  <HiArrowRight className="h-4 w-4 transition-transform duration-500 group-hover:translate-x-1" />
                </button>
              </NavLink>
            )}

            <button className="group flex w-full items-center justify-center gap-2.5 rounded-full px-6 py-4 text-sm text-zinc-300 transition-colors duration-500 hover:text-[#ffb454] sm:w-auto">
              <span className="flex h-8 w-8 items-center justify-center rounded-full border border-white/15 transition-colors duration-500 group-hover:border-[#ffb454]/60">
                <HiPlay className="h-3.5 w-3.5 translate-x-px" />
              </span>
              Watch demo
            </button>
          </motion.div>

          <motion.dl
            variants={item}
            className="mt-16 grid grid-cols-1 gap-6 border-t border-white/[0.07] pt-8 sm:grid-cols-3"
          >
            {FACTS.map(([title, text]) => (
              <div key={title}>
                <dt className={`text-[15px] font-medium text-[#f3ece0] ${display}`}>
                  {title}
                </dt>
                <dd className="mt-1.5 text-sm leading-relaxed text-zinc-500">
                  {text}
                </dd>
              </div>
            ))}
          </motion.dl>
        </motion.div>

       
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.1, ease: EASE, delay: 0.4 }}
        >
          <LearningPath reduce={reduce} />
        </motion.div>
      </div>
      <Signature reduce={reduce} />
    </section>
  );
}