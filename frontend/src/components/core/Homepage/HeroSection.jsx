import React, { useEffect, useState, useRef, memo } from "react";
import { Navigate, NavLink } from "react-router-dom";

import {
  motion,
  AnimatePresence,
  animate,
  useMotionValue,
  useSpring,
  useTransform,
  useInView,
  useAnimation,
} from "framer-motion";

import { HiArrowRight, HiPlay, HiCheck, HiFire, HiAcademicCap } from "react-icons/hi2";
import { SiReact, SiNodedotjs, SiMongodb, SiTailwindcss } from "react-icons/si";
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

const FACTS = [
  ["Structured paths", "Lessons in an order that makes sense"],
  ["Track progress", "Mark lessons done and pick up where you left off"],
  ["Built by instructors", "Courses from people who ship for a living"],
];

const LESSONS = [
  "Project setup & routing",
  "Socket.io real-time events",
  "Auth with JWT",
  "Deploy to production",
];

const PHASES = 8;
const STEP_MS = 1500;

const usePhase = () => {
  const [p, setP] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setP((n) => (n + 1) % PHASES), STEP_MS);
    return () => clearInterval(id);
  }, []);
  return p;
};

const Counter = ({ to }) => {
  const mv = useMotionValue(0);
  const [n, setN] = useState(0);
  useEffect(() => {
    const unsub = mv.on("change", (v) => setN(Math.round(v)));
    const controls = animate(mv, to, { duration: 0.9, ease: EASE });
    return () => {
      unsub();
      controls.stop();
    };
  }, [to, mv]);
  return <>{n}</>;
};

const RING_R = 25;
const RING_C = 2 * Math.PI * RING_R;

