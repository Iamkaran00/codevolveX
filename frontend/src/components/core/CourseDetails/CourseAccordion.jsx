import React from "react"
import { motion } from "framer-motion"
import { BookOpen, Lock, LayoutList } from "lucide-react"

export default function CourseAccordion({ course }) {
  const sections = course.courseContent ?? []
  const totalLectures = sections.reduce(
    (sum, s) => sum + (s.subSection?.length ?? s.SubSection?.length ?? 0),
    0
  )

  if (!sections.length) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.15, ease: [0.23, 1, 0.32, 1] }}
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-2xl bg-indigo-50 flex items-center justify-center shrink-0">
          <LayoutList size={20} className="text-indigo-600" />
        </div>
        <div>
          <h2 className="text-xl font-black text-slate-900">Course Curriculum</h2>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mt-0.5">
            {sections.length} sections · {totalLectures} lectures
          </p>
        </div>
      </div>

      {/* Sections */}
      <div className="space-y-2">
        {sections.map((section, i) => {
          const lectureCount =
            section.subSection?.length ?? section.SubSection?.length ?? 0

          return (
            <motion.div
              key={section._id ?? i}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.15 + i * 0.05, ease: "easeOut" }}
              className="group bg-white rounded-2xl border border-slate-100 px-5 py-4 flex items-center justify-between hover:border-indigo-200 hover:bg-indigo-50/30 hover:-translate-y-0.5 hover:shadow-[0_8px_20px_-8px_rgba(79,70,229,0.12)] transition-all duration-300"
            >
              <div className="flex items-center gap-4">
                <span className="w-8 h-8 rounded-xl bg-slate-100 group-hover:bg-indigo-100 text-slate-500 group-hover:text-indigo-700 text-sm font-black flex items-center justify-center shrink-0 transition-colors duration-300">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="text-sm font-bold text-slate-800 group-hover:text-slate-900 transition-colors">
                  {section.sectionName}
                </span>
              </div>

              <div className="flex items-center gap-3 shrink-0 ml-4">
                <span className="flex items-center gap-1.5 text-xs font-bold text-slate-400 bg-slate-50 group-hover:bg-white px-3 py-1.5 rounded-full border border-slate-100 transition-colors">
                  <BookOpen size={12} />
                  {lectureCount} {lectureCount === 1 ? "lecture" : "lectures"}
                </span>
                <div className="w-6 h-6 rounded-full bg-slate-100 group-hover:bg-indigo-100 flex items-center justify-center transition-colors">
                  <Lock size={11} className="text-slate-400 group-hover:text-indigo-400 transition-colors" />
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* Enroll hint */}
      <div className="mt-4 flex items-center justify-center gap-2 py-3.5 bg-indigo-50 rounded-2xl border border-indigo-100">
        <Lock size={13} className="text-indigo-400" />
        <p className="text-xs font-bold text-indigo-500 uppercase tracking-wider">
          Enroll to unlock full curriculum
        </p>
      </div>
    </motion.div>
  )
}