import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { HiArrowUpRight } from "react-icons/hi2";

const EASE = [0.23, 1, 0.32, 1];

const display = "font-['Space_Grotesk',ui-sans-serif,system-ui,sans-serif]";
const mono = "font-['JetBrains_Mono',ui-monospace,monospace]";

const GRAIN = `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.8' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>")`;

const outline = { WebkitTextStroke: "1px rgba(243,236,220,0.35)" };

const gridV = { hidden: {}, show: { transition: { staggerChildren: 0.07, delayChildren: 0.15 } } };
const cardV = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.85, ease: EASE } },
};

const pad = (n) => String(n).padStart(2, "0");

export default function CourseWhatYouLearn({ course }) {
  const reduce = useReducedMotion();

  const points = Array.isArray(course?.whatWillYouLearn)
    ? course.whatWillYouLearn
    : course?.whatWillYouLearn?.split("\n").filter(Boolean) ?? [];

  if (!points.length) return null;

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

      {/* soft amber glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-[#ffb454] opacity-[0.08] blur-3xl"
      />

      <div className="relative">
        {/* header */}
        <div className="flex items-end justify-between gap-6">
          <div>
            <div className="flex items-center gap-3">
              <motion.span
                initial={reduce ? false : { scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.9, ease: EASE, delay: 0.2 }}
                style={{ originX: 0 }}
                className="h-px w-8 bg-[#ffb454]"
              />
              <p className={`text-[11px] uppercase tracking-[0.25em] text-zinc-500 ${mono}`}>
                Outcomes · what you walk away with
              </p>
            </div>
            <h2
              className={`mt-5 text-3xl font-semibold leading-[1.05] tracking-tight text-[#f3ece0] sm:text-4xl ${display}`}
            >
              What you'll
              <br />
              learn<span className="text-[#ffb454]">.</span>
            </h2>
          </div>

          <div className="text-right">
            <p className={`text-4xl font-semibold tabular-nums text-[#ffb454] sm:text-5xl ${display}`}>
              {pad(points.length)}
            </p>
            <p className={`mt-1 text-[11px] uppercase tracking-[0.2em] text-zinc-600 ${mono}`}>
              Key outcomes
            </p>
          </div>
        </div>

        {/* outcomes */}
        <motion.ul
          variants={gridV}
          initial={reduce ? false : "hidden"}
          whileInView="show"
          viewport={{ once: true, margin: "-60px" }}
          className="mt-10 grid grid-cols-1 gap-4 border-t border-white/[0.07] pt-10 sm:grid-cols-2"
        >
          {points.map((point, i) => (
            <motion.li
              key={i}
              variants={cardV}
              className="group relative flex min-h-[132px] flex-col justify-between overflow-hidden rounded-2xl border border-white/[0.07] bg-white/[0.02] p-5 transition-all duration-500 hover:-translate-y-1 hover:border-[#ffb454]/40 hover:bg-[#ffb454]/[0.04]"
            >
              <div className="flex items-start justify-between gap-4">
                <span
                  className={`text-5xl font-semibold leading-none text-transparent transition-all duration-500 group-hover:[-webkit-text-stroke:1px_#ffb454] ${display}`}
                  style={outline}
                >
                  {pad(i + 1)}
                </span>
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-white/15 text-zinc-500 transition-all duration-500 group-hover:border-[#ffb454] group-hover:bg-[#ffb454] group-hover:text-[#1d1a16]">
                  <HiArrowUpRight size={14} />
                </span>
              </div>

              <p className="mt-6 text-[15px] leading-relaxed text-zinc-300 transition-colors duration-500 group-hover:text-[#f3ece0]">
                {point}
              </p>
 
              <span className="absolute bottom-0 left-0 h-px w-full origin-left scale-x-0 bg-[#ffb454] transition-transform duration-700 ease-out group-hover:scale-x-100" />
            </motion.li>
          ))}
        </motion.ul>
      </div>
    </motion.section>
  );
}