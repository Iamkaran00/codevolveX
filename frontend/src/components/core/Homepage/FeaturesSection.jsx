import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
  HiBolt,
  HiMap,
  HiUsers,
  HiTrophy,
  HiCpuChip,
  HiDevicePhoneMobile,
  HiCheck,
} from "react-icons/hi2";

const EASE = [0.23, 1, 0.32, 1];

const display = "font-['Space_Grotesk',ui-sans-serif,system-ui,sans-serif]";
const mono = "font-['JetBrains_Mono',ui-monospace,monospace]";

const GRAIN = `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.8' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>")`;

const gridV = { hidden: {}, show: { transition: { staggerChildren: 0.09 } } };
const cardV = {
  hidden: { opacity: 0, y: 26 },
  show: { opacity: 1, y: 0, transition: { duration: 0.95, ease: EASE } },
};

/* ------------------------------------------------------------------ */
/*  Mini visuals                                                       */
/* ------------------------------------------------------------------ */

const ProjectsVisual = () => {
  const rows = [
    ["REST API · Auth", "shipped"],
    ["Dashboard UI", "shipped"],
    ["Realtime chat", "building"],
  ];
  return (
    <div className="flex flex-col gap-2.5">
      {rows.map(([name, state], i) => {
        const done = state === "shipped";
        return (
          <div
            key={name}
            style={{ transitionDelay: `${i * 70}ms` }}
            className="flex items-center gap-4 rounded-2xl border border-white/[0.06] bg-[#100f0d]/60 px-4 py-3 transition-transform duration-700 group-hover:translate-x-1.5"
          >
            <span className={`text-xs text-zinc-700 ${mono}`}>
              {String(i + 1).padStart(2, "0")}
            </span>
            <p className="min-w-0 flex-1 truncate text-sm text-zinc-300">{name}</p>
            <span
              className={`flex items-center gap-2 text-[10px] uppercase tracking-[0.18em] ${mono} ${
                done ? "text-[#ffb454]" : "text-zinc-500"
              }`}
            >
              {done ? (
                <HiCheck size={12} />
              ) : (
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#ffb454]" />
              )}
              {state}
            </span>
          </div>
        );
      })}
    </div>
  );
};

const RouteVisual = () => (
  <div>
    <div className="relative flex items-center justify-between">
      <span className="absolute left-[5px] right-[5px] top-1/2 h-px bg-white/10" />
      <span className="absolute left-[5px] top-1/2 h-px w-0 bg-[#ffb454] transition-all duration-[1400ms] ease-out group-hover:w-[calc(100%-10px)]" />
      {[0, 1, 2, 3].map((s) => (
        <span
          key={s}
          style={{ transitionDelay: `${s * 280}ms` }}
          className="relative z-10 h-[11px] w-[11px] rounded-full border border-white/25 bg-[#14130f] transition-all duration-700 group-hover:border-[#ffb454] group-hover:bg-[#ffb454]"
        />
      ))}
    </div>
    <div className={`mt-4 flex justify-between text-[10px] uppercase tracking-[0.18em] text-zinc-600 ${mono}`}>
      <span>Zero</span>
      <span>Job-ready</span>
    </div>
  </div>
);

const MentorVisual = () => (
  <div className="flex flex-col gap-2.5">
    <div className="flex items-center gap-2">
      <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#ffb454]" />
      <span className={`text-[10px] uppercase tracking-[0.18em] text-zinc-500 ${mono}`}>
        Live Q&amp;A
      </span>
    </div>
    <p className="max-w-[88%] rounded-2xl rounded-tl-sm border border-white/[0.06] bg-[#100f0d]/60 px-4 py-2.5 text-[13px] text-zinc-400">
      How do I structure this API?
    </p>
    <p className="ml-auto max-w-[88%] rounded-2xl rounded-tr-sm bg-[#ffb454] px-4 py-2.5 text-[13px] font-medium text-[#1d1a16] transition-transform duration-700 group-hover:-translate-y-0.5">
      Split by resource, then add auth middleware.
    </p>
  </div>
);

