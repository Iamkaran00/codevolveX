import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  motion,
  animate,
  useInView,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import { HiArrowRight, HiArrowUpRight } from "react-icons/hi2";
import ContactUsForm from "../components/common/ContactUsform";
import founderimage from "../assets/FounderImage.jpg";

const EASE = [0.23, 1, 0.32, 1];

const display = "font-['Space_Grotesk',ui-sans-serif,system-ui,sans-serif]";
const mono = "font-['JetBrains_Mono',ui-monospace,monospace]";
const script = "font-['Mrs_Saint_Delafield','Segoe_Script','Brush_Script_MT',cursive]";
const FONT_CSS =
  "@import url('https://fonts.googleapis.com/css2?family=Mrs+Saint+Delafield&display=swap');";

const GRAIN = `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.8' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>")`;

const outline = { WebkitTextStroke: "1px rgba(243,236,220,0.3)" };

/* ------------------------------------------------------------------ */
/*  Content                                                            */
/* ------------------------------------------------------------------ */

// PLACEHOLDER figures. Swap these for real numbers before you launch.
const STATS = [
  { value: 5000, suffix: "+", label: "Active learners" },
  { value: 10, suffix: "+", label: "Industry mentors" },
  { value: 200, suffix: "+", label: "Interactive modules" },
  { value: 50, suffix: "+", label: "Verifiable certifications" },
  { value: 1200, suffix: "+", label: "Capstones reviewed" },
  { value: 14, suffix: "", label: "Countries reached" },
];

const HERO_FACTS = [
  ["AI-assisted paths", "Learning routes shaped around your career goal"],
  ["Mentor-reviewed", "Capstones checked by real engineers, not scripts"],
  ["Production-first", "WebSockets, schemas and system design, not theory"],
];

const featuresData = [
  {
    index: "01",
    title: "AI Skill Gap Analysis",
    description:
      "Upload your resume and target job. We automatically curate the exact modules you need to bridge your knowledge gap.",
    wide: true,
  },
  {
    index: "02",
    title: "Interactive Mock Interviews",
    description:
      "Practice live with our AI interviewer. Write code in real-time while receiving dynamic hints.",
    wide: false,
  },
  {
    index: "03",
    title: "Human-Validated Credentials",
    description:
      "Your final capstone isn't graded by a script. Industry experts review your code before you earn your credential.",
    wide: false,
  },
  {
    index: "04",
    title: "Dynamic Auto-Quizzing",
    description:
      "Stop memorising static answers. Our engine generates unique debugging and system-design questions based on your progress.",
    wide: true,
  },
];

const marqueeItems = [
  "System Design",
  "WebSockets",
  "Distributed Systems",
  "LeetCode Patterns",
  "Database Optimisation",
  "Cloud Architecture",
  "API Engineering",
  "ML Pipelines",
];

/* ------------------------------------------------------------------ */
/*  Motion presets                                                     */
/* ------------------------------------------------------------------ */

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.13, delayChildren: 0.1 } },
};
const item = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.95, ease: EASE } },
};

/* ------------------------------------------------------------------ */
/*  Small pieces                                                       */
/* ------------------------------------------------------------------ */

const Grain = ({ opacity = "opacity-[0.06]" }) => (
  <div
    aria-hidden
    className={`pointer-events-none absolute inset-0 mix-blend-overlay ${opacity}`}
    style={{ backgroundImage: GRAIN }}
  />
);

const Eyebrow = ({ children }) => (
  <div className="flex items-center gap-3">
    <span className="h-px w-8 bg-[#ffb454]" />
    <p className={`text-[11px] uppercase tracking-[0.25em] text-zinc-500 ${mono}`}>{children}</p>
  </div>
);

function Counter({ value, suffix = "", reduce }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const [n, setN] = useState(reduce ? value : 0);

  useEffect(() => {
    if (!inView || reduce) return undefined;
    const controls = animate(0, value, {
      duration: 2.2,
      ease: EASE,
      onUpdate: (v) => setN(Math.round(v)),
    });
    return () => controls.stop();
  }, [inView, value, reduce]);

  return (
    <span ref={ref} className="tabular-nums">
      {n.toLocaleString("en-IN")}
      <span className="text-[#ffb454]">{suffix}</span>
    </span>
  );
}

