import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { HiLockClosed, HiBookOpen } from "react-icons/hi2";

const EASE = [0.23, 1, 0.32, 1];

const display = "font-['Space_Grotesk',ui-sans-serif,system-ui,sans-serif]";
const mono = "font-['JetBrains_Mono',ui-monospace,monospace]";

const GRAIN = `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.8' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>")`;

const listV = { hidden: {}, show: { transition: { staggerChildren: 0.08, delayChildren: 0.2 } } };
const rowV = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.85, ease: EASE } },
};

const pad = (n) => String(n).padStart(2, "0");

const lecturesIn = (s) => s.subSection?.length ?? s.SubSection?.length ?? 0;

export default function CourseAccordion({ course }) {
  const reduce = useReducedMotion();

  const sections = course?.courseContent ?? [];
  const totalLectures = sections.reduce((sum, s) => sum + lecturesIn(s), 0);

  if (!sections.length) return null;

  return (
    <motion.section
      initial={reduce ? false : { opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 1, ease: EASE }}
      className="relative mx-auto w-full max-w-3xl overflow-hidden rounded-3xl border border-white/[0.08] bg-[#14130f] p-7 sm:p-10"
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
        className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-[#ffb454] opacity-[0.08] blur-3xl"
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
                Curriculum · the full route
              </p>
            </div>
            <h2
              className={`mt-5 text-3xl font-semibold leading-[1.05] tracking-tight text-[#f3ece0] sm:text-4xl ${display}`}
            >
              Course
              <br />
              curriculum<span className="text-[#ffb454]">.</span>
            </h2>
          </div>

          <dl className="flex gap-6 text-right sm:gap-8">
            <div>
              <dd className={`text-3xl font-semibold tabular-nums text-[#ffb454] sm:text-4xl ${display}`}>
                {pad(sections.length)}
              </dd>
              <dt className={`mt-1 text-[11px] uppercase tracking-[0.2em] text-zinc-600 ${mono}`}>
                Sections
              </dt>
            </div>
            <div>
              <dd className={`text-3xl font-semibold tabular-nums text-[#f3ece0] sm:text-4xl ${display}`}>
                {pad(totalLectures)}
              </dd>
              <dt className={`mt-1 text-[11px] uppercase tracking-[0.2em] text-zinc-600 ${mono}`}>
                Lectures
              </dt>
            </div>
          </dl>
        </div>

        {/* route */}
        <div className="relative mt-10 border-t border-white/[0.07] pt-8">
          {/* spine that draws down the list */}
          <motion.span
            aria-hidden
            initial={reduce ? false : { scaleY: 0 }}
            whileInView={{ scaleY: 1 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 1.6, ease: EASE, delay: 0.2 }}
            style={{ originY: 0 }}
            className="absolute bottom-6 left-[11px] top-12 w-px bg-gradient-to-b from-[#ffb454] via-[#ffb454]/30 to-white/10"
          />

          <motion.ul
            variants={listV}
            initial={reduce ? false : "hidden"}
            whileInView="show"
            viewport={{ once: true, margin: "-60px" }}
            className="flex flex-col gap-3"
          >
            {sections.map((section, i) => {
              const count = lecturesIn(section);
              return (
                <motion.li
                  key={section._id ?? i}
                  variants={rowV}
                  className="group relative flex items-center gap-5"
                >
                  {/* node on the spine */}
                  <span className="relative z-10 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-white/15 bg-[#14130f] transition-colors duration-500 group-hover:border-[#ffb454]">
                    <span className="h-1.5 w-1.5 rounded-full bg-zinc-600 transition-colors duration-500 group-hover:bg-[#ffb454]" />
                  </span>

                  <div className="flex min-w-0 flex-1 flex-col justify-between gap-3 rounded-2xl border border-white/[0.07] bg-white/[0.02] px-5 py-4 transition-all duration-500 group-hover:border-[#ffb454]/40 group-hover:bg-[#ffb454]/[0.04] sm:flex-row sm:items-center">
                    <p className="flex min-w-0 items-baseline gap-3 text-[15px] text-zinc-300 transition-colors duration-500 group-hover:text-[#f3ece0]">
                      <span className={`shrink-0 text-xs text-zinc-700 transition-colors duration-500 group-hover:text-[#ffb454] ${mono}`}>
                        {pad(i + 1)}
                      </span>
                      <span className="truncate">{section.sectionName}</span>
                    </p>

                    <div className="flex shrink-0 items-center gap-3">
                      <span
                        className={`inline-flex items-center gap-1.5 text-[11px] uppercase tracking-[0.15em] text-zinc-500 ${mono}`}
                      >
                        <HiBookOpen className="h-3.5 w-3.5" />
                        {count} {count === 1 ? "lesson" : "lessons"}
                      </span>
                      <span className="flex h-8 w-8 items-center justify-center rounded-full border border-white/15 text-zinc-500 transition-all duration-500 group-hover:border-[#ffb454] group-hover:bg-[#ffb454] group-hover:text-[#1d1a16]">
                        <HiLockClosed className="h-3.5 w-3.5" />
                      </span>
                    </div>
                  </div>
                </motion.li>
              );
            })}
          </motion.ul>
        </div>

        {/* unlock banner */}
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, ease: EASE, delay: 0.3 }}
          className="mt-8 flex items-center justify-center gap-3 rounded-2xl border border-dashed border-[#ffb454]/30 px-6 py-5"
        >
          <HiLockClosed className="h-4 w-4 text-[#ffb454]" />
          <p className={`text-[12px] uppercase tracking-[0.2em] text-zinc-400 ${mono}`}>
            Enroll to unlock the full curriculum
          </p>
        </motion.div>
      </div>
    </motion.section>
  );
}