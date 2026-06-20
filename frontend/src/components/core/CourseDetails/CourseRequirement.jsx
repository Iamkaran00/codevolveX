import React from "react"
import { motion } from "framer-motion"
import { AlertCircle } from "lucide-react"

export default function CourseRequirements({ course }) {
  const instructions = course.instructions ?? []
  if (!instructions.length) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.25, ease: [0.23, 1, 0.32, 1] }}
      className="bg-white rounded-3xl border border-slate-100 p-8"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-2xl bg-amber-50 flex items-center justify-center shrink-0">
          <AlertCircle size={20} className="text-amber-500" />
        </div>
        <div>
          <h2 className="text-xl font-black text-slate-900">Requirements</h2>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mt-0.5">
            Before you begin
          </p>
        </div>
      </div>

      <ul className="space-y-3">
        {instructions.map((item, i) => (
          <motion.li
            key={i}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.25 + i * 0.05, ease: "easeOut" }}
            className="flex items-start gap-3 bg-amber-50/60 rounded-2xl px-4 py-3.5"
          >
            <span className="w-5 h-5 rounded-full bg-amber-100 text-amber-600 text-xs font-black flex items-center justify-center shrink-0 mt-0.5">
              {i + 1}
            </span>
            <span className="text-sm font-medium text-slate-700 leading-relaxed">{item}</span>
          </motion.li>
        ))}
      </ul>
    </motion.div>
  )
}