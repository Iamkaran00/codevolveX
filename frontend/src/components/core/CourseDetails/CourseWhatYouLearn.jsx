import React from "react"
import { motion } from "framer-motion"
import { CheckCircle2 } from "lucide-react"

export default function CourseWhatYouLearn({ course }) {
  const points = Array.isArray(course.whatWillYouLearn)
    ? course.whatWillYouLearn
    : course.whatWillYouLearn?.split("\n").filter(Boolean) ?? []

  if (!points.length) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1, ease: [0.23, 1, 0.32, 1] }}
      className="relative bg-white rounded-3xl border border-slate-100 overflow-hidden"
    >
      {/* Accent bar */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 via-violet-500 to-purple-500" />

      <div className="p-8">
        <div className="flex items-center gap-3 mb-7">
          <div className="w-10 h-10 rounded-2xl bg-indigo-50 flex items-center justify-center shrink-0">
            <CheckCircle2 size={20} className="text-indigo-600" />
          </div>
          <div>
            <h2 className="text-xl font-black text-slate-900">What you'll learn</h2>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mt-0.5">
              {points.length} key outcomes
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {points.map((point, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.1 + i * 0.04, ease: "easeOut" }}
              className="flex items-start gap-3 bg-slate-50 rounded-2xl px-4 py-3.5"
            >
              <div className="w-5 h-5 rounded-full bg-indigo-100 flex items-center justify-center shrink-0 mt-0.5">
                <CheckCircle2 size={12} className="text-indigo-600" />
              </div>
              <span className="text-sm font-medium text-slate-700 leading-relaxed">
                {point}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  )
}