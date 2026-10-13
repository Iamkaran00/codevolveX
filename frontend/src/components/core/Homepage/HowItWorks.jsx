import React, { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  HiMagnifyingGlass,
  HiWrenchScrewdriver,
  HiSparkles,
  HiAcademicCap,
} from "react-icons/hi2";

const EASE = [0.23, 1, 0.32, 1];
const DURATION = 5200;

const display = "font-['Space_Grotesk',ui-sans-serif,system-ui,sans-serif]";
const mono = "font-['JetBrains_Mono',ui-monospace,monospace]";

const GRAIN = `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.8' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>")`;

const STEPS = [
  {
    Icon: HiMagnifyingGlass,
    title: "Choose your learning path",
    desc: "Browse 450+ courses or follow a curated roadmap aligned to your career goal — frontend, backend, ML, or DevOps.",
    file: "path.js",
    lines: [
      { k: "c", t: "// 01 · pick a direction" },
      { k: "x", t: "const path = await analyzeGoals(student);" },
      { k: "x", t: 'path.roadmap // "HTML & CSS" → "React" → "Ship it"' },
      { k: "o", t: "> path locked: Frontend Developer" },
    ],
  },
  {
    Icon: HiWrenchScrewdriver,
    title: "Learn by building real projects",
    desc: "Every module ends with a hands-on project. Build a portfolio that actually impresses hiring managers.",
    file: "build.js",
    lines: [
      { k: "c", t: "// 02 · every module ships something" },
      { k: "x", t: "for (const module of path.modules) {" },
      { k: "x", t: "  const project = await build(module);" },
      { k: "x", t: "  portfolio.push(project);" },
      { k: "x", t: "}" },
      { k: "o", t: "> projects added to your portfolio" },
    ],
  },
  {
    Icon: HiSparkles,
    title: "Get AI-powered feedback",
    desc: "Submit code and receive instant detailed reviews — not just what's wrong, but exactly how to fix it.",
    file: "review.js",
    lines: [
      { k: "c", t: "// 03 · know what to fix, and how" },
      { k: "x", t: "const review = await requestAiReview(project);" },
      { k: "x", t: "review.fixes.apply();" },
      { k: "o", t: "> review complete · fixes applied" },
    ],
  },
  {
    Icon: HiAcademicCap,
    title: "Earn your certificate & get hired",
    desc: "Download your verified certificate and connect with 500+ hiring partners actively recruiting from codeVolveX.",
    file: "hired.js",
    lines: [
      { k: "c", t: "// 04 · make it official" },
      { k: "x", t: "await certificate.issue(student);" },
      { k: "x", t: 'await portfolio.share("hiring partners");' },
      { k: "o", t: "> certificate verified" },
      { k: "o", t: "> ready for interviews." },
    ],
  },
];

const TOKEN = /(\b(?:const|await|for|of)\b|"[^"]*")/g;

const Code = ({ text }) =>
  text.split(TOKEN).map((part, i) => {
    if (i % 2 === 0) return <span key={i}>{part}</span>;
    const isStr = part.startsWith('"');
    return (
      <span key={i} className={isStr ? "text-[#a8c48f]" : "text-[#ffb454]"}>
        {part}
      </span>
    );
  });

const Line = ({ line, n, i, reduce }) => {
  const color =
    line.k === "c"
      ? "text-zinc-600"
      : line.k === "o"
      ? "text-[#ffb454]"
      : "text-[#f3ece0]";
  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: EASE, delay: reduce ? 0 : 0.15 + i * 0.22 }}
      className="flex gap-5"
    >
      <span className="w-5 shrink-0 select-none text-right text-xs leading-[2] text-zinc-700">
        {n}
      </span>
      <span className={`whitespace-pre-wrap break-words ${color}`}>
        {line.k === "x" ? <Code text={line.t} /> : line.t}
      </span>
    </motion.div>
  );
};

