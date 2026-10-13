import React from "react";
import { useSelector } from "react-redux";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";

import CourseBuilderForm from "./CourseBuilder/CourseBuilderForm";
import CourseInformationForm from "./CourseInformation/CourseInformationForm";
import PublishCourse from "./PublishCourse";

/* ---------- design tokens (shared with the hero) ---------- */
const EASE = [0.23, 1, 0.32, 1];
const display = "font-['Space_Grotesk',ui-sans-serif,system-ui,sans-serif]";
const mono = "font-['JetBrains_Mono',ui-monospace,monospace]";

const STEPS = [
  { id: 1, title: "Course information" },
  { id: 2, title: "Course builder" },
  { id: 3, title: "Publish settings" },
];

const StepDot = ({ state, number, reduce }) => {
  if (state === "done") {
    return (
      <motion.span
        initial={reduce ? false : { scale: 0.6, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, ease: EASE }}
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#ffb454]"
      >
        <svg width="14" height="14" viewBox="0 0 12 12" fill="none" aria-hidden>
          <motion.path
            d="M2.5 6.2l2.4 2.4 4.6-5"
            stroke="#1d1a16"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={reduce ? false : { pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.5, ease: EASE, delay: 0.1 }}
          />
        </svg>
      </motion.span>
    );
  }
  const active = state === "active";
  return (
    <span
      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full border text-sm transition-colors duration-500 ${mono} ${
        active
          ? "border-[#ffb454]/70 bg-[#ffb454]/10 text-[#ffb454]"
          : "border-white/15 text-zinc-600"
      }`}
    >
      {number}
    </span>
  );
};

export default function RenderSteps() {
  const { step } = useSelector((state) => state.course);
  const reduce = useReducedMotion();

  return (
    <div className="flex w-full flex-col">
      <ol className="mb-12 flex w-full max-w-[640px]" aria-label="Course creation progress">
        {STEPS.map((s, i) => {
          const state = step > s.id ? "done" : step === s.id ? "active" : "idle";
          const last = i === STEPS.length - 1;
          return (
            <li
              key={s.id}
              aria-current={state === "active" ? "step" : undefined}
              className={last ? "" : "flex-1"}
            >
              <div className="flex items-center">
                <StepDot state={state} number={s.id} reduce={reduce} />
                {!last && (
                  <div className="relative mx-3 h-px flex-1 overflow-hidden bg-white/10">
                    <motion.div
                      initial={false}
                      animate={{ scaleX: step > s.id ? 1 : 0 }}
                      transition={{ duration: reduce ? 0 : 0.9, ease: EASE }}
                      className="absolute inset-0 origin-left bg-[#ffb454]"
                    />
                  </div>
                )}
              </div>
              <p
                className={`mt-3 whitespace-nowrap text-sm transition-colors duration-500 ${display} ${
                  state === "active"
                    ? "font-medium text-[#f3ece0]"
                    : state === "done"
                    ? "text-zinc-400"
                    : "text-zinc-600"
                }`}
              >
                {s.title}
              </p>
            </li>
          );
        })}
      </ol>

      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={step}
          initial={reduce ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={reduce ? undefined : { opacity: 0, y: -8 }}
          transition={{ duration: 0.45, ease: EASE }}
          className="w-full max-w-[640px]"
        >
          {step === 1 && <CourseInformationForm />}
          {step === 2 && <CourseBuilderForm />}
          {step === 3 && <PublishCourse />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}