const CertVisual = () => (
  <div className="relative rounded-2xl border border-white/10 bg-[#100f0d]/60 p-5">
    <p className={`text-[9px] uppercase tracking-[0.25em] text-zinc-600 ${mono}`}>
      Certificate of completion
    </p>
    <div className="mt-4 h-1.5 w-2/3 rounded-full bg-white/10" />
    <div className="mt-2.5 h-1.5 w-1/2 rounded-full bg-white/[0.06]" />
    <span className="absolute -bottom-4 right-5 flex h-12 w-12 items-center justify-center rounded-full border border-[#ffb454]/60 bg-[#14130f] text-[#ffb454] transition-transform duration-700 group-hover:-rotate-12 group-hover:scale-110">
      <HiCheck size={20} />
    </span>
    <p className={`mt-7 text-[10px] uppercase tracking-[0.2em] text-[#ffb454] ${mono}`}>
      Verified
    </p>
  </div>
);

const DiffVisual = () => (
  <div className={`rounded-2xl border border-white/[0.06] bg-[#100f0d]/60 p-4 text-[12px] leading-[1.9] ${mono}`}>
    <p className="truncate text-[#e0816f]/80">
      <span className="mr-2 select-none">−</span>app.get("/users", handler)
    </p>
    <p className="truncate text-[#a8c48f]">
      <span className="mr-2 select-none">+</span>app.get("/users", auth, handler)
    </p>
    <p className="mt-2 border-t border-white/[0.06] pt-2 text-[11px] text-zinc-500">
      Missing auth middleware on a private route.
    </p>
  </div>
);

const DevicesVisual = ({ reduce }) => (
  <div className="flex items-center justify-center gap-4">
    <div className="w-40 rounded-xl border border-white/10 bg-[#100f0d]/60 p-3">
      <div className="h-1.5 w-full rounded-full bg-white/10">
        <div className="h-1.5 w-3/5 rounded-full bg-[#ffb454]" />
      </div>
      <div className="mt-3 h-1.5 w-4/5 rounded-full bg-white/[0.06]" />
      <div className="mt-2 h-1.5 w-2/5 rounded-full bg-white/[0.06]" />
    </div>

    <div className="relative h-px w-16 bg-[repeating-linear-gradient(90deg,rgba(255,255,255,0.2)_0_4px,transparent_4px_8px)] sm:w-24">
      <motion.span
        aria-hidden
        animate={reduce ? { left: "50%" } : { left: ["0%", "100%", "0%"] }}
        transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-1/2 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#ffb454]"
      />
    </div>

    <div className="w-16 rounded-xl border border-white/10 bg-[#100f0d]/60 p-2.5">
      <div className="h-1.5 w-full rounded-full bg-white/10">
        <div className="h-1.5 w-3/5 rounded-full bg-[#ffb454]" />
      </div>
      <div className="mt-2.5 h-1.5 w-4/5 rounded-full bg-white/[0.06]" />
      <div className="mt-2 h-1.5 w-2/5 rounded-full bg-white/[0.06]" />
      <div className="mt-3 h-6 rounded-md bg-white/[0.04]" />
    </div>
  </div>
);

/* ------------------------------------------------------------------ */
/*  Card with cursor spotlight                                         */
/* ------------------------------------------------------------------ */