export const HowItWorks = () => {
  const reduce = useReducedMotion();
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  const step = STEPS[active];
  const next = () => setActive((s) => (s + 1) % STEPS.length);

  return (
    <section className="relative overflow-hidden bg-[#100f0d] px-5 py-24 sm:px-8 sm:py-32">
      <style>{`@keyframes hiwFill{from{transform:scaleX(0)}to{transform:scaleX(1)}}@keyframes hiwBlink{0%,100%{opacity:1}50%{opacity:0}}`}</style>

      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.06] mix-blend-overlay"
        style={{ backgroundImage: GRAIN }}
      />

      <div className="relative mx-auto max-w-7xl">
        {/* header */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.95, ease: EASE }}
          className="mb-16 flex flex-col justify-between gap-8 lg:flex-row lg:items-end"
        >
          <div>
            <div className="flex items-center gap-3">
              <span className="h-px w-8 bg-[#ffb454]" />
              <p className={`text-[11px] uppercase tracking-[0.25em] text-zinc-500 ${mono}`}>
                How it works
              </p>
            </div>
            <h2
              className={`mt-6 text-4xl font-semibold leading-[1.04] tracking-tight text-[#f3ece0] sm:text-6xl ${display}`}
            >
              Master the stack.
              <br />
              Ship the code<span className="text-[#ffb454]">.</span>
            </h2>
          </div>
          <p className="max-w-md text-lg leading-relaxed text-zinc-400">
            Four steps from your first lesson to your first interview. Follow
            along, or jump to any step.
          </p>
        </motion.div>

        <div className="grid items-start gap-12 lg:grid-cols-[0.95fr_1.05fr] lg:gap-20">
          {/* left: steps */}
          <motion.ol
            initial={{ opacity: 0, y: 26 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.95, ease: EASE, delay: 0.1 }}
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
            className="flex flex-col border-t border-white/[0.07]"
          >
            {STEPS.map(({ Icon, title, desc }, i) => {
              const on = i === active;
              return (
                <li key={title} className="border-b border-white/[0.07]">
                  <button
                    type="button"
                    onClick={() => setActive(i)}
                    aria-current={on ? "step" : undefined}
                    className="group relative flex w-full cursor-pointer items-start gap-6 py-6 text-left outline-none"
                  >
                    <span
                      className={`w-14 shrink-0 text-4xl font-semibold leading-none transition-colors duration-700 ${display} ${
                        on ? "text-[#ffb454]" : "text-transparent"
                      }`}
                      style={on ? undefined : { WebkitTextStroke: "1px rgba(243,236,220,0.35)" }}
                    >
                      {String(i + 1).padStart(2, "0")}
                    </span>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-4">
                        <h3
                          className={`text-lg font-semibold tracking-tight transition-colors duration-500 ${display} ${
                            on ? "text-[#f3ece0]" : "text-zinc-500 group-hover:text-zinc-300"
                          }`}
                        >
                          {title}
                        </h3>
                        <Icon
                          size={20}
                          className={`shrink-0 transition-colors duration-500 ${
                            on ? "text-[#ffb454]" : "text-zinc-700"
                          }`}
                        />
                      </div>

                      <AnimatePresence initial={false}>
                        {on && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.7, ease: EASE }}
                            className="overflow-hidden"
                          >
                            <p className="mt-3 max-w-md text-[15px] leading-relaxed text-zinc-400">
                              {desc}
                            </p>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    {/* progress line */}
                    {on && (
                      <span className="absolute bottom-[-1px] left-0 h-px w-full bg-white/10">
                        <span
                          key={`${active}-${reduce}`}
                          onAnimationEnd={reduce ? undefined : next}
                          className="block h-px w-full origin-left bg-[#ffb454]"
                          style={{
                            animation: reduce
                              ? "none"
                              : `hiwFill ${DURATION}ms linear forwards`,
                            animationPlayState: paused ? "paused" : "running",
                            transform: reduce ? "scaleX(1)" : undefined,
                          }}
                        />
                      </span>
                    )}
                  </button>
                </li>
              );
            })}
          </motion.ol>

          {/* right: terminal */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 1.1, ease: EASE, delay: 0.25 }}
            className="overflow-hidden rounded-3xl border border-white/[0.07] bg-white/[0.02]"
          >
            <div className="flex items-center justify-between border-b border-white/[0.07] px-6 py-4">
              <div className="flex items-center gap-3">
                <span className="h-1.5 w-1.5 rounded-full bg-[#ffb454]" />
                <AnimatePresence mode="wait">
                  <motion.span
                    key={step.file}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    className={`text-xs text-zinc-400 ${mono}`}
                  >
                    codevolvex / {step.file}
                  </motion.span>
                </AnimatePresence>
              </div>
              <span className={`text-[11px] tracking-[0.2em] text-zinc-600 ${mono}`}>
                {String(active + 1).padStart(2, "0")} / {String(STEPS.length).padStart(2, "0")}
              </span>
            </div>

            <div
              className={`min-h-[320px] px-6 py-8 text-[13px] leading-[2] sm:text-[14px] ${mono}`}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={active}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  {step.lines.map((line, i) => (
                    <Line key={i} line={line} n={i + 1} i={i} reduce={reduce} />
                  ))}
                  <div className="flex gap-5">
                    <span className="w-5 shrink-0" />
                    <span
                      className="mt-2 inline-block h-4 w-2 bg-[#ffb454]"
                      style={{
                        animation: reduce ? "none" : "hiwBlink 1s step-end infinite",
                      }}
                    />
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};