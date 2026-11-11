import React, { useEffect, useRef, useState } from "react";
import {
  AnimatePresence,
  animate,
  motion,
  useMotionValue,
  useReducedMotion,
  useTransform,
} from "framer-motion";
import { useNavigate } from "react-router-dom";
import { SiReact, SiNodedotjs, SiTensorflow, SiKubernetes } from "react-icons/si";
import { HiArrowRight } from "react-icons/hi2";

const EASE = [0.23, 1, 0.32, 1];
const INK = "#100f0d";
const CREAM = "#f3ece0";

const display = "font-['Space_Grotesk',ui-sans-serif,system-ui,sans-serif]";
const mono = "font-['JetBrains_Mono',ui-monospace,monospace]";

/* The map lives in a 1000 x 560 coordinate space.
   Lines run left → right, bend at 45°, and dock into the "First job" interchange. */
const W = 1000;
const H = 560;
const px = (x) => `${(x / W) * 100}%`;
const py = (y) => `${(y / H) * 100}%`;

const STATION_X = [230, 360, 490, 620];
const DOCK_X = 872;

const PATHS = [
  {
    Icon: SiReact,
    color: "#ffb454",
    title: "Frontend Developer",
    count: "12 courses · 6 months",
    y: 100,
    endY: 200,
    d: "M60 100 H660 L760 200 H872",
    stops: ["HTML & CSS", "JavaScript", "React", "Ship it"],
  },
  {
    Icon: SiNodedotjs,
    color: "#a8c48f",
    title: "Backend Engineer",
    count: "10 courses · 5 months",
    y: 235,
    endY: 270,
    d: "M60 235 H700 L735 270 H872",
    stops: ["Node & Express", "Databases", "Auth & APIs", "Deploy"],
  },
  {
    Icon: SiTensorflow,
    color: "#ef8a62",
    title: "ML & AI Engineer",
    count: "14 courses · 8 months",
    y: 375,
    endY: 330,
    d: "M60 375 H695 L740 330 H872",
    stops: ["Python & maths", "Data handling", "Training models", "Ship a model"],
  },
  {
    Icon: SiKubernetes,
    color: "#8ab4e8",
    title: "Cloud & DevOps",
    count: "9 courses · 4 months",
    y: 500,
    endY: 400,
    d: "M60 500 H660 L760 400 H872",
    stops: ["Linux & Git", "Docker", "Kubernetes", "CI/CD"],
  },
];

/* A little marker that rides the selected line from start to the interchange. */
const Train = ({ d }) => {
  const ref = useRef(null);
  const t = useMotionValue(0);
  const at = (v) => {
    const p = ref.current;
    return p ? p.getPointAtLength(v * p.getTotalLength()) : { x: 0, y: 0 };
  };
  const x = useTransform(t, (v) => at(v).x);
  const y = useTransform(t, (v) => at(v).y);

  useEffect(() => {
    const c = animate(t, 1, {
      duration: 4.2,
      ease: "easeInOut",
      repeat: Infinity,
      repeatDelay: 0.9,
    });
    return () => c.stop();
  }, [t]);

  return (
    <>
      <path ref={ref} d={d} stroke="none" fill="none" />
      <motion.circle
        style={{ x, y }}
        cx={0}
        cy={0}
        r={9}
        fill={INK}
        stroke={CREAM}
        strokeWidth={3}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.15 }}
      />
    </>
  );
};

