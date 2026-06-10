import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export default function EmptyState() {
  const navigate = useNavigate();

  return (
    <div className="flex h-[400px] flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white p-8 shadow-md text-center overflow-hidden relative">
      
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(79,70,229,0.03),transparent_60%)] pointer-events-none" />

      <div className="relative mb-6 flex h-24 w-24 items-center justify-center">
        
        <div className="absolute inset-0 animate-ping rounded-full bg-indigo-50 opacity-75 duration-1000" />
        
        <div className="absolute inset-2 animate-spin rounded-full border border-dashed border-indigo-200 duration-[6000ms]" />

        <motion.div
          animate={{
            y: [0, -10, 0],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="relative z-10 flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-50 border border-indigo-100/80 text-indigo-600 shadow-sm"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.8}
            stroke="currentColor"
            className="w-8 h-8"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25"
            />
          </svg>
        </motion.div>

        {/* Dynamic Sparkle Bits Floating nearby */}
        <div className="absolute top-0 right-1 h-2 w-2 rounded-full bg-indigo-400 animate-bounce delay-100" />
        <div className="absolute bottom-2 left-0 h-1.5 w-1.5 rounded-full bg-violet-400 animate-pulse" />
      </div>

      {/* TEXT TYPOGRAPHY ELEMENT LAYERS */}
      <h3 className="text-xl font-bold text-slate-900 tracking-tight">
        Your Learning Canvas is Empty
      </h3>
      <p className="text-sm text-slate-400 mt-1.5 max-w-sm leading-relaxed">
        Ready to level up your code workspace? Explore the CodevolveX catalog to unlock interactive programming paths.
      </p>

      {/* CTA INTERACTION PANEL */}
      <button
        onClick={() => navigate("/")}
        className="mt-6 rounded-xl bg-indigo-600 px-6 py-2.5 text-xs font-bold text-white shadow-sm shadow-indigo-100 hover:bg-indigo-700 transition-all active:scale-[0.98]"
      >
        Explore Learning Paths
      </button>
    </div>
  );
}