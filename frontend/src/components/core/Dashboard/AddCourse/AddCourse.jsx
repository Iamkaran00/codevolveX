import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { TbBulb, TbShieldCheck } from "react-icons/tb";

import RenderSteps from "./RenderSteps";
import SpotlightCard from "../../../common/Spotlight";

/* ---------- design tokens (shared with the hero) ---------- */
const EASE = [0.23, 1, 0.32, 1];
const display = "font-['Space_Grotesk',ui-sans-serif,system-ui,sans-serif]";
const mono = "font-['JetBrains_Mono',ui-monospace,monospace]";
const GRAIN = `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.8' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>")`;

const container = { hidden: {}, show: { transition: { staggerChildren: 0.12, delayChildren: 0.05 } } };
const item = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.9, ease: EASE } },
};

const TIPS = [
  ["Price", "Set a price, or leave it free."],
  ["Thumbnail", "Use a 1024×576 image so it isn't cropped in the catalogue."],
  ["Trailer", "The upload video is the trailer on your course page."],
  ["Course Builder", "Add sections here, then lectures inside each section."],
  ["Lectures", "A lecture can be a video, a document or a coding assignment."],
  ["Extra details", "Anything in the additional fields appears in the public description."],
];

export default function AddCourse() {
  const reduce = useReducedMotion();

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-[#100f0d] pb-24 pt-10">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.06] mix-blend-overlay"
        style={{ backgroundImage: GRAIN }}
      />

      <motion.div
        variants={container}
        initial={reduce ? false : "hidden"}
        animate="show"
        className="relative mx-auto flex w-full max-w-7xl flex-col items-start gap-x-14 gap-y-10 px-4 sm:px-6 lg:px-8 xl:flex-row"
      >
        {/* left: header + steps */}
        <motion.div variants={item} className="flex w-full min-w-0 flex-1 flex-col">
          <div className="mb-10 border-b border-white/[0.07] pb-8">
            <h1 className={`text-4xl font-semibold tracking-tight text-[#f3ece0] sm:text-5xl ${display}`}>
              Add a course
            </h1>
            <p className="mt-3 max-w-lg text-base leading-relaxed text-zinc-400">
              Fill in the details, build your sections and lectures, then publish when it's ready.
            </p>
          </div>

          <RenderSteps />
        </motion.div>

        {/* right: tips */}
        <motion.aside variants={item} className="hidden w-full max-w-[400px] shrink-0 xl:block xl:sticky xl:top-10">
          <SpotlightCard
            className="flex flex-col rounded-3xl border border-white/[0.07] bg-white/[0.02] p-8"
            spotlightColor="rgba(255, 180, 84, 0.10)"
          >
            <div className="mb-7 flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-full border border-[#ffb454]/40 bg-[#ffb454]/10 text-[#ffb454]">
                <TbBulb className="text-xl" />
              </span>
              <h2 className={`text-lg font-semibold tracking-tight text-[#f3ece0] ${display}`}>
                Before you start
              </h2>
            </div>

            <dl className="flex flex-col gap-5">
              {TIPS.map(([title, text]) => (
                <div key={title}>
                  <dt className={`text-xs text-[#ffb454] ${mono}`}>{title}</dt>
                  <dd className="mt-1 text-sm leading-relaxed text-zinc-400">{text}</dd>
                </div>
              ))}
            </dl>

            <div className="mt-8 flex items-start gap-3 border-t border-white/[0.07] pt-6">
              <TbShieldCheck className="mt-0.5 shrink-0 text-xl text-zinc-500" />
              <p className="text-[13px] leading-relaxed text-zinc-500">
                Only upload content you own or have permission to use. Check this before you publish.
              </p>
            </div>
          </SpotlightCard>
        </motion.aside>
      </motion.div>
    </div>
  );
}