function Marquee({ reduce }) {
  const items = [...marqueeItems, ...marqueeItems];
  return (
    <div className="relative overflow-hidden border-y border-white/[0.07] bg-[#100f0d] py-6">
      <motion.div
        className="flex w-max gap-12 whitespace-nowrap"
        animate={reduce ? undefined : { x: ["0%", "-50%"] }}
        transition={{ duration: 32, repeat: Infinity, ease: "linear" }}
      >
        {items.map((text, i) => (
          <span
            key={i}
            className={`flex items-center gap-12 text-[12px] uppercase tracking-[0.25em] text-zinc-500 ${mono}`}
          >
            {text}
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-[#ffb454]" />
          </span>
        ))}
      </motion.div>
    </div>
  );
}

/* rotating ring of text, with a still arrow in the middle */
const SpinBadge = ({ reduce }) => (
  <div className="relative h-32 w-32 sm:h-36 sm:w-36">
    <motion.div
      animate={reduce ? undefined : { rotate: 360 }}
      transition={{ duration: 22, repeat: Infinity, ease: "linear" }}
      className="absolute inset-0 rounded-full border border-white/10 bg-[#100f0d]"
    >
      <svg viewBox="0 0 100 100" className="h-full w-full" aria-hidden>
        <defs>
          <path id="founder-badge-circle" d="M50,50 m-37,0 a37,37 0 1,1 74,0 a37,37 0 1,1 -74,0" />
        </defs>
        <text
          fill="#ffb454"
          fontSize="7"
          letterSpacing="1.6"
          style={{ fontFamily: "'JetBrains Mono', ui-monospace, monospace" }}
        >
          <textPath href="#founder-badge-circle" textLength="228" lengthAdjust="spacing">
            BUILT BY ONE ENGINEER • CODEVOLVEX •{" "}
          </textPath>
        </text>
      </svg>
    </motion.div>
    <span className="absolute inset-0 m-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#ffb454] text-[#1d1a16]">
      <HiArrowUpRight className="h-5 w-5" />
    </span>
  </div>
);

/* ------------------------------------------------------------------ */
/*  Founder portrait                                                   */
/* ------------------------------------------------------------------ */

const FounderPortrait = ({ reduce }) => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const imgY = useTransform(scrollYProgress, [0, 1], ["-7%", "7%"]);

  return (
    <div ref={ref} className="group relative mx-auto w-full max-w-md lg:sticky lg:top-28">
      <style>{FONT_CSS}</style>

      {/* offset amber arch behind */}
      <span
        aria-hidden
        className="absolute inset-0 translate-x-5 translate-y-5 rounded-t-[999px] rounded-b-[2rem] border border-[#ffb454]/40 transition-transform duration-700 group-hover:translate-x-7 group-hover:translate-y-7"
      />

      {/* the arch */}
      <motion.div
        initial={reduce ? false : { clipPath: "inset(100% 0 0 0)" }}
        whileInView={{ clipPath: "inset(0% 0 0 0)" }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 1.4, ease: EASE }}
        className="relative aspect-[4/5] w-full overflow-hidden rounded-t-[999px] rounded-b-[2rem] border border-white/[0.08] bg-[#14130f]"
      >
        <motion.img
          src={founderimage}
          alt="Karan Sahu, founder of CodevolveX"
          style={reduce ? undefined : { y: imgY }}
          className="absolute inset-0 h-full w-full scale-[1.18] object-cover grayscale-[0.55] contrast-[1.05] transition-[filter] duration-[1200ms] ease-out group-hover:grayscale-0"
        />
        {/* warm duotone wash */}
        <div className="absolute inset-0 bg-[#ffb454] opacity-25 mix-blend-soft-light" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#100f0d] via-transparent to-transparent" />
        <Grain opacity="opacity-[0.1]" />
      </motion.div>

      {/* role chip */}
      <span
        className={`absolute left-6 top-24 rounded-full border border-[#ffb454]/40 bg-[#100f0d]/70 px-3 py-1 text-[10px] uppercase tracking-[0.2em] text-[#ffb454] backdrop-blur-sm ${mono}`}
      >
        Founder
      </span>

      {/* spinning badge */}
      <div className="absolute -bottom-8 -right-4 z-20 sm:-right-8">
        <SpinBadge reduce={reduce} />
      </div>

      {/* handwritten signature */}
      <div className="pointer-events-none absolute -bottom-10 left-2 z-20 select-none sm:-left-4">
        <motion.span
          initial={reduce ? false : { clipPath: "inset(0 100% 0 0)" }}
          whileInView={{ clipPath: "inset(0 0% 0 0)" }}
          viewport={{ once: true }}
          transition={{ duration: 2.4, ease: [0.65, 0, 0.35, 1], delay: 1 }}
          className={`block -rotate-3 whitespace-nowrap px-1 pb-2 text-6xl leading-none text-[#f3ece0] drop-shadow-[0_2px_12px_rgba(0,0,0,0.6)] sm:text-7xl ${script}`}
        >
          Karan Sahu
        </motion.span>
        <p className={`mt-1 text-[10px] tracking-[0.2em] text-zinc-600 ${mono}`}>
          CODEVOLVEX · 2026
        </p>
      </div>
    </div>
  );
};

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

