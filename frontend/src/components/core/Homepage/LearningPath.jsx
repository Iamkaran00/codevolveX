import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  SiReact,
  SiNodedotjs,
  SiTensorflow,
  SiKubernetes,
} from "react-icons/si";
import { HiArrowRight } from "react-icons/hi2";

const EASE = [0.23, 1, 0.32, 1];

const display = "font-['Space_Grotesk',ui-sans-serif,system-ui,sans-serif]";
const mono = "font-['JetBrains_Mono',ui-monospace,monospace]";

const GRAIN = `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.8' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>")`;

const PATHS = [
  {
    Icon: SiReact,
    color: "#61DAFB",
    title: "Frontend Developer",
    count: "12 courses · 6 months",
    stops: ["HTML & CSS", "JavaScript", "React", "Ship it"],
  },
  {
    Icon: SiNodedotjs,
    color: "#6CC24A",
    title: "Backend Engineer",
    count: "10 courses · 5 months",
    stops: ["Node & Express", "Databases", "Auth & APIs", "Deploy"],
  },
  {
    Icon: SiTensorflow,
    color: "#FF6F00",
    title: "ML & AI Engineer",
    count: "14 courses · 8 months",
    stops: ["Python & maths", "Data handling", "Training models", "Ship a model"],
  },
  {
    Icon: SiKubernetes,
    color: "#5B8DEF",
    title: "Cloud & DevOps",
    count: "9 courses · 4 months",
    stops: ["Linux & Git", "Docker", "Kubernetes", "CI/CD"],
  },
];

const containerV = { hidden: {}, show: { transition: { staggerChildren: 0.12 } } };
const cardV = {
  hidden: { opacity: 0, y: 26 },
  show: { opacity: 1, y: 0, transition: { duration: 0.95, ease: EASE } },
};

export default function LearningPaths() {
  const navigate = useNavigate();

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
                Learning paths
              </p>
            </div>
            <h2
              className={`mt-6 text-4xl font-semibold leading-[1.04] tracking-tight text-[#f3ece0] sm:text-6xl ${display}`}
            >
              From first line
              <br />
              to first job<span className="text-[#ffb454]">.</span>
            </h2>
          </div>
          <p className="max-w-md text-lg leading-relaxed text-zinc-400">
            Structured roadmaps by industry experts. Pick a path, follow the
            route, and ship something real at every stop.
          </p>
        </motion.div>

        {/* cards */}
        <motion.div
          variants={containerV}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-50px" }}
          className="grid auto-rows-fr grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4"
        >
          {PATHS.map(({ Icon, color, title, count, stops }, i) => (
            <motion.article
              key={title}
              variants={cardV}
              role="link"
              tabIndex={0}
              onClick={() => navigate("/catalogue")}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  navigate("/catalogue");
                }
              }}
              style={{ "--brand": color }}
              className="group flex h-full cursor-pointer flex-col rounded-3xl border border-white/[0.08] bg-[#14130f] p-7 outline-none transition-all duration-500 hover:-translate-y-1 hover:border-[#ffb454]/40 focus-visible:border-[#ffb454]"
            >
              {/* icon + index */}
              <div className="flex items-start justify-between">
                <span className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.03] transition-colors duration-500 group-hover:border-white/20">
                  <Icon
                    size={26}
                    className="text-zinc-500 transition-all duration-700 group-hover:scale-110 group-hover:text-[var(--brand)]"
                  />
                </span>
                <span
                  className={`text-5xl font-semibold leading-none text-transparent ${display}`}
                  style={{ WebkitTextStroke: "1px rgba(243,236,220,0.35)" }}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
              </div>

              {/* title */}
              <h3
                className={`mt-7 text-xl font-semibold tracking-tight text-[#f3ece0] ${display}`}
              >
                {title}
              </h3>
              <p className={`mt-1.5 text-xs text-zinc-500 ${mono}`}>{count}</p>

              {/* route */}
              <div className="relative mt-8">
                <span className="absolute bottom-2 left-[5px] top-2 w-px bg-white/10" />
                <span className="absolute left-[5px] top-2 h-0 w-px bg-[#ffb454] transition-all duration-[1400ms] ease-out group-hover:h-[calc(100%-1rem)]" />

                <ul className="flex flex-col gap-4">
                  {stops.map((stop, s) => (
                    <li key={stop} className="relative flex items-center gap-4">
                      <span
                        style={{ transitionDelay: `${s * 280}ms` }}
                        className="relative z-10 h-[11px] w-[11px] shrink-0 rounded-full border border-white/25 bg-[#14130f] transition-all duration-700 group-hover:border-[#ffb454] group-hover:bg-[#ffb454]"
                      />
                      <span
                        style={{ transitionDelay: `${s * 280}ms` }}
                        className="text-[14px] text-zinc-500 transition-colors duration-700 group-hover:text-zinc-200"
                      >
                        {stop}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* footer */}
              <div className="mt-auto flex items-center gap-2 pt-8 text-sm text-zinc-500 transition-colors duration-500 group-hover:text-[#ffb454]">
                Start this path
                <HiArrowRight className="transition-transform duration-500 group-hover:translate-x-1.5" />
              </div>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </section>
  );
}