const Card = ({ span, index, Icon, title, desc, children, wide }) => {
  const onMove = (e) => {
    const r = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty("--x", `${e.clientX - r.left}px`);
    e.currentTarget.style.setProperty("--y", `${e.clientY - r.top}px`);
  };

  return (
    <motion.article
      variants={cardV}
      onMouseMove={onMove}
      className={`group relative overflow-hidden rounded-3xl border border-white/[0.08] bg-[#14130f] p-7 transition-all duration-500 hover:-translate-y-1 hover:border-[#ffb454]/40 sm:p-8 ${span}`}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{
          background:
            "radial-gradient(420px circle at var(--x,50%) var(--y,50%), rgba(255,180,84,0.09), transparent 60%)",
        }}
      />

      <div
        className={`relative flex h-full flex-col gap-8 ${
          wide ? "lg:flex-row lg:items-center lg:gap-16" : ""
        }`}
      >
        <div className={wide ? "lg:w-1/2" : ""}>
          <div className="flex items-start justify-between">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.03] transition-colors duration-500 group-hover:border-[#ffb454]/40">
              <Icon
                size={22}
                className="text-zinc-500 transition-colors duration-500 group-hover:text-[#ffb454]"
              />
            </span>
            <span
              className={`text-4xl font-semibold leading-none text-transparent ${display}`}
              style={{ WebkitTextStroke: "1px rgba(243,236,220,0.3)" }}
            >
              {String(index + 1).padStart(2, "0")}
            </span>
          </div>

          <h3
            className={`mt-7 text-xl font-semibold tracking-tight text-[#f3ece0] ${display}`}
          >
            {title}
          </h3>
          <p className="mt-2.5 max-w-md text-[15px] leading-relaxed text-zinc-500">
            {desc}
          </p>
        </div>

        <div className={wide ? "lg:w-1/2" : "mt-auto"}>{children}</div>
      </div>
    </motion.article>
  );
};

/* ------------------------------------------------------------------ */
/*  Section                                                            */
/* ------------------------------------------------------------------ */

export const FeaturesSection = () => {
  const reduce = useReducedMotion();

  return (
    <section className="relative overflow-hidden bg-[#100f0d] px-5 py-24 sm:px-8 sm:py-32">
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
                Why codeVolveX
              </p>
            </div>
            <h2
              className={`mt-6 text-4xl font-semibold leading-[1.04] tracking-tight text-[#f3ece0] sm:text-6xl ${display}`}
            >
              Everything you need
              <br />
              to grow as a <span className="text-[#ffb454]">developer</span>
              <span className="text-[#ffb454]">.</span>
            </h2>
          </div>
          <p className="max-w-md text-lg leading-relaxed text-zinc-400">
            Real projects, clear roadmaps and honest feedback, in one place and
            on every device.
          </p>
        </motion.div>

        {/* bento */}
        <motion.div
          variants={gridV}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-6"
        >
          <Card
            index={0}
            span="md:col-span-2 lg:col-span-4"
            Icon={HiBolt}
            title="Project-first learning"
            desc="Every course centers on shipping real products. Build things that go straight on your portfolio from day one."
          >
            <ProjectsVisual />
          </Card>

          <Card
            index={1}
            span="lg:col-span-2"
            Icon={HiMap}
            title="Structured roadmaps"
            desc="Curated paths for frontend, backend, DevOps, and ML that take you from zero to job-ready in months."
          >
            <RouteVisual />
          </Card>

          <Card
            index={2}
            span="lg:col-span-2"
            Icon={HiUsers}
            title="Expert mentors"
            desc="Live Q&A, office hours, and 1-on-1 sessions with engineers from Google, Meta, and top-tier startups."
          >
            <MentorVisual />
          </Card>

          <Card
            index={3}
            span="lg:col-span-2"
            Icon={HiTrophy}
            title="Industry certificates"
            desc="Verified credentials recognised by 500+ hiring partners. Add them to LinkedIn with one click."
          >
            <CertVisual />
          </Card>

          <Card
            index={4}
            span="md:col-span-2 lg:col-span-2"
            Icon={HiCpuChip}
            title="AI-powered feedback"
            desc="Instant code reviews on every submission — not just what's wrong, but exactly why and how to fix it."
          >
            <DiffVisual />
          </Card>

          <Card
            index={5}
            wide
            span="md:col-span-2 lg:col-span-6"
            Icon={HiDevicePhoneMobile}
            title="Learn anywhere"
            desc="Full-featured mobile and desktop apps with offline mode. Progress syncs seamlessly across every device."
          >
            <DevicesVisual reduce={reduce} />
          </Card>
        </motion.div>
      </div>
    </section>
  );
};