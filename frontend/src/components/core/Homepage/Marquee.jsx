import React from "react";
import {
  SiJavascript,
  SiPython,
  SiReact,
  SiNodedotjs,
  SiTypescript,
  SiTensorflow,
  SiDocker,
  SiRust,
  SiGraphql,
  SiKubernetes,
  SiGo,
  SiMongodb,
  SiPostgresql,
} from "react-icons/si";
import { FaAws } from "react-icons/fa6";

const display = "font-['Space_Grotesk',ui-sans-serif,system-ui,sans-serif]";
const mono = "font-['JetBrains_Mono',ui-monospace,monospace]";

const TECHS = [
  { Icon: SiJavascript, label: "JavaScript", color: "#F7DF1E" },
  { Icon: SiPython, label: "Python", color: "#4B8BBE" },
  { Icon: SiReact, label: "React", color: "#61DAFB" },
  { Icon: SiNodedotjs, label: "Node.js", color: "#6CC24A" },
  { Icon: SiTypescript, label: "TypeScript", color: "#3178C6" },
  { Icon: SiTensorflow, label: "TensorFlow", color: "#FF6F00" },
  { Icon: SiDocker, label: "Docker", color: "#2496ED" },
  { Icon: SiRust, label: "Rust", color: "#E8714F" },
  { Icon: FaAws, label: "AWS", color: "#FF9900" },
  { Icon: SiGraphql, label: "GraphQL", color: "#E10098" },
  { Icon: SiKubernetes, label: "Kubernetes", color: "#326CE5" },
  { Icon: SiGo, label: "Go", color: "#00ACD7" },
  { Icon: SiMongodb, label: "MongoDB", color: "#47A248" },
  { Icon: SiPostgresql, label: "PostgreSQL", color: "#5B8DEF" },
];

const ROW_A = TECHS;
const ROW_B = [...TECHS].reverse();

const CSS = `
@keyframes cx-slide-left  { from { transform: translateX(0); }    to { transform: translateX(-50%); } }
@keyframes cx-slide-right { from { transform: translateX(-50%); } to { transform: translateX(0); } }
.cx-track { will-change: transform; animation-timing-function: linear; animation-iteration-count: infinite; }
.cx-left  { animation-name: cx-slide-left; }
.cx-right { animation-name: cx-slide-right; }
.cx-strip:hover .cx-track { animation-play-state: paused; }
`;

const Chip = ({ Icon, label, color }) => (
  <span
    style={{ "--brand": color }}
    className="group mr-4 inline-flex shrink-0 cursor-default items-center gap-3 whitespace-nowrap rounded-full border border-white/[0.08] bg-white/[0.02] px-5 py-2.5 text-zinc-500 transition-all duration-500 hover:-translate-y-0.5 hover:border-white/20 hover:bg-white/[0.05] hover:text-[#f3ece0]"
  >
    <Icon
      size={18}
      className="shrink-0 text-zinc-600 transition-all duration-500 group-hover:scale-110 group-hover:text-[var(--brand)]"
    />
    <span className={`text-[14px] ${display}`}>{label}</span>
  </span>
);

const Row = ({ items, direction, duration }) => {
  const doubled = [...items, ...items];
  return (
    <div className="overflow-hidden">
      <div
        className={`cx-track flex w-max ${direction === "left" ? "cx-left" : "cx-right"}`}
        style={{ animationDuration: `${duration}s` }}
      >
        {doubled.map((t, i) => (
          <Chip key={`${t.label}-${i}`} {...t} />
        ))}
      </div>
    </div>
  );
};

export default function Marquee() {
  return (
    <section className="relative border-y border-white/[0.07] bg-[#100f0d] py-14">
      <style>{CSS}</style>

      <div className="mx-auto mb-8 flex max-w-7xl items-center gap-4 px-5 sm:px-8">
        <span className="h-px w-8 bg-[#ffb454]" />
        <p className={`text-[11px] uppercase tracking-[0.25em] text-zinc-500 ${mono}`}>
          Stacks you'll learn
        </p>
        <span className="h-px flex-1 bg-white/[0.07]" />
      </div>

      <div
        className="cx-strip flex flex-col gap-4"
        style={{
          WebkitMaskImage:
            "linear-gradient(90deg, transparent 0%, black 12%, black 88%, transparent 100%)",
          maskImage:
            "linear-gradient(90deg, transparent 0%, black 12%, black 88%, transparent 100%)",
        }}
      >
        <Row items={ROW_A} direction="left" duration={45} />
        <Row items={ROW_B} direction="right" duration={55} />
      </div>
    </section>
  );
}