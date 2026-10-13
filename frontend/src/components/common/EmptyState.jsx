import React from "react";
import { useNavigate } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";

const display = "font-['Space_Grotesk',ui-sans-serif,system-ui,sans-serif]";

export default function EmptyState() {
  const navigate = useNavigate();
  const reduce = useReducedMotion();

  return (
    <div className="relative flex min-h-[400px] flex-col items-center justify-center overflow-hidden rounded-2xl border border-white/[0.08] bg-[#14130f] p-8 text-center">
      <div className="relative mb-8 flex h-28 w-28 items-center justify-center">
        {/* slow dashed orbit */}
        <motion.span
          aria-hidden
          animate={reduce ? undefined : { rotate: 360 }}
          transition={{ duration: 40, ease: "linear", repeat: Infinity }}
          className="absolute inset-0 rounded-full border border-dashed border-white/15"
        />
        {/* a single small dot riding the orbit */}
        {!reduce && (
          <motion.span
            aria-hidden
            animate={{ rotate: 360 }}
            transition={{ duration: 18, ease: "linear", repeat: Infinity }}
            className="absolute inset-0"
          >
            <span className="absolute left-1/2 top-0 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#ffb454]" />
          </motion.span>
        )}

        <motion.div
          animate={reduce ? undefined : { y: [0, -8, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="relative z-10 flex h-16 w-16 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.03] text-[#ffb454]"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.6}
            stroke="currentColor"
            className="h-8 w-8"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25"
            />
          </svg>
        </motion.div>
      </div>

      <h3
        className={`text-2xl font-semibold tracking-tight text-[#f3ece0] ${display}`}
      >
        Your learning canvas is empty
        <span className="text-[#ffb454]">.</span>
      </h3>
      <p className="mt-3 max-w-sm text-[15px] leading-relaxed text-zinc-500">
        Ready to level up? Explore the CodevolveX catalogue and start your first
        interactive learning path.
      </p>

      <button
        onClick={() => navigate("/")}
        className="mt-8 rounded-full bg-[#ffb454] px-7 py-3 text-sm font-semibold text-[#1d1a16] transition-all duration-500 hover:bg-[#ffc272] active:scale-[0.98]"
      >
        Explore learning paths
      </button>
    </div>
  );
}