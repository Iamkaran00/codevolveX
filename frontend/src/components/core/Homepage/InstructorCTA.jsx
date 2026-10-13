import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  HiArrowRight,
  HiWrenchScrewdriver,
  HiChartBar,
  HiGlobeAlt,
} from "react-icons/hi2";
import { RiMoneyDollarCircleLine } from "react-icons/ri";

const EASE = [0.23, 1, 0.32, 1];

const display = "font-['Space_Grotesk',ui-sans-serif,system-ui,sans-serif]";
const mono = "font-['JetBrains_Mono',ui-monospace,monospace]";

const GRAIN = `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.8' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>")`;

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.05 } },
};
const item = {
  hidden: { opacity: 0, y: 22 },
  show: { opacity: 1, y: 0, transition: { duration: 0.95, ease: EASE } },
};

/* ------------------------------------------------------------------ */
/*  Micro visuals                                                      */
/* ------------------------------------------------------------------ */

const SplitVisual = () => (
  <div>
    <div className="h-2 w-full overflow-hidden rounded-full bg-white/10">
      <motion.div
        initial={{ width: 0 }}
        whileInView={{ width: "70%" }}
        viewport={{ once: true }}
        transition={{ duration: 1.4, ease: EASE, delay: 0.4 }}
        className="h-2 rounded-full bg-[#ffb454]"
      />
    </div>
    <div className={`mt-3 flex justify-between text-[10px] uppercase tracking-[0.18em] ${mono}`}>
      <span className="text-[#ffb454]">You · 70%</span>
      <span className="text-zinc-600">Platform · 30%</span>
    </div>
  </div>
);

const WaveVisual = ({ reduce }) => (
  <div className="flex items-center gap-4">
    <span className="flex items-center gap-2">
      <span className="h-2 w-2 animate-pulse rounded-full bg-[#ffb454]" />
      <span className={`text-[10px] uppercase tracking-[0.18em] text-zinc-500 ${mono}`}>
        Rec
      </span>
    </span>
    <div className="flex h-7 flex-1 items-center gap-[3px]">
      {Array.from({ length: 16 }).map((_, i) => (
        <motion.span
          key={i}
          animate={reduce ? { scaleY: 0.5 } : { scaleY: [0.25, 1, 0.4, 0.8, 0.25] }}
          transition={{
            duration: 1.8 + (i % 4) * 0.25,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 0.08,
          }}
          className="h-full w-[3px] origin-center rounded-full bg-zinc-600 group-hover:bg-[#ffb454]"
          style={{ transition: "background-color 0.5s" }}
        />
      ))}
    </div>
  </div>
);

const ChartVisual = () => (
  <svg viewBox="0 0 160 44" className="h-11 w-full" fill="none" aria-hidden>
    <path
      d="M2 6 C 30 8, 44 10, 62 18 S 100 30, 124 34 S 150 38, 158 40"
      stroke="rgba(255,255,255,0.12)"
      strokeWidth="1.5"
    />
    <motion.path
      d="M2 6 C 30 8, 44 10, 62 18 S 100 30, 124 34 S 150 38, 158 40"
      stroke="#ffb454"
      strokeWidth="1.8"
      strokeLinecap="round"
      initial={{ pathLength: 0 }}
      whileInView={{ pathLength: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 1.8, ease: EASE, delay: 0.5 }}
    />
    <motion.circle
      cx="62"
      cy="18"
      r="3.5"
      fill="#ffb454"
      initial={{ opacity: 0, scale: 0 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: 1.2 }}
    />
  </svg>
);

const ReachVisual = () => (
  <div className="grid grid-cols-8 gap-2">
    {Array.from({ length: 24 }).map((_, i) => {
      const lit = [2, 5, 9, 12, 14, 18, 21].includes(i);
      return (
        <span
          key={i}
          className={`h-1.5 w-1.5 rounded-full ${
            lit ? "bg-[#ffb454]" : "bg-white/15"
          }`}
          style={
            lit
              ? { animation: `ctaPing 2.8s ease-in-out ${i * 0.17}s infinite` }
              : undefined
          }
        />
      );
    })}
  </div>
);

/* ------------------------------------------------------------------ */
/*  Perk card                                                          */
/* ------------------------------------------------------------------ */

