import React, { useMemo, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { HiArrowPath, HiRocketLaunch } from "react-icons/hi2";

const EASE = [0.23, 1, 0.32, 1];

const display = "font-['Space_Grotesk',ui-sans-serif,system-ui,sans-serif]";
const mono = "font-['JetBrains_Mono',ui-monospace,monospace]";

const GRAIN = `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.8' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>")`;

const listV = { hidden: {}, show: { transition: { staggerChildren: 0.08, delayChildren: 0.15 } } };
const rowV = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: EASE } },
};

const pad = (n) => String(n).padStart(2, "0");

/* ------------------------------------------------------------------ */
/*  Checkbox with a hand-drawn tick                                    */
/* ------------------------------------------------------------------ */

const Tick = ({ checked, reduce }) => (
  <span
    className={`relative flex h-7 w-7 shrink-0 items-center justify-center rounded-full border transition-all duration-500 ${
      checked
        ? "border-[#ffb454] bg-[#ffb454]"
        : "border-white/15 group-hover:border-[#ffb454]/60"
    }`}
  >
    <svg width="14" height="14" viewBox="0 0 12 12" fill="none" aria-hidden>
      <motion.path
        d="M2.5 6.2l2.4 2.4 4.6-5"
        stroke="#1d1a16"
        strokeWidth="1.9"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={false}
        animate={{ pathLength: checked ? 1 : 0, opacity: checked ? 1 : 0 }}
        transition={{ duration: reduce ? 0 : 0.5, ease: EASE }}
      />
    </svg>
  </span>
);

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function CourseRequirements({ course }) {
  const reduce = useReducedMotion();
  const instructions = useMemo(() => course?.instructions ?? [], [course]);
  const [done, setDone] = useState(() => new Set());

  if (!instructions.length) return null;

  const total = instructions.length;
  const count = done.size;
  const pct = Math.round((count / total) * 100);
  const allReady = count === total;

  const toggle = (i) =>
    setDone((prev) => {
      const next = new Set(prev);
      next.has(i) ? next.delete(i) : next.add(i);
      return next;
    });

  return (
    <motion.section
      initial={reduce ? false : { opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 1, ease: EASE }}
      className="relative overflow-hidden rounded-3xl border border-white/[0.08] bg-[#14130f] p-7 sm:p-10"
    >
      {/* grain */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.06] mix-blend-overlay"
        style={{ backgroundImage: GRAIN }}
      />

      {/* warm glow that grows as you get ready */}
      <motion.div
        aria-hidden
        animate={{ opacity: 0.08 + (count / total) * 0.22 }}
        transition={{ duration: 1.2, ease: EASE }}
        className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-[#ffb454] blur-3xl"
      />

      <div className="relative">
        {/* header */}
        <div className="flex items-end justify-between gap-6">
          <div>
            <div className="flex items-center gap-3">
              <span className="h-px w-8 bg-[#ffb454]" />
              <p className={`text-[11px] uppercase tracking-[0.25em] text-zinc-500 ${mono}`}>
                Prerequisites · tick as you go
              </p>
            </div>
            <h2
              className={`mt-5 text-3xl font-semibold leading-[1.05] tracking-tight text-[#f3ece0] sm:text-4xl ${display}`}
            >
              Before you
              <br />
              begin<span className="text-[#ffb454]">.</span>
            </h2>
          </div>

          <div className="text-right">
            <p
              className={`text-4xl font-semibold tabular-nums text-[#ffb454] sm:text-5xl ${display}`}
            >
              {pad(count)}
              <span className="text-zinc-700">/{pad(total)}</span>
            </p>
            <p className={`mt-1 text-[11px] uppercase tracking-[0.2em] text-zinc-600 ${mono}`}>
              Ready
            </p>
          </div>
        </div>

        {/* progress line */}
        <div
          className="mt-8 h-px w-full bg-white/10"
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={pct}
          aria-label="Prerequisites ready"
        >
          <motion.div
            animate={{ width: `${pct}%` }}
            transition={{ duration: reduce ? 0 : 0.9, ease: EASE }}
            className="h-px bg-[#ffb454]"
          />
        </div>

        {/* list */}
        <motion.ul
          variants={listV}
          initial={reduce ? false : "hidden"}
          whileInView="show"
          viewport={{ once: true, margin: "-60px" }}
          className="mt-4 flex flex-col"
        >
          {instructions.map((item, i) => {
            const checked = done.has(i);
            return (
              <motion.li key={i} variants={rowV}>
                <button
                  type="button"
                  role="checkbox"
                  aria-checked={checked}
                  onClick={() => toggle(i)}
                  className="group flex w-full cursor-pointer items-center gap-5 rounded-2xl px-3 py-4 text-left outline-none transition-colors duration-500 hover:bg-white/[0.03] focus-visible:bg-white/[0.04] focus-visible:ring-1 focus-visible:ring-[#ffb454]/60"
                >
                  <Tick checked={checked} reduce={reduce} />

                  <span className={`shrink-0 text-xs text-zinc-700 ${mono}`}>{pad(i + 1)}</span>

                  <span
                    className={`flex-1 text-[15px] leading-relaxed transition-all duration-700 ${
                      checked ? "text-zinc-600 line-through decoration-[#ffb454]/50" : "text-zinc-300"
                    }`}
                  >
                    {item}
                  </span>
                </button>
                {i < total - 1 && <div className="mx-3 h-px bg-white/[0.05]" />}
              </motion.li>
            );
          })}
        </motion.ul>

        {/* footer */}
        <div className="mt-6 flex min-h-[44px] items-center justify-between gap-4 border-t border-white/[0.07] pt-6">
          <AnimatePresence mode="wait" initial={false}>
            <motion.p
              key={allReady ? "ready" : "pending"}
              initial={reduce ? false : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduce ? { opacity: 0 } : { opacity: 0, y: -8 }}
              transition={{ duration: 0.5, ease: EASE }}
              className={`flex items-center gap-2.5 text-sm ${
                allReady ? "text-[#ffb454]" : "text-zinc-500"
              }`}
            >
              {allReady ? (
                <>
                  <HiRocketLaunch className="h-4 w-4" />
                  All set. You're good to start.
                </>
              ) : (
                `${total - count} left to check off`
              )}
            </motion.p>
          </AnimatePresence>

          {count > 0 && (
            <button
              type="button"
              onClick={() => setDone(new Set())}
              className={`group inline-flex items-center gap-2 rounded-full border border-white/15 px-4 py-2 text-[11px] uppercase tracking-[0.2em] text-zinc-400 transition-all duration-500 hover:border-[#ffb454]/60 hover:text-[#ffb454] ${mono}`}
            >
              <HiArrowPath className="h-3.5 w-3.5 transition-transform duration-700 group-hover:-rotate-180" />
              Reset
            </button>
          )}
        </div>
      </div>
    </motion.section>
  );
}