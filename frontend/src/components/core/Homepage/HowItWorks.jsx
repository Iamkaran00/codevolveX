import React, { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  HiMagnifyingGlass,
  HiWrenchScrewdriver,
  HiSparkles,
  HiAcademicCap,
  HiCheck,
  HiArrowRight,
} from "react-icons/hi2";

const EASE = [0.23, 1, 0.32, 1];
const INK = "#100f0d";
const CREAM = "#f3ece0";

const display = "font-['Space_Grotesk',ui-sans-serif,system-ui,sans-serif]";
const mono = "font-['JetBrains_Mono',ui-monospace,monospace]";

const STEPS = [
  {
    Icon: HiMagnifyingGlass,
    title: "Choose your learning path",
    desc: "Browse 450+ courses or follow a curated roadmap aligned to your career goal — frontend, backend, ML, or DevOps.",
    bg: "#f3ece0",
  },
  {
    Icon: HiWrenchScrewdriver,
    title: "Learn by building real projects",
    desc: "Every module ends with a hands-on project. Build a portfolio that actually impresses hiring managers.",
    bg: "#ffb454",
  },
  {
    Icon: HiSparkles,
    title: "Get AI-powered feedback",
    desc: "Submit code and receive instant detailed reviews — not just what's wrong, but exactly how to fix it.",
    bg: "#a8c48f",
  },
  {
    Icon: HiAcademicCap,
    title: "Earn your certificate & get hired",
    desc: "Download your verified certificate and connect with 500+ hiring partners actively recruiting from codeVolveX.",
    bg: "#ef8a62",
  },
];

const ROADMAPS = {
  Frontend: ["HTML & CSS", "JavaScript", "React", "Ship it"],
  Backend: ["Node.js", "Databases", "REST APIs", "Deploy"],
  ML: ["Python", "Statistics", "Models", "Ship it"],
  DevOps: ["Linux", "Docker", "CI / CD", "Cloud"],
};

const PROJECTS = ["Responsive landing page", "REST API with auth", "Full-stack capstone"];

/* ───────────── step 1 ───────────── */
const PathPanel = ({ reduce }) => {
  const [goal, setGoal] = useState("Frontend");
  const nodes = ROADMAPS[goal];
  return (
    <div>
      <div className="flex flex-wrap gap-2">
        {Object.keys(ROADMAPS).map((k) => (
          <button
            key={k}
            type="button"
            onClick={() => setGoal(k)}
            className={`rounded-full border-2 border-[#100f0d] px-4 py-1.5 text-sm font-semibold outline-none transition-colors duration-200 ${display} ${
              goal === k ? "bg-[#100f0d] text-[#f3ece0]" : "hover:bg-[#100f0d]/10"
            }`}
          >
            {k}
          </button>
        ))}
      </div>

      <ol className="mt-6 border-t-2 border-[#100f0d]">
        {nodes.map((n, i) => (
          <motion.li
            key={`${goal}-${n}`}
            initial={reduce ? false : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: EASE, delay: reduce ? 0 : i * 0.07 }}
            className="flex items-baseline justify-between border-b-2 border-[#100f0d]/15 py-3.5"
          >
            <span className="flex items-baseline gap-4">
              <span className={`text-xs ${mono}`}>0{i + 1}</span>
              <span className={`text-2xl font-semibold tracking-tight sm:text-3xl ${display}`}>{n}</span>
            </span>
            {i === nodes.length - 1 && (
              <span className={`rounded-full bg-[#100f0d] px-3 py-1 text-xs font-semibold text-[#f3ece0] ${display}`}>
                Goal
              </span>
            )}
          </motion.li>
        ))}
      </ol>
    </div>
  );
};