const PlayerCard = ({ pct, p }) => {
  const complete = pct === 100;

  return (
    <div className="relative w-[300px] rounded-[28px] border border-white/10 bg-[#14130f] p-3.5 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.95),0_0_0_1px_rgba(255,180,84,0.04)]">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-[28px] opacity-[0.06] mix-blend-overlay"
        style={{ backgroundImage: GRAIN }}
      />

      {/* video area */}
      <div className="relative h-[138px] overflow-hidden rounded-2xl bg-gradient-to-br from-[#2a1d0e] via-[#1b140c] to-[#100f0d]">
        <div
          aria-hidden
          className="absolute inset-0 opacity-[0.15] mix-blend-overlay"
          style={{ backgroundImage: GRAIN }}
        />
        <div
          aria-hidden
          className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-[#ffb454]/25 blur-3xl"
        />

        {/* decorative code bars */}
        <div className="absolute left-4 top-4 flex w-[55%] flex-col gap-2">
          {[0.9, 0.6, 0.75, 0.45, 0.65].map((w, i) => (
            <motion.span
              key={i}
              animate={{ width: [`${w * 60}%`, `${w * 100}%`, `${w * 60}%`] }}
              transition={{ duration: 3 + i * 0.6, repeat: Infinity, ease: "easeInOut", delay: i * 0.2 }}
              className={`block h-[5px] rounded-full ${i % 2 ? "bg-white/15" : "bg-[#ffb454]/50"}`}
              style={{ marginLeft: i === 1 || i === 3 ? 14 : 0 }}
            />
          ))}
        </div>

        {/* play button + progress ring */}
        <div className="absolute bottom-3 right-3 flex h-[58px] w-[58px] items-center justify-center">
          <svg viewBox="0 0 58 58" className="absolute inset-0 -rotate-90">
            <circle cx="29" cy="29" r={RING_R} fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="3" />
            <motion.circle
              cx="29"
              cy="29"
              r={RING_R}
              fill="none"
              stroke="#ffb454"
              strokeWidth="3"
              strokeLinecap="round"
              strokeDasharray={RING_C}
              initial={false}
              animate={{ strokeDashoffset: RING_C * (1 - pct / 100) }}
              transition={{ duration: 0.9, ease: EASE }}
            />
          </svg>
          <AnimatePresence mode="wait" initial={false}>
            {complete ? (
              <motion.span
                key="done"
                initial={{ scale: 0, rotate: -45 }}
                animate={{ scale: 1, rotate: 0 }}
                exit={{ scale: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 14 }}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-[#ffb454] text-[#1d1a16]"
              >
                <HiCheck className="h-5 w-5" />
              </motion.span>
            ) : (
              <motion.span
                key="play"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-[#100f0d]/80 text-[#ffb454]"
              >
                <HiPlay className="h-4 w-4 translate-x-px" />
              </motion.span>
            )}
          </AnimatePresence>
        </div>

        <span
          className={`absolute bottom-3 left-4 rounded-full border border-white/10 bg-black/50 px-2.5 py-1 text-[9px] uppercase tracking-[0.18em] text-zinc-300 ${mono}`}
        >
          48 lessons · 12h
        </span>
      </div>

      {/* title */}
      <div className="relative mt-4 px-1">
        <p className={`text-[17px] font-semibold tracking-tight text-[#f3ece0] ${display}`}>
          Real-time Chat App
        </p>
        <p className={`mt-1 text-[11px] text-zinc-500 ${mono}`}>
          <span className="text-[#ffb454]">★★★★★</span> 4.9 · MERN project
        </p>
      </div>

      {/* lessons */}
      <ul className="relative mt-4 space-y-1.5">
        {LESSONS.map((l, i) => {
          const done = p - 1 > i;
          const active = p === i + 1;
          return (
            <li
              key={l}
              className={`flex items-center gap-3 rounded-xl px-2.5 py-2 transition-colors duration-500 ${
                active ? "bg-[#ffb454]/[0.08]" : "bg-white/[0.025]"
              }`}
            >
              <span className="relative flex h-5 w-5 shrink-0 items-center justify-center">
                <span
                  className={`absolute inset-0 rounded-full border transition-colors duration-500 ${
                    done ? "border-[#ffb454] bg-[#ffb454]" : active ? "border-[#ffb454]/70" : "border-white/15"
                  }`}
                />
                <AnimatePresence>
                  {done && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      transition={{ type: "spring", stiffness: 400, damping: 18 }}
                      className="relative text-[#1d1a16]"
                    >
                      <HiCheck className="h-3 w-3" />
                    </motion.span>
                  )}
                </AnimatePresence>
                {active && (
                  <motion.span
                    animate={{ scale: [1, 1.6], opacity: [0.6, 0] }}
                    transition={{ duration: 1.1, repeat: Infinity }}
                    className="absolute inset-0 rounded-full border border-[#ffb454]"
                  />
                )}
              </span>
              <span
                className={`text-[12px] transition-colors duration-500 ${
                  done ? "text-zinc-500 line-through decoration-white/20" : active ? "text-[#f3ece0]" : "text-zinc-400"
                }`}
              >
                {l}
              </span>
              <span className={`ml-auto text-[9px] text-zinc-600 ${mono}`}>0{i + 1}</span>
            </li>
          );
        })}
      </ul>

      {/* progress */}
      <div className="relative mt-4 px-1">
        <div className={`flex justify-between text-[10px] uppercase tracking-[0.18em] text-zinc-500 ${mono}`}>
          <span>Progress</span>
          <span className="text-[#ffb454]">
            <Counter to={pct} />%
          </span>
        </div>
        <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-white/10">
          <motion.div
            initial={false}
            animate={{ width: `${pct}%` }}
            transition={{ duration: 0.9, ease: EASE }}
            className="h-full rounded-full bg-gradient-to-r from-[#ff8a3d] to-[#ffb454]"
          />
        </div>
      </div>
    </div>
  );
};

/* ------------------------------------------------------------------ */
/*  ORBIT (smooth version: GPU-friendly CSS transform animations)      */
/* ------------------------------------------------------------------ */

const ORBIT_SECONDS = 48;

const ORBIT_CSS = `
@keyframes orbit-cw  { to { transform: rotate(360deg); } }
@keyframes orbit-ccw { to { transform: rotate(-360deg); } }
@keyframes float-a { 0%,100% { transform: translate3d(0,0,0); } 50% { transform: translate3d(0,-8px,0); } }
@keyframes float-b { 0%,100% { transform: translate3d(0,0,0); } 50% { transform: translate3d(0,7px,0); } }
@keyframes float-c { 0%,100% { transform: translate3d(0,0,0); } 50% { transform: translate3d(0,-6px,0); } }
@keyframes glow-pulse { 0%,100% { opacity: .08; } 50% { opacity: .2; } }
`;

const OrbitChip = ({ Icon, label, angle, duration, color }) => {
  const R = 240;
  const rad = (angle * Math.PI) / 180;
  return (
    <div
      className="absolute"
      style={{
        left: R + Math.cos(rad) * R,
        top: R + Math.sin(rad) * R,
        transform: "translate(-50%, -50%)",
      }}
    >
      {/* same duration as the ring, so the chip stays perfectly upright */}
      <div
        className="orbit-anim flex items-center gap-2 rounded-full border border-white/10 bg-[#14130f] py-1.5 pl-2 pr-3.5 shadow-[0_12px_30px_-8px_rgba(0,0,0,0.8)]"
        style={{ animation: `orbit-ccw ${duration}s linear infinite`, willChange: "transform" }}
      >
        <span
          className="flex h-6 w-6 items-center justify-center rounded-full"
          style={{ backgroundColor: `${color}22`, color }}
        >
          <Icon className="h-3.5 w-3.5" />
        </span>
        <span className={`text-[10px] uppercase tracking-[0.14em] text-zinc-300 ${mono}`}>{label}</span>
      </div>
    </div>
  );
};

// memoized: phase updates every 1.5s no longer touch the rings/chips
const OrbitRings = memo(() => (
  <div className="absolute inset-0">
    <div className="absolute left-1/2 top-1/2 h-[370px] w-[370px] -translate-x-1/2 -translate-y-1/2">
      <div
        aria-hidden
        className="orbit-anim h-full w-full rounded-full border border-white/[0.06]"
        style={{ animation: "orbit-ccw 70s linear infinite", willChange: "transform" }}
      >
        <span className="absolute left-1/2 top-0 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#ffb454] shadow-[0_0_14px_3px_rgba(255,180,84,0.6)]" />
      </div>
    </div>

    <div className="absolute left-1/2 top-1/2 h-[480px] w-[480px] -translate-x-1/2 -translate-y-1/2">
      <div
        className="orbit-anim relative h-full w-full"
        style={{ animation: `orbit-cw ${ORBIT_SECONDS}s linear infinite`, willChange: "transform" }}
      >
        <div className="absolute inset-0 rounded-full border border-dashed border-white/[0.12]" />
        <OrbitChip Icon={SiReact} label="React" angle={-90} duration={ORBIT_SECONDS} color="#61dafb" />
        <OrbitChip Icon={SiNodedotjs} label="Node" angle={0} duration={ORBIT_SECONDS} color="#8cc84b" />
        <OrbitChip Icon={SiMongodb} label="Mongo" angle={90} duration={ORBIT_SECONDS} color="#4db33d" />
        <OrbitChip Icon={SiTailwindcss} label="Tailwind" angle={180} duration={ORBIT_SECONDS} color="#38bdf8" />
      </div>
    </div>
  </div>
));

const LearningOrbit = () => {
  const p = usePhase();
  const pct = Math.min(100, Math.max(0, (p - 1) * 25));
  const complete = pct === 100;

  // gentle 3D tilt that follows the pointer
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rotateX = useSpring(useTransform(my, [-0.5, 0.5], [5, -5]), { stiffness: 80, damping: 20, mass: 0.6 });
  const rotateY = useSpring(useTransform(mx, [-0.5, 0.5], [-7, 7]), { stiffness: 80, damping: 20, mass: 0.6 });

  const onMove = (e) => {
    const r = e.currentTarget.getBoundingClientRect();
    mx.set((e.clientX - r.left) / r.width - 0.5);
    my.set((e.clientY - r.top) / r.height - 0.5);
  };
  const onLeave = () => {
    mx.set(0);
    my.set(0);
  };

  return (
    <div
      className="relative mx-auto h-[400px] w-full max-w-[540px] sm:h-[540px]"
      onMouseMove={onMove}
      onMouseLeave={onLeave}
    >
      <style>{ORBIT_CSS}</style>

      <div
        className="absolute left-1/2 top-0 h-[540px] w-[540px] origin-top -translate-x-1/2 scale-[0.72] sm:scale-100"
        style={{ perspective: 1200 }}
      >
        <motion.div style={{ rotateX, rotateY, willChange: "transform" }} className="relative h-full w-full">
          {/* ambient glow: soft gradient + opacity only (no blur filter) */}
          <div className="pointer-events-none absolute left-1/2 top-1/2 h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2">
            <div
              aria-hidden
              className="orbit-anim h-full w-full rounded-full"
              style={{
                background: "radial-gradient(circle, rgba(255,180,84,1) 0%, rgba(255,180,84,0) 65%)",
                animation: "glow-pulse 6s ease-in-out infinite",
              }}
            />
          </div>

          {/* dotted grid */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0"
            style={{
              backgroundImage: "radial-gradient(rgba(255,255,255,0.09) 1px, transparent 1px)",
              backgroundSize: "22px 22px",
              maskImage: "radial-gradient(circle at center, black 20%, transparent 68%)",
              WebkitMaskImage: "radial-gradient(circle at center, black 20%, transparent 68%)",
            }}
          />

          <OrbitRings />

          {/* player card (wrapper centers, inner floats) */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            <div className="orbit-anim" style={{ animation: "float-a 7s ease-in-out infinite", willChange: "transform" }}>
              <PlayerCard pct={pct} p={p} />
            </div>
          </div>

          {/* streak badge */}
          <div className="absolute left-0 top-[68px]">
            <div className="orbit-anim" style={{ animation: "float-b 5.5s ease-in-out infinite", willChange: "transform" }}>
              <div className="flex items-center gap-2.5 rounded-2xl border border-white/10 bg-[#14130f] px-3.5 py-2.5 shadow-[0_20px_40px_-10px_rgba(0,0,0,0.9)]">
                <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#ff8a3d]/15 text-[#ff8a3d]">
                  <HiFire className="h-4 w-4" />
                </span>
                <div>
                  <p className={`text-[13px] font-semibold leading-none text-[#f3ece0] ${display}`}>12 day streak</p>
                  <p className={`mt-1 text-[9px] uppercase tracking-[0.16em] text-zinc-600 ${mono}`}>keep going</p>
                </div>
              </div>
            </div>
          </div>

          {/* certificate badge */}
          <div className="absolute bottom-[56px] right-0">
            <div className="orbit-anim" style={{ animation: "float-c 6.5s ease-in-out infinite", willChange: "transform" }}>
              <motion.div
                initial={false}
                animate={{
                  scale: complete ? 1 : 0.94,
                  opacity: complete ? 1 : 0.55,
                  borderColor: complete ? "rgba(255,180,84,0.55)" : "rgba(255,255,255,0.1)",
                }}
                transition={{ type: "spring", stiffness: 220, damping: 16 }}
                className="flex items-center gap-2.5 rounded-2xl border bg-[#14130f] px-3.5 py-2.5 shadow-[0_20px_40px_-10px_rgba(0,0,0,0.9)]"
              >
                <span
                  className={`flex h-8 w-8 items-center justify-center rounded-xl transition-colors duration-500 ${
                    complete ? "bg-[#ffb454] text-[#1d1a16]" : "bg-white/[0.06] text-zinc-500"
                  }`}
                >
                  <HiAcademicCap className="h-4 w-4" />
                </span>
                <div>
                  <p className={`text-[13px] font-semibold leading-none text-[#f3ece0] ${display}`}>
                    {complete ? "Certificate unlocked" : "Certificate"}
                  </p>
                  <p className={`mt-1 text-[9px] uppercase tracking-[0.16em] text-zinc-600 ${mono}`}>
                    {complete ? "share it" : `${4 - Math.floor(pct / 25)} lessons to go`}
                  </p>
                </div>
              </motion.div>
            </div>
          </div>

          {/* confetti burst on completion */}
          <AnimatePresence>
            {p === 5 &&
              Array.from({ length: 14 }, (_, i) => {
                const a = (i / 14) * Math.PI * 2;
                return (
                  <motion.span
                    key={i}
                    aria-hidden
                    initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
                    animate={{
                      x: Math.cos(a) * (150 + (i % 3) * 30),
                      y: Math.sin(a) * (130 + (i % 3) * 24),
                      opacity: 0,
                      scale: 0.3,
                    }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1.2, ease: "easeOut" }}
                    className="pointer-events-none absolute left-1/2 top-1/2 h-1.5 w-1.5 rounded-full bg-[#ffb454]"
                  />
                );
              })}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
};
 

const FONT_CSS =
  "@import url('https://fonts.googleapis.com/css2?family=Mrs+Saint+Delafield&display=swap');";
const script =
  "font-['Mrs_Saint_Delafield','Segoe_Script','Brush_Script_MT',cursive]";

const WRITE_EASE = [0.65, 0, 0.35, 1];

const Signature = () => {
  const signatureRef = useRef(null);

  // Trigger when the signature enters the viewport.
  const inView = useInView(signatureRef, {
    amount: 0.5,
    once: false,
  });

  const controls = useAnimation();

  useEffect(() => {
    if (inView) {
      controls.start("visible");
    } else {
      controls.start("hidden");
    }
  }, [inView, controls]);

  const nameVariants = {
    hidden: {
      opacity: 0,
      clipPath: "inset(0 100% 0 0)",
    },
    visible: {
      opacity: 1,
      clipPath: "inset(0 0% 0 0)",
      transition: {
        duration: 2.8,
        ease: WRITE_EASE,
        delay: 0.3,
      },
    },
  };

  const underlineVariants = {
    hidden: {
      pathLength: 0,
      opacity: 0,
    },
    visible: {
      pathLength: 1,
      opacity: 1,
      transition: {
        duration: 1.2,
        ease: EASE,
        delay: 3.0,
      },
    },
  };

  const creditVariants = {
    hidden: {
      opacity: 0,
      y: 8,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.7,
        delay: 4.0,
      },
    },
  };

  return (
    <div
      ref={signatureRef}
      className="pointer-events-none absolute bottom-6 right-6 z-10 select-none text-right sm:bottom-10 sm:right-10"
    >
      <style>{FONT_CSS}</style>

      {/* Intro text */}
      <motion.p
        initial="hidden"
        animate={controls}
        variants={{
          hidden: { opacity: 0, y: 6 },
          visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.6 },
          },
        }}
        className={`text-[11px] tracking-wide text-zinc-600 ${mono}`}
      >
        Designed &amp; built by
      </motion.p>

      <div className="relative mt-1 inline-block">
     
        <motion.span
          initial="hidden"
          animate={controls}
          variants={nameVariants}
          className={`block -rotate-3 whitespace-nowrap px-1 pb-2 text-6xl leading-none text-[#f3ece0] sm:text-7xl ${script}`}
        >
          Karan Sahu
        </motion.span>

       
        <motion.span
          aria-hidden="true"
          initial={{ left: "0%", opacity: 0 }}
          animate={
            inView
              ? {
                  left: ["0%", "100%"],
                  opacity: [0, 1, 1, 0],
                }
              : { opacity: 0 }
          }
          transition={{
            left: {
              duration: 2.8,
              ease: WRITE_EASE,
              delay: 0.3,
            },
            opacity: {
              duration: 2.8,
              times: [0, 0.06, 0.94, 1],
              delay: 0.3,
            },
          }}
          className="absolute top-[52%] h-1.5 w-1.5 -translate-x-1/2 rounded-full bg-[#ffb454]"
        />
 
        <svg
          viewBox="0 0 260 20"
          preserveAspectRatio="none"
          className="-mt-1 block h-4 w-full"
          fill="none"
          aria-hidden="true"
        >
          <motion.path
            d="M4 14 C52 2 96 20 146 10 S226 4 256 12"
            stroke="#ffb454"
            strokeWidth="1.6"
            strokeLinecap="round"
            initial="hidden"
            animate={controls}
            variants={underlineVariants}
          />
        </svg>
      </div>

      <motion.p
        initial="hidden"
        animate={controls}
        variants={creditVariants}
        className={`mt-1 text-[10px] tracking-[0.2em] text-zinc-700 ${mono}`}
      >
        codevolve <span className="text-amber-400">X</span> · 2026
      </motion.p>
    </div>
  );
}; 
export default function HeroSection() {
  const { user } = useSelector((state) => state.profile);

  return (
    <section className="relative overflow-hidden bg-[#100f0d] px-5 pb-48 pt-36 sm:px-8 lg:pb-44 lg:pt-44">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.06] mix-blend-overlay"
        style={{ backgroundImage: GRAIN }}
      />

      <div className="relative mx-auto grid max-w-7xl items-center gap-16 lg:grid-cols-[1.1fr_0.9fr] lg:gap-20">
        {/* left: words */}
        <motion.div variants={container} initial="hidden" animate="show" className="max-w-2xl">
          <motion.div variants={item} className="flex items-center gap-3">
            <span className="h-px w-8 bg-[#ffb454]" />
            <p className="text-sm text-zinc-500">
              {user?.firstName ? `Welcome back, ${user.firstName}` : "Video courses for developers"}
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

          <motion.p variants={item} className="mt-7 max-w-lg text-lg leading-relaxed text-zinc-400">
            Hands-on courses from working instructors. Go at your own pace, ship projects as you
            learn, and keep your progress wherever you left off.
          </motion.p>

          <motion.div variants={item} className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center">
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
     {user ? (
  <NavLink
    to={
      user.accountType === "Student"
        ? "/dashboard/enrolled-courses"
        : "/dashboard/instructor"
    }
    className="group flex w-full items-center justify-center gap-2.5 rounded-full px-6 py-4 text-sm text-zinc-300 transition-colors duration-500 hover:text-[#ffb454] sm:w-auto"
  >
    <span className="flex h-8 w-8 items-center justify-center rounded-full border border-white/15 transition-colors duration-500 group-hover:border-[#ffb454]/60">
      <HiArrowRight className="h-3.5 w-3.5" />
    </span>
    Dashboard
  </NavLink>
) : (
  <button className="group flex w-full items-center justify-center gap-2.5 rounded-full px-6 py-4 text-sm text-zinc-300 transition-colors duration-500 hover:text-[#ffb454] sm:w-auto">
    <span className="flex h-8 w-8 items-center justify-center rounded-full border border-white/15 transition-colors duration-500 group-hover:border-[#ffb454]/60">
      <HiPlay className="h-3.5 w-3.5 translate-x-px" />
    </span>
    Watch demo
  </button>
)}
          </motion.div>

          <motion.dl
            variants={item}
            className="mt-16 grid grid-cols-1 gap-6 border-t border-white/[0.07] pt-8 sm:grid-cols-3"
          >
            {FACTS.map(([title, text]) => (
              <div key={title}>
                <dt className={`text-[15px] font-medium text-[#f3ece0] ${display}`}>{title}</dt>
                <dd className="mt-1.5 text-sm leading-relaxed text-zinc-500">{text}</dd>
              </div>
            ))}
          </motion.dl>
        </motion.div>

        {/* right: orbit (moved up) */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.1, ease: EASE, delay: 0.4 }}
          className="px-2 -mt-4 lg:-mt-28"
        >
          <LearningOrbit />
        </motion.div>
      </div>

      <Signature />
    </section>
  );
}