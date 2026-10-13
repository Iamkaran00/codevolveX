import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  SiOpenai,
  SiNextdotjs,
  SiEthereum,
  SiKalilinux,
  SiApachekafka,
  SiPytorch,
  SiGraphql,
} from "react-icons/si";
import { FaRobot, FaVrCardboard, FaCloudArrowUp } from "react-icons/fa6";
import { HiArrowUpRight } from "react-icons/hi2";

const EASE = [0.23, 1, 0.32, 1];

const display = "font-['Space_Grotesk',ui-sans-serif,system-ui,sans-serif]";
const mono = "font-['JetBrains_Mono',ui-monospace,monospace]";

const GRAIN = `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.8' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>")`;

const TRENDING_TOPICS = [
  { Icon: SiOpenai, color: "#10a37f", name: "Generative AI", count: "18 Masterclasses" },
  { Icon: SiNextdotjs, color: "#e5e5e5", name: "Next.js & React 19", count: "24 Courses" },
  { Icon: FaCloudArrowUp, color: "#0ea5e9", name: "Cloud Native", count: "31 Courses" },
  { Icon: FaRobot, color: "#f97316", name: "Agentic Systems", count: "9 Courses" },
  { Icon: SiEthereum, color: "#8b8dfc", name: "Web3 & Blockchain", count: "14 Courses" },
  { Icon: SiKalilinux, color: "#3b82f6", name: "Cybersecurity", count: "22 Courses" },
  { Icon: SiPytorch, color: "#ee4c2c", name: "Deep Learning", count: "17 Courses" },
  { Icon: SiApachekafka, color: "#14b8a6", name: "Data Engineering", count: "26 Courses" },
  { Icon: FaVrCardboard, color: "#d946ef", name: "Spatial Computing", count: "8 Courses" },
  { Icon: SiGraphql, color: "#e10098", name: "Modern APIs", count: "19 Courses" },
];

const listV = { hidden: {}, show: { transition: { staggerChildren: 0.07 } } };
const rowV = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.9, ease: EASE } },
};

const Row = ({ topic, index, onOpen }) => {
  const { Icon, color, name, count } = topic;
  return (
    <motion.li variants={rowV}>
      <button
        type="button"
        onClick={onOpen}
        style={{ "--brand": color }}
        className="group relative flex w-full items-center gap-5 py-6 text-left outline-none"
      >
        <span className={`w-7 shrink-0 text-xs text-zinc-700 transition-colors duration-500 group-hover:text-[#ffb454] ${mono}`}>
          {String(index + 1).padStart(2, "0")}
        </span>

        <Icon
          size={26}
          className="shrink-0 text-zinc-600 transition-all duration-700 group-hover:scale-110 group-hover:text-[var(--brand)] group-focus-visible:text-[var(--brand)]"
        />

        <span
          className={`flex-1 truncate text-xl font-medium tracking-tight text-zinc-400 transition-all duration-500 group-hover:translate-x-2 group-hover:text-[#f3ece0] group-focus-visible:text-[#f3ece0] sm:text-2xl ${display}`}
        >
          {name}
        </span>

        <span className={`hidden shrink-0 text-xs text-zinc-600 sm:block ${mono}`}>
          {count}
        </span>

        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/10 text-zinc-600 transition-all duration-500 group-hover:border-[#ffb454] group-hover:bg-[#ffb454] group-hover:text-[#1d1a16] group-focus-visible:border-[#ffb454]">
          <HiArrowUpRight size={16} />
        </span>

        {/* hairline + amber line that draws in on hover */}
        <span className="absolute inset-x-0 bottom-0 h-px bg-white/[0.07]" />
        <span className="absolute bottom-0 left-0 h-px w-0 bg-[#ffb454] transition-all duration-[900ms] ease-out group-hover:w-full group-focus-visible:w-full" />
      </button>
    </motion.li>
  );
};

export default function TrendingCategories() {
  const navigate = useNavigate();
  const half = Math.ceil(TRENDING_TOPICS.length / 2);
  const columns = [TRENDING_TOPICS.slice(0, half), TRENDING_TOPICS.slice(half)];

  return (
    <section className="relative overflow-hidden border-t border-white/[0.07] bg-[#100f0d] px-5 py-24 sm:px-8 sm:py-32">
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
          className="mb-14 flex flex-col justify-between gap-8 lg:flex-row lg:items-end"
        >
          <div>
            <div className="flex items-center gap-3">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#ffb454] opacity-50" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-[#ffb454]" />
              </span>
              <p className={`text-[11px] uppercase tracking-[0.25em] text-zinc-500 ${mono}`}>
                Trending now
              </p>
            </div>
            <h2
              className={`mt-6 text-4xl font-semibold leading-[1.04] tracking-tight text-[#f3ece0] sm:text-6xl ${display}`}
            >
              Master the most
              <br />
              in-demand tech<span className="text-[#ffb454]">.</span>
            </h2>
          </div>
          <p className="max-w-md text-lg leading-relaxed text-zinc-400">
            Stay ahead of the curve with a curriculum shaped by working
            engineers and researchers.
          </p>
        </motion.div>

        {/* topic index */}
        <div className="grid gap-x-16 lg:grid-cols-2">
          {columns.map((col, c) => (
            <motion.ul
              key={c}
              variants={listV}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-60px" }}
              className="border-t border-white/[0.07]"
            >
              {col.map((topic, i) => (
                <Row
                  key={topic.name}
                  topic={topic}
                  index={c * half + i}
                  onOpen={() => navigate("/catalogue")}
                />
              ))}
            </motion.ul>
          ))}
        </div>
      </div>
    </section>
  );
}