export default function LearningPaths() {
  const reduce = useReducedMotion();
  const navigate = useNavigate();
  const [active, setActive] = useState(0);
  const path = PATHS[active];

  return (
    <section className="bg-[#100f0d] px-5 py-24 sm:px-8 sm:py-32">
      <div className="mx-auto max-w-7xl">
        {/* header */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.9, ease: EASE }}
          className="mb-14 flex flex-col justify-between gap-8 lg:flex-row lg:items-end"
        >
          <div>
            <p className={`text-xs uppercase tracking-[0.2em] text-zinc-500 ${mono}`}>Learning paths (04)</p>
            <h2
              className={`mt-5 text-5xl font-semibold leading-[0.98] tracking-tighter text-[#f3ece0] sm:text-7xl ${display}`}
            >
              From first line
              <br />
              to first job<span className="text-[#ffb454]">.</span>
            </h2>
          </div>
          <p className="max-w-md text-lg leading-relaxed text-zinc-400">
            Structured roadmaps by industry experts. Pick a line, follow the route, and ship something real at
            every stop.
          </p>
        </motion.div>

        {/* map card */}
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 1, ease: EASE, delay: 0.1 }}
          className="rounded-[28px] border-2 border-white/10 p-5 sm:p-9"
          style={{
            backgroundImage: "radial-gradient(rgba(243,236,224,0.09) 1px, transparent 1px)",
            backgroundSize: "24px 24px",
          }}
        >
          <div className="mb-6 flex items-center justify-between">
            <p className={`text-[11px] uppercase tracking-[0.2em] text-zinc-500 ${mono}`}>
              Hover a line to ride it
            </p>
            <p className={`text-[11px] uppercase tracking-[0.2em] text-zinc-600 md:hidden ${mono}`}>
              Scroll sideways →
            </p>
          </div>

          {/* scrolls sideways on small screens so labels stay readable */}
          <div className="overflow-x-auto pb-16">
            <div className="relative aspect-[1000/560] min-w-[920px]">
              <svg viewBox={`0 0 ${W} ${H}`} className="absolute inset-0 h-full w-full" fill="none" aria-hidden>
                {/* the shared interchange */}
                <rect x={866} y={170} width={44} height={260} rx={22} fill={CREAM} />

                {PATHS.map((p, i) => {
                  const on = i === active;
                  return (
                    <g key={p.title} className="transition-opacity duration-300" style={{ opacity: on ? 1 : 0.18 }}>
                      <motion.path
                        d={p.d}
                        stroke={p.color}
                        strokeWidth={12}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        initial={reduce ? false : { pathLength: 0 }}
                        whileInView={{ pathLength: 1 }}
                        viewport={{ once: true, margin: "-80px" }}
                        transition={{ duration: 1.4, ease: EASE, delay: i * 0.15 }}
                      />
                      <circle cx={DOCK_X} cy={p.endY} r={8} fill={p.color} stroke={INK} strokeWidth={4} />
                      {/* fat invisible stroke = easy hover target */}
                      <path
                        d={p.d}
                        stroke="transparent"
                        strokeWidth={32}
                        pointerEvents="stroke"
                        className="cursor-pointer"
                        onMouseEnter={() => setActive(i)}
                        onClick={() => setActive(i)}
                      />
                    </g>
                  );
                })}

                {!reduce && <Train key={active} d={path.d} />}
              </svg>

              {/* html layer: badges, titles, stations */}
              {PATHS.map((p, i) => {
                const on = i === active;
                return (
                  <div
                    key={p.title}
                    className="pointer-events-none absolute inset-0 transition-opacity duration-300"
                    style={{ opacity: on ? 1 : 0.3 }}
                  >
                    <button
                      type="button"
                      aria-pressed={on}
                      aria-label={p.title}
                      onClick={() => setActive(i)}
                      onMouseEnter={() => setActive(i)}
                      onFocus={() => setActive(i)}
                      className="pointer-events-auto absolute flex h-12 w-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-[5px] border-[#100f0d] outline-none transition-transform duration-300 hover:scale-110 focus-visible:scale-110"
                      style={{ left: px(60), top: py(p.y), backgroundColor: p.color, color: INK }}
                    >
                      <p.Icon size={20} />
                    </button>

                    <div
                      className="absolute"
                      style={{ left: px(60), top: py(p.y), transform: "translate(-24px, 34px)" }}
                    >
                      <p
                        className={`whitespace-nowrap text-base font-semibold tracking-tight ${display}`}
                        style={{ color: p.color }}
                      >
                        {p.title}
                      </p>
                      <p className={`mt-0.5 whitespace-nowrap text-[11px] text-zinc-500 ${mono}`}>{p.count}</p>
                    </div>

                    {STATION_X.map((x, s) => (
                      <div
                        key={p.stops[s]}
                        className="group pointer-events-auto absolute"
                        style={{ left: px(x), top: py(p.y) }}
                        onMouseEnter={() => setActive(i)}
                      >
                        <span className="absolute left-0 top-0 block h-[22px] w-[22px] -translate-x-1/2 -translate-y-1/2 rounded-full border-[5px] border-[#100f0d] bg-[#f3ece0] transition-transform duration-200 group-hover:scale-125" />
                        <span
                          className={`absolute bottom-4 left-0 -translate-x-1/2 whitespace-nowrap text-[15px] font-medium text-[#f3ece0] ${display}`}
                        >
                          {p.stops[s]}
                        </span>
                      </div>
                    ))}
                  </div>
                );
              })}

              {/* interchange label */}
              <div
                className="absolute text-center"
                style={{ left: px(888), top: py(430), transform: "translate(-50%, 16px)" }}
              >
                <p className={`whitespace-nowrap text-xl font-semibold text-[#f3ece0] ${display}`}>First job</p>
                <p className={`mt-0.5 whitespace-nowrap text-[11px] text-zinc-500 ${mono}`}>every line ends here</p>
              </div>
            </div>
          </div>

          {/* selected line */}
          <div className="flex flex-col gap-5 border-t-2 border-white/10 pt-6 sm:flex-row sm:items-center sm:justify-between">
            <AnimatePresence mode="wait">
              <motion.div
                key={active}
                initial={reduce ? false : { opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25, ease: EASE }}
              >
                <p className={`text-[11px] uppercase tracking-[0.2em] text-zinc-500 ${mono}`}>Selected line</p>
                <p className={`mt-1 text-2xl font-semibold tracking-tight ${display}`} style={{ color: path.color }}>
                  {path.title}
                </p>
                <p className={`mt-1 text-xs text-zinc-500 ${mono}`}>
                  {path.count} · {path.stops.join(" → ")}
                </p>
              </motion.div>
            </AnimatePresence>

            <button
              type="button"
              onClick={() => navigate("/catalogue")}
              style={{ backgroundColor: path.color, color: INK }}
              className={`inline-flex shrink-0 items-center justify-center gap-2 self-start rounded-full px-6 py-3 text-sm font-semibold outline-none transition-[transform,background-color] duration-300 hover:scale-[1.04] active:scale-95 sm:self-auto ${display}`}
            >
              Start this path
              <HiArrowRight size={16} />
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}