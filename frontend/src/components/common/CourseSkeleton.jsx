import React from "react";
import { motion, useReducedMotion } from "framer-motion";

const Bone = ({ className = "", delay = 0 }) => {
  const reduce = useReducedMotion();
  return (
    <motion.div
      animate={reduce ? undefined : { opacity: [0.45, 1, 0.45] }}
      transition={{ duration: 2.4, ease: "easeInOut", repeat: Infinity, delay }}
      className={`bg-white/[0.06] ${className}`}
    />
  );
};

export default function CourseSkeleton() {
  return (
    <div
      aria-hidden
      className="flex flex-col items-center justify-between gap-4 rounded-2xl border border-white/[0.08] bg-[#14130f] p-5 sm:flex-row"
    >
      <div className="flex w-full items-center gap-4 sm:w-auto">
        <Bone className="h-16 w-24 shrink-0 rounded-xl" />

        <div className="flex w-full flex-col gap-2.5 sm:w-[250px]">
          <Bone className="h-4 w-3/4 rounded-full" delay={0.15} />
          <Bone className="h-3 w-1/2 rounded-full" delay={0.3} />
        </div>
      </div>

      <div className="flex w-full items-center justify-end sm:w-auto">
        <Bone className="h-9 w-32 rounded-full" delay={0.45} />
      </div>
    </div>
  );
}