const Perk = ({ Icon, title, desc, children }) => (
  <motion.div
    variants={item}
    className="group flex flex-col rounded-2xl border border-white/[0.08] bg-[#100f0d]/70 p-6 transition-all duration-500 hover:-translate-y-1 hover:border-[#ffb454]/40"
  >
    <div className="flex items-center gap-3">
      <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] transition-colors duration-500 group-hover:border-[#ffb454]/40">
        <Icon
          size={18}
          className="text-zinc-500 transition-colors duration-500 group-hover:text-[#ffb454]"
        />
      </span>
      <h3 className={`text-lg font-semibold tracking-tight text-[#f3ece0] ${display}`}>
        {title}
      </h3>
    </div>
    <p className="mt-3 text-sm leading-relaxed text-zinc-500">{desc}</p>
    <div className="mt-auto pt-6">{children}</div>
  </motion.div>
);

/* ------------------------------------------------------------------ */
/*  Section                                                            */
/* ------------------------------------------------------------------ */

export const InstructorCTA = () => {
  const navigate = useNavigate();
  const reduce = useReducedMotion();

  return (
    <section className="relative overflow-hidden bg-[#100f0d] px-5 py-24 sm:px-8 sm:py-32">
      <style>{`@keyframes ctaPing{0%,100%{opacity:1;transform:scale(1)}50%{opacity:.35;transform:scale(1.9)}}`}</style>

      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.06] mix-blend-overlay"
        style={{ backgroundImage: GRAIN }}
      />

      <motion.div
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-60px" }}
        className="relative mx-auto grid max-w-7xl items-center gap-14 overflow-hidden rounded-[2rem] border border-white/[0.08] bg-[#14130f] p-8 sm:p-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16 lg:p-16"
      >
        <div
          aria-hidden
          className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full bg-[#ffb454]/[0.07] blur-3xl"
        />

        {/* left: words */}
        <div className="relative">
          <motion.div variants={item} className="flex items-center gap-3">
            <span className="h-px w-8 bg-[#ffb454]" />
            <p className={`text-[11px] uppercase tracking-[0.25em] text-zinc-500 ${mono}`}>
              For instructors
            </p>
          </motion.div>

          <motion.h2
            variants={item}
            className={`mt-6 text-4xl font-semibold leading-[1.04] tracking-tight text-[#f3ece0] sm:text-5xl lg:text-6xl ${display}`}
          >
            Share what
            <br />
            you know<span className="text-[#ffb454]">.</span>
            <br />
            <span className="text-[#ffb454]">Earn</span> doing it.
          </motion.h2>

          <motion.p
            variants={item}
            className="mt-6 max-w-md text-lg leading-relaxed text-zinc-400"
          >
            Join 3,200+ expert instructors on codeVolveX. Set your price, own
            your content, and build a passive income that scales while you
            sleep.
          </motion.p>

          <motion.div variants={item} className="mt-10">
            <button
              onClick={() => navigate("/signup")}
              className="group flex w-full cursor-pointer items-center justify-center gap-2 rounded-full bg-[#ffb454] px-8 py-4 text-sm font-semibold text-[#1d1a16] transition-all duration-500 hover:bg-[#ffc272] active:scale-[0.98] sm:w-auto"
            >
              Become an Instructor
              <HiArrowRight className="h-4 w-4 transition-transform duration-500 group-hover:translate-x-1" />
            </button>
          </motion.div>
        </div>

        {/* right: perks */}
        <div className="relative grid grid-cols-1 gap-5 sm:grid-cols-2">
          <Perk
            Icon={RiMoneyDollarCircleLine}
            title="Keep 70%"
            desc="Industry-leading revenue share on every sale"
          >
            <SplitVisual />
          </Perk>
          <Perk
            Icon={HiWrenchScrewdriver}
            title="Full tools"
            desc="Studio-quality recording guides & upload tools"
          >
            <WaveVisual reduce={reduce} />
          </Perk>
          <Perk
            Icon={HiChartBar}
            title="Analytics"
            desc="Deep insights into student progress & drop-off"
          >
            <ChartVisual />
          </Perk>
          <Perk
            Icon={HiGlobeAlt}
            title="Global reach"
            desc="Market to 120K+ active learners from day one"
          >
            <ReachVisual />
          </Perk>
        </div>
      </motion.div>
    </section>
  );
};