const About = () => {
  const reduce = useReducedMotion();
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "18%"]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <div className="min-h-screen bg-[#100f0d] text-[#f3ece0] selection:bg-[#ffb454]/30">
      {/* ============================ HERO ============================ */}
      <section
        ref={heroRef}
        className="relative overflow-hidden px-5 pb-24 pt-36 sm:px-8 lg:pb-32 lg:pt-44"
      >
        <Grain />
        <div
          aria-hidden
          className="pointer-events-none absolute -left-32 top-20 h-[28rem] w-[28rem] rounded-full bg-[#ffb454] opacity-[0.06] blur-3xl"
        />

        {/* ghost word */}
        <span
          aria-hidden
          className={`pointer-events-none absolute -bottom-6 right-0 select-none text-[9rem] font-semibold leading-none text-transparent sm:text-[16rem] lg:text-[22rem] ${display}`}
          style={{ WebkitTextStroke: "1px rgba(243,236,220,0.07)" }}
        >
          About
        </span>

        <motion.div
          style={reduce ? undefined : { y: heroY, opacity: heroOpacity }}
          className="relative mx-auto max-w-7xl"
        >
          <motion.div
            variants={container}
            initial={reduce ? false : "hidden"}
            animate="show"
            className="max-w-4xl"
          >
            <motion.div variants={item}>
              <Eyebrow>Revolutionising tech education</Eyebrow>
            </motion.div>

            <motion.h1
              variants={item}
              className={`mt-8 text-5xl font-semibold leading-[1] tracking-tight text-[#f3ece0] sm:text-7xl lg:text-[6.5rem] ${display}`}
            >
              Engineered for
              <br />
              <span className="text-[#ffb454]">real-world</span> execution.
            </motion.h1>

            <motion.p
              variants={item}
              className="mt-8 max-w-2xl text-lg leading-relaxed text-zinc-400 sm:text-xl"
            >
              CodevolveX closes the gap between theoretical knowledge and production-ready
              engineering through dynamic, AI-assisted learning paths tailored to your exact career
              goals.
            </motion.p>

            <motion.div
              variants={item}
              className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center"
            >
              <Link
                to="/signup"
                className="group flex w-full items-center justify-center gap-2 rounded-full bg-[#ffb454] px-8 py-4 text-sm font-semibold text-[#1d1a16] transition-all duration-500 hover:bg-[#ffc272] active:scale-[0.98] sm:w-auto"
              >
                Start building now
                <HiArrowRight className="h-4 w-4 transition-transform duration-500 group-hover:translate-x-1" />
              </Link>
              <a
                href="#story"
                className="group flex w-full items-center justify-center gap-2.5 rounded-full border border-white/15 px-8 py-4 text-sm text-zinc-300 transition-all duration-500 hover:border-[#ffb454]/60 hover:bg-[#ffb454]/10 hover:text-[#ffb454] sm:w-auto"
              >
                Read our story
              </a>
            </motion.div>

            <motion.dl
              variants={item}
              className="mt-16 grid grid-cols-1 gap-6 border-t border-white/[0.07] pt-8 sm:grid-cols-3"
            >
              {HERO_FACTS.map(([title, text]) => (
                <div key={title}>
                  <dt className={`text-[15px] font-medium text-[#f3ece0] ${display}`}>{title}</dt>
                  <dd className="mt-1.5 text-sm leading-relaxed text-zinc-500">{text}</dd>
                </div>
              ))}
            </motion.dl>
          </motion.div>
        </motion.div>
      </section>

      <Marquee reduce={reduce} />

      {/* ============================ STATS ============================ */}
      <section className="relative overflow-hidden px-5 py-24 sm:px-8 sm:py-32">
        <Grain />
        <div className="relative mx-auto max-w-7xl">
          <div className="mb-14 flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
            <div>
              <Eyebrow>By the numbers</Eyebrow>
              <h2
                className={`mt-6 text-4xl font-semibold leading-[1.04] tracking-tight sm:text-6xl ${display}`}
              >
                Momentum,
                <br />
                measured<span className="text-[#ffb454]">.</span>
              </h2>
            </div>
          </div>

          <motion.ul
            variants={container}
            initial={reduce ? false : "hidden"}
            whileInView="show"
            viewport={{ once: true, margin: "-80px" }}
            className="grid grid-cols-2 gap-px overflow-hidden rounded-3xl border border-white/[0.08] bg-white/[0.07] lg:grid-cols-3"
          >
            {STATS.map((stat) => (
              <motion.li
                key={stat.label}
                variants={item}
                className="group relative flex flex-col justify-between gap-10 bg-[#14130f] p-7 transition-colors duration-500 hover:bg-[#1a1812] sm:p-10"
              >
                <p
                  className={`text-5xl font-semibold leading-none tracking-tighter text-[#f3ece0] sm:text-6xl lg:text-7xl ${display}`}
                >
                  <Counter value={stat.value} suffix={stat.suffix} reduce={reduce} />
                </p>
                <div className="flex items-center gap-3">
                  <span className="h-px w-6 bg-[#ffb454] transition-all duration-500 group-hover:w-10" />
                  <p className={`text-[11px] uppercase tracking-[0.2em] text-zinc-500 ${mono}`}>
                    {stat.label}
                  </p>
                </div>
              </motion.li>
            ))}
          </motion.ul>
        </div>
      </section>

      {/* ============================ STORY ============================ */}
      <section id="story" className="relative overflow-hidden px-5 py-24 sm:px-8 lg:py-32">
        <Grain />
        <div
          aria-hidden
          className="pointer-events-none absolute -right-32 top-1/3 h-96 w-96 rounded-full bg-[#ffb454] opacity-[0.05] blur-3xl"
        />

        <div className="relative mx-auto grid max-w-7xl items-start gap-24 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
          <FounderPortrait reduce={reduce} />

          <motion.div
            variants={container}
            initial={reduce ? false : "hidden"}
            whileInView="show"
            viewport={{ once: true, margin: "-80px" }}
            className="pt-8 lg:pt-16"
          >
            <motion.div variants={item}>
              <Eyebrow>Our story</Eyebrow>
            </motion.div>

            <motion.h2
              variants={item}
              className={`mt-6 text-4xl font-semibold leading-[1.04] tracking-tight sm:text-6xl ${display}`}
            >
              Built by engineers,
              <br />
              <span className="text-[#ffb454]">for engineers.</span>
            </motion.h2>

            <motion.div
              variants={item}
              className="mt-8 space-y-6 text-lg leading-relaxed text-zinc-400"
            >
              <p>
                CodevolveX was born from a relentless drive to build something fundamentally
                different. Developed entirely by Karan Sahu, the platform's architecture was
                inspired by an obvious disconnect in traditional computer science education.
              </p>
              <p>
                Standard platforms teach generic concepts, but modern engineering roles demand deep
                system execution. Developers get caught in tutorial purgatory—learning theory
                without mastering production tools like WebSockets, optimised database schemas, or
                strict algorithmic workflows.
              </p>
            </motion.div>

            <motion.figure
              variants={item}
              className="relative mt-12 overflow-hidden rounded-3xl border border-white/[0.08] bg-[#14130f] p-8 sm:p-10"
            >
              <Grain />
              <span
                aria-hidden
                className={`pointer-events-none absolute -top-4 right-6 select-none text-[9rem] font-semibold leading-none text-transparent ${display}`}
                style={outline}
              >
                &rdquo;
              </span>
              <span className="absolute bottom-0 left-0 top-0 w-px bg-[#ffb454]" />
              <blockquote
                className={`relative text-xl font-medium leading-snug tracking-tight text-[#f3ece0] sm:text-2xl ${display}`}
              >
                "I envisioned a pipeline that challenges learners to transition from simply writing
                code to architecting highly scalable applications."
              </blockquote>
              <figcaption
                className={`relative mt-6 text-[11px] uppercase tracking-[0.25em] text-[#ffb454] ${mono}`}
              >
                Karan Sahu · Founder
              </figcaption>
            </motion.figure>
          </motion.div>
        </div>
      </section>

      {/* ========================== ADVANTAGE ========================== */}
      <section className="relative overflow-hidden px-5 py-24 sm:px-8 sm:py-32">
        <Grain />
        <div className="relative mx-auto max-w-7xl">
          <div className="mb-14 max-w-2xl">
            <Eyebrow>The CodevolveX advantage</Eyebrow>
            <h2
              className={`mt-6 text-4xl font-semibold leading-[1.04] tracking-tight sm:text-6xl ${display}`}
            >
              Engineered into
              <br />
              how you learn<span className="text-[#ffb454]">.</span>
            </h2>
            <p className="mt-6 text-lg leading-relaxed text-zinc-400">
              Everything you need to land the job, engineered directly into your learning
              environment.
            </p>
          </div>

          <motion.ul
            variants={{ hidden: {}, show: { transition: { staggerChildren: 0.1 } } }}
            initial={reduce ? false : "hidden"}
            whileInView="show"
            viewport={{ once: true, margin: "-80px" }}
            className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3"
          >
            {featuresData.map((f) => (
              <motion.li
                key={f.index}
                variants={item}
                className={`group relative flex min-h-[260px] flex-col justify-between overflow-hidden rounded-3xl border border-white/[0.08] bg-[#14130f] p-8 transition-all duration-500 hover:-translate-y-1 hover:border-[#ffb454]/40 ${
                  f.wide ? "lg:col-span-2" : ""
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <span
                    className={`text-7xl font-semibold leading-none text-transparent transition-all duration-500 group-hover:[-webkit-text-stroke:1px_#ffb454] ${display}`}
                    style={outline}
                  >
                    {f.index}
                  </span>
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/15 text-zinc-400 transition-all duration-500 group-hover:border-[#ffb454] group-hover:bg-[#ffb454] group-hover:text-[#1d1a16]">
                    <HiArrowUpRight size={18} />
                  </span>
                </div>

                <div className="mt-10">
                  <h3
                    className={`text-2xl font-semibold tracking-tight text-[#f3ece0] transition-colors duration-500 group-hover:text-[#ffb454] ${display}`}
                  >
                    {f.title}
                  </h3>
                  <p className="mt-3 max-w-xl leading-relaxed text-zinc-500">{f.description}</p>
                </div>
              </motion.li>
            ))}
          </motion.ul>
        </div>
      </section>

      {/* ============================ CONTACT ============================ */}
      <section className="relative overflow-hidden px-5 pb-28 pt-12 sm:px-8 lg:pb-36">
        <Grain />
        <div
          aria-hidden
          className="pointer-events-none absolute -left-32 bottom-0 h-96 w-96 rounded-full bg-[#ffb454] opacity-[0.05] blur-3xl"
        />

        <div className="relative mx-auto max-w-4xl">
          <div className="mb-12 text-center">
            <div className="flex justify-center">
              <Eyebrow>Contact</Eyebrow>
            </div>
            <h2
              className={`mt-6 text-4xl font-semibold leading-[1.04] tracking-tight sm:text-6xl ${display}`}
            >
              Let's build together<span className="text-[#ffb454]">.</span>
            </h2>
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-zinc-400">
              Have an idea, want to partner, or need support? Drop a message below and our team will
              get back to you immediately.
            </p>
          </div>

          <motion.div
            initial={reduce ? false : { opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 1, ease: EASE }}
            className="relative overflow-hidden rounded-3xl border border-white/[0.08] bg-[#14130f] p-6 sm:p-10"
          >
            <Grain />
            <div className="relative">
              <ContactUsForm />
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default About;