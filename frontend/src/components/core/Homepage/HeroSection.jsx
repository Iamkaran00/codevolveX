import React from "react";
import { NavLink } from "react-router-dom";
import { motion } from "framer-motion";
import { HiArrowRight, HiPlay } from "react-icons/hi2";
import { HiFire } from "react-icons/hi";
import { useSelector } from "react-redux";

 

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.23, 1, 0.32, 1] } },
};

const MODULES = [
  { label: "Hooks", state: "done" },
  { label: "Context", state: "done" },
  { label: "Auth", state: "active" },
  { label: "Redux", state: "locked" },
];

const STREAK_DAYS = ["M", "T", "W", "T", "F", "S", "S"];
const STREAK_DONE = [0, 1, 2, 3];
const STREAK_TODAY = 4;

function TerminalPanel() {
  return (
    <div className="relative h-full w-full flex flex-col p-5 bg-ink-950 text-white overflow-hidden rounded-2xl">
      {/* Titlebar */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-white/15" />
          <div className="w-2.5 h-2.5 rounded-full bg-white/15" />
          <div className="w-2.5 h-2.5 rounded-full bg-white/15" />
        </div>
        <span className="font-mono text-[10px] text-white/40 tracking-wide">
          auth.jsx — codevolveX
        </span>
      </div>

      {/* Code block */}
      <div className="font-mono text-[12px] leading-relaxed text-slate-300 mb-6">
        <p><span className="text-indigo-400">const</span> <span className="text-sky-300">useAuth</span> = () <span className="text-indigo-400">=&gt;</span> {"{"}</p>
        <p className="pl-4"><span className="text-indigo-400">const</span> [user] = <span className="text-emerald-300">useState</span>(null)</p>
        <p className="pl-4 text-slate-500">// refresh token on mount</p>
        <p className="pl-4"><span className="text-sky-300">useEffect</span>(() <span className="text-indigo-400">=&gt;</span> {"{"}</p>
        <p className="pl-8 text-slate-500">...</p>
        <p className="pl-4">{"}"}, [])</p>
        <p>{"}"}</p>
      </div>

      <div className="mt-auto bg-white/[0.04] border border-white/10 rounded-xl p-4">
        <div className="flex justify-between items-center mb-2.5">
          <span className="text-[11px] font-semibold text-slate-200 font-body">React Auth Mastery</span>
          <span className="text-[11px] font-mono text-signal-400">72%</span>
        </div>
        <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden mb-3.5">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: "72%" }}
            transition={{ duration: 1.2, delay: 0.6, ease: [0.23, 1, 0.32, 1] }}
            className="h-full bg-indigo-500"
          />
        </div>
        <div className="grid grid-cols-4 gap-1.5">
          {MODULES.map(({ label, state }) => (
            <div key={label} className="flex flex-col items-center gap-1">
              <div
                className={`w-1.5 h-1.5 rounded-full ${
                  state === "done"
                    ? "bg-signal-400"
                    : state === "active"
                    ? "bg-indigo-400"
                    : "bg-white/15"
                }`}
              />
              <span
                className={`text-[8px] font-mono ${
                  state === "done"
                    ? "text-signal-400"
                    : state === "active"
                    ? "text-indigo-300"
                    : "text-white/25"
                }`}
              >
                {label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function HeroSection() {
  const { user } = useSelector((state) => state.profile);

  return (
    <section className="relative overflow-hidden bg-paper-50 px-4 py-20 sm:px-6 lg:px-8 lg:py-28 font-body">
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-[15%] right-[5%] w-[560px] h-[560px] bg-indigo-500/[0.07] rounded-full blur-[110px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-10 items-center">
        <motion.div variants={containerVariants} initial="hidden" animate="show" className="max-w-2xl">
          <motion.div
            variants={itemVariants}
            className="inline-flex items-center gap-2 font-mono text-xs text-slate-500 mb-7 border-b border-slate-200 pb-2"
          >
            <span className="text-signal-500">$</span>
            <span>120,000+ builders learning right now</span>
            <span className="inline-block w-[7px] h-[14px] bg-indigo-600 animate-pulse" />
          </motion.div>

          <motion.h1
            variants={itemVariants}
            className="font-display text-5xl sm:text-6xl lg:text-[4.2rem] font-bold tracking-tight text-ink-950 leading-[1.08]"
          >
            Master the skills
            <br />
            <span className="relative inline-block">
              <span className="relative z-10">industry demands.</span>
              <span className="absolute left-0 bottom-1 h-4 w-full bg-indigo-100 -z-0" />
            </span>
          </motion.h1>

          <motion.p variants={itemVariants} className="mt-6 text-lg leading-8 text-slate-500 max-w-lg">
            Hands-on courses built by industry experts. Learn at your pace, ship
            real projects, and land the role you want — starting today.
          </motion.p>

          <motion.div variants={itemVariants} className="mt-10 flex flex-col sm:flex-row gap-3">
            {user?.accountType === "Instructor" ? (
              <NavLink to="/dashboard/my-courses">
                <button className="flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl bg-ink-950 px-7 py-3.5 text-sm font-semibold text-white transition-all hover:bg-indigo-600 active:scale-[0.98]">
                  Your Courses
                  <HiArrowRight className="h-4 w-4" />
                </button>
              </NavLink>
            ) : (
              <NavLink to="/catalogue">
                <button className="flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl bg-ink-950 px-7 py-3.5 text-sm font-semibold text-white transition-all hover:bg-indigo-600 active:scale-[0.98]">
                  Explore Catalogue
                  <HiArrowRight className="h-4 w-4" />
                </button>
              </NavLink>
            )}

            <button className="flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-7 py-3.5 text-sm font-semibold text-ink-950 transition-all hover:border-slate-300 hover:bg-slate-50 active:scale-[0.98]">
              <HiPlay className="h-4 w-4 text-indigo-600" />
              Watch Demo
            </button>
          </motion.div>

          <motion.div variants={itemVariants} className="mt-14 flex items-center gap-8 border-t border-slate-200 pt-7">
            {[
              ["120K+", "Learners"],
              ["450+", "Courses"],
              ["4.9", "Rating"],
            ].map(([num, label], i) => (
              <div key={i} className="flex flex-col">
                <span className="font-display text-2xl font-bold text-ink-950">{num}</span>
                <span className="text-xs font-mono text-slate-400 uppercase tracking-wider mt-1">{label}</span>
              </div>
            ))}
          </motion.div>
        </motion.div>

        {/* Signature visual: the terminal itself, no bezel, no badge soup */}
        <div className="relative w-full h-[460px] lg:h-[520px] flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1], delay: 0.2 }}
            className="relative w-full max-w-sm"
          >
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              className="relative shadow-2xl shadow-ink-950/20 rounded-2xl aspect-[4/5]"
            >
              <TerminalPanel />
 
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                className="absolute -bottom-8 -left-8 sm:-left-14 z-20"
              >
                <div className="bg-white border border-slate-100 shadow-xl rounded-2xl p-4 w-36">
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="font-display text-2xl font-bold text-ink-950">14</span>
                    <HiFire className="text-orange-500 w-5 h-5" />
                  </div>
                  <p className="text-[10px] font-mono text-slate-400 uppercase tracking-wider mb-3">
                    Day Streak
                  </p>
                  <div className="flex gap-1 justify-between">
                    {STREAK_DAYS.map((d, i) => (
                      <div
                        key={i}
                        className={`w-4 h-4 flex items-center justify-center rounded text-[8px] font-mono font-bold ${
                          i === STREAK_TODAY
                            ? "bg-indigo-600 text-white"
                            : STREAK_DONE.includes(i)
                            ? "bg-indigo-100 text-indigo-600"
                            : "bg-slate-100 text-slate-300"
                        }`}
                      >
                        {d}
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}