/* ───────────── step 2 ───────────── */
const BuildPanel = ({ reduce }) => {
  const [done, setDone] = useState([true, false, false]);
  const count = done.filter(Boolean).length;
  const toggle = (i) => setDone((d) => d.map((v, j) => (j === i ? !v : v)));

  return (
    <div>
      <div className="flex items-end justify-between gap-4">
        <div className="flex items-baseline gap-3">
          <span className={`text-6xl font-semibold leading-none tracking-tight ${display}`}>{count}/3</span>
          <span className={`text-xs uppercase tracking-[0.18em] ${mono}`}>shipped</span>
        </div>
        <AnimatePresence>
          {count === 3 && (
            <motion.span
              initial={reduce ? false : { scale: 1.6, opacity: 0, rotate: 0 }}
              animate={{ scale: 1, opacity: 1, rotate: -7 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ type: "spring", stiffness: 300, damping: 16 }}
              className={`rounded-md border-2 border-[#100f0d] px-3 py-1 text-[11px] font-bold uppercase tracking-[0.2em] ${mono}`}
            >
              Portfolio ready
            </motion.span>
          )}
        </AnimatePresence>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-1.5">
        {done.map((d, i) => (
          <span
            key={i}
            className={`h-2 rounded-full border-2 border-[#100f0d] transition-colors duration-300 ${
              d ? "bg-[#100f0d]" : "bg-transparent"
            }`}
          />
        ))}
      </div>

      <ul className="mt-6 space-y-2.5">
        {PROJECTS.map((p, i) => (
          <li key={p}>
            <button
              type="button"
              onClick={() => toggle(i)}
              className="group flex w-full items-center gap-4 rounded-2xl border-2 border-[#100f0d] px-4 py-3.5 text-left outline-none transition-transform duration-200 hover:-translate-y-0.5 active:translate-y-0"
            >
              <span
                className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-md border-2 border-[#100f0d] transition-colors duration-200 ${
                  done[i] ? "bg-[#100f0d] text-[#ffb454]" : "bg-transparent"
                }`}
              >
                {done[i] && <HiCheck size={16} />}
              </span>
              <span
                className={`text-lg font-semibold tracking-tight transition-opacity duration-200 ${display} ${
                  done[i] ? "opacity-100" : "opacity-60"
                }`}
              >
                {p}
              </span>
              <span className={`ml-auto text-[11px] uppercase tracking-widest opacity-60 ${mono}`}>
                {done[i] ? "shipped" : "tap to ship"}
              </span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

/* ───────────── step 3 ───────────── */
const ReviewPanel = ({ reduce }) => {
  const [stage, setStage] = useState(0); // 0 idle · 1 flagged · 2 fixed
  const label = ["Run AI review", "Apply fix", "Reset"][stage];

  const note =
    stage === 1
      ? "Line 2 — the listener is never removed, so it leaks every time this component unmounts."
      : stage === 2
      ? "Fixed. The cleanup function now runs on unmount."
      : "Your code is ready for review.";

  return (
    <div>
      <div className={`rounded-2xl bg-[#100f0d] py-4 text-[13px] leading-[2] text-[#f3ece0] sm:text-sm ${mono}`}>
        <Row n={1}>
          <span className="text-[#ffb454]">useEffect</span>(() =&gt; {"{"}
        </Row>
        <Row n={2} flag={stage === 1}>
          {"  "}window.addEventListener(<span className="text-[#a8c48f]">"resize"</span>, onResize);
        </Row>
        <AnimatePresence initial={false}>
          {stage === 2 && (
            <motion.div
              key="fix"
              initial={reduce ? false : { height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.4, ease: EASE }}
              className="overflow-hidden"
            >
              <Row n={3} good>
                {"  "}return () =&gt; window.removeEventListener(<span>"resize"</span>, onResize);
              </Row>
            </motion.div>
          )}
        </AnimatePresence>
        <Row n={stage === 2 ? 4 : 3}>{"}"}, []);</Row>
      </div>

      <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <AnimatePresence mode="wait" initial={false}>
          <motion.p
            key={stage}
            initial={reduce ? false : { opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="max-w-sm text-[15px] font-medium leading-snug"
          >
            {note}
          </motion.p>
        </AnimatePresence>
        <button
          type="button"
          onClick={() => setStage((s) => (s + 1) % 3)}
          className={`inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-[#100f0d] px-5 py-2.5 text-sm font-semibold text-[#f3ece0] outline-none transition-transform duration-200 hover:scale-[1.04] active:scale-95 ${display}`}
        >
          {label}
          <HiArrowRight size={15} />
        </button>
      </div>
    </div>
  );
};

const Row = ({ n, flag, good, children }) => (
  <div
    className={`flex gap-4 border-l-[3px] px-4 ${
      flag ? "border-[#ef8a62] bg-[#ef8a62]/15" : good ? "border-[#a8c48f] bg-[#a8c48f]/15" : "border-transparent"
    }`}
  >
    <span className="w-4 shrink-0 select-none text-right text-xs text-zinc-600">{n}</span>
    <span className="min-w-0 break-words">{children}</span>
  </div>
);

/* ───────────── step 4 ───────────── */
const CertPanel = ({ reduce }) => {
  const [name, setName] = useState("");
  const [shared, setShared] = useState(false);
  const shown = name.trim();

  return (
    <div>
      <label className="block">
        <span className={`text-[11px] uppercase tracking-[0.18em] ${mono}`}>Try it — type your name</span>
        <input
          value={name}
          maxLength={26}
          onChange={(e) => setName(e.target.value)}
          placeholder="Your name"
          className={`mt-2 w-full border-b-2 border-[#100f0d] bg-transparent pb-2 text-2xl font-semibold tracking-tight outline-none placeholder:text-[#100f0d]/35 ${display}`}
        />
      </label>

      <motion.div
        initial={reduce ? false : { opacity: 0, y: 16, rotate: 0 }}
        animate={{ opacity: 1, y: 0, rotate: -1.5 }}
        transition={{ duration: 0.7, ease: EASE, delay: reduce ? 0 : 0.1 }}
        className="relative mt-6 rounded-xl border-2 border-[#100f0d] bg-[#f3ece0] p-6 shadow-[6px_6px_0_#100f0d]"
      >
        <p className={`text-[10px] uppercase tracking-[0.25em] ${mono}`}>codeVolveX · Certificate of completion</p>
        <p
          className={`mt-5 break-words text-4xl font-semibold leading-none tracking-tight sm:text-5xl ${display} ${
            shown ? "" : "opacity-25"
          }`}
        >
          {shown || "Your name"}
        </p>
        <p className="mt-3 text-sm">has completed the Frontend Developer path.</p>
        <div className={`mt-6 flex items-end justify-between text-[11px] ${mono}`}>
          <span>ID · CVX-2027-0481</span>
          <motion.span
            key={shown ? "on" : "off"}
            initial={reduce ? false : { scale: 1.5, opacity: 0 }}
            animate={{ scale: 1, opacity: shown ? 1 : 0.3 }}
            transition={{ type: "spring", stiffness: 320, damping: 15 }}
            className="flex h-16 w-16 rotate-[-10deg] items-center justify-center rounded-full border-2 border-dashed border-[#100f0d] text-center text-[10px] font-bold uppercase leading-tight"
          >
            Verified
          </motion.span>
        </div>
      </motion.div>

      <div className="mt-6 flex items-center justify-between gap-4">
        <p className="text-sm font-medium">500+ hiring partners are recruiting.</p>
        <button
          type="button"
          onClick={() => setShared((s) => !s)}
          className={`inline-flex items-center gap-2 rounded-full bg-[#100f0d] px-5 py-2.5 text-sm font-semibold text-[#f3ece0] outline-none transition-transform duration-200 hover:scale-[1.04] active:scale-95 ${display}`}
        >
          {shared ? (
            <>
              Shared <HiCheck size={15} />
            </>
          ) : (
            <>
              Share portfolio <HiArrowRight size={15} />
            </>
          )}
        </button>
      </div>
    </div>
  );
};

const PANELS = [PathPanel, BuildPanel, ReviewPanel, CertPanel];

/* ───────────── section ───────────── */
export const HowItWorks = () => {
  const reduce = useReducedMotion();
  const [active, setActive] = useState(0);

  return (
    <section className="bg-[#100f0d] px-5 py-24 sm:px-8 sm:py-32">
      <div className="mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.9, ease: EASE }}
          className="mb-14 flex flex-col justify-between gap-8 lg:flex-row lg:items-end"
        >
          <div>
            <p className={`text-xs uppercase tracking-[0.2em] text-zinc-500 ${mono}`}>How it works (04)</p>
            <h2
              className={`mt-5 text-5xl font-semibold leading-[0.98] tracking-tighter text-[#f3ece0] sm:text-7xl ${display}`}
            >
              Master the stack.
              <br />
              Ship the code<span className="text-[#ffb454]">.</span>
            </h2>
          </div>
          <div className="max-w-md">
            <p className="text-lg leading-relaxed text-zinc-400">
              Four steps from your first lesson to your first interview. Open a card and try it.
            </p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 1, ease: EASE, delay: 0.1 }}
          className="flex flex-col gap-3 lg:h-[600px] lg:flex-row"
        >
          {STEPS.map(({ Icon, title, desc, bg }, i) => {
            const on = i === active;
            const Panel = PANELS[i];
            return (
              <article
                key={title}
                style={{ backgroundColor: bg, color: INK }}
                className={`relative min-w-0 overflow-hidden rounded-[28px] motion-reduce:transition-none lg:transition-[flex] lg:duration-700 lg:ease-[cubic-bezier(0.23,1,0.32,1)] ${
                  on ? "lg:flex-[5]" : "lg:flex-[1]"
                }`}
              >
                {on ? (
                  <motion.div
                    initial={reduce ? false : { opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.4, delay: reduce ? 0 : 0.25 }}
                    className="flex h-full flex-col p-6 lg:w-[500px] lg:p-8 xl:w-[620px] xl:p-10"
                  >
                    <div className="flex items-center justify-between">
                      <span className={`text-xs uppercase tracking-[0.2em] ${mono}`}>
                        Step {String(i + 1).padStart(2, "0")}
                      </span>
                      <span className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-[#100f0d]">
                        <Icon size={18} />
                      </span>
                    </div>

                    <h3 className={`mt-6 text-3xl font-semibold leading-[1.05] tracking-tight sm:text-4xl ${display}`}>
                      {title}
                    </h3>
                    <p className="mt-3 max-w-md text-[15px] leading-relaxed opacity-75">{desc}</p>

                    <div className="mt-8 lg:mt-auto">
                      <Panel reduce={reduce} />
                    </div>
                  </motion.div>
                ) : (
                  <button
                    type="button"
                    onClick={() => setActive(i)}
                    aria-label={`Open step ${i + 1}: ${title}`}
                    className="group flex h-full w-full items-center gap-4 p-5 text-left outline-none focus-visible:ring-2 focus-visible:ring-[#100f0d] lg:flex-col lg:items-start lg:justify-between lg:p-7"
                  >
                    <span className={`text-sm font-semibold ${mono}`}>{String(i + 1).padStart(2, "0")}</span>
                    <span
                      className={`text-xl font-semibold tracking-tight transition-transform duration-300 group-hover:translate-x-1 lg:text-2xl lg:[writing-mode:vertical-rl] lg:rotate-180 lg:group-hover:translate-x-0 lg:group-hover:-translate-y-1 ${display}`}
                    >
                      {title}
                    </span>
                    <Icon size={22} className="ml-auto lg:hidden" />
                  </button>
                )}
              </article>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
};