import React from "react";
import { motion } from "framer-motion";
import { CheckCircle2, ListChecks } from "lucide-react";

export default function CourseRequirements({ course }) {
  const instructions = course.instructions ?? [];
  if (!instructions.length) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="bg-white rounded-3xl border border-indigo-50 shadow-[0_4px_24px_-8px_rgba(79,70,229,0.08)] p-8"
    >
      <div className="flex items-center gap-4 mb-8">
        <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center shrink-0 border border-indigo-100">
          <ListChecks size={24} className="text-indigo-600" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-indigo-950">Prerequisites</h2>
          <p className="text-xs font-semibold text-indigo-400 uppercase tracking-wider mt-0.5">
            What you need to get started
          </p>
        </div>
      </div>

      <ul className="space-y-4">
        {instructions.map((item, i) => (
          <motion.li
            key={i}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.1 + i * 0.05 }}
            className="flex items-start gap-4 group"
          >
            <div className="mt-1 shrink-0">
              <CheckCircle2 size={18} className="text-indigo-300 group-hover:text-violet-500 transition-colors" />
            </div>
            <span className="text-[15px] font-medium text-slate-600 leading-relaxed">
              {item}
            </span>
          </motion.li>
        ))}
      </ul>
    </motion.div>
  );
}