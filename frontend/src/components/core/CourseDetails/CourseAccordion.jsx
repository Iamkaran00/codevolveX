import React from "react";
import { motion } from "framer-motion";
import { BookOpen, Lock, Layers } from "lucide-react";

export default function CourseAccordion({ course }) {
  const sections = course?.courseContent ?? [];
  const totalLectures = sections.reduce(
    (sum, s) => sum + (s.subSection?.length ?? s.SubSection?.length ?? 0),
    0
  );

  if (!sections.length) return null;

  // Stagger animation variants for a smoother, premium reveal
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.08, delayChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 12, filter: "blur(4px)" },
    show: { 
      opacity: 1, 
      y: 0, 
      filter: "blur(0px)",
      transition: { type: "spring", stiffness: 280, damping: 24 } 
    },
  };

  return (
    <div className="w-full max-w-3xl mx-auto bg-white p-6 md:p-8 rounded-[2rem] shadow-[0_2px_40px_-12px_rgba(79,70,229,0.05)] ring-1 ring-indigo-50 antialiased">
      {/* Header section */}
      <div className="flex items-center gap-4 mb-8">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-50 to-violet-50 border border-indigo-100/50 flex items-center justify-center shrink-0 shadow-inner">
          <Layers className="w-6 h-6 text-indigo-600" strokeWidth={1.5} />
        </div>
        <div>
          <h2 className="text-2xl font-semibold tracking-tight text-indigo-950">
            Course Curriculum
          </h2>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-sm font-medium text-violet-600/80">
              {sections.length} Sections
            </span>
            <span className="w-1 h-1 rounded-full bg-indigo-200"></span>
            <span className="text-sm font-medium text-indigo-400">
              {totalLectures} Lectures
            </span>
          </div>
        </div>
      </div>

      {/* Sections List */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="space-y-3"
      >
        {sections.map((section, i) => {
          const lectureCount =
            section.subSection?.length ?? section.SubSection?.length ?? 0;

          return (
            <motion.div
              key={section._id ?? i}
              variants={itemVariants}
              className="group relative bg-white rounded-2xl border border-indigo-50 p-4 md:px-5 md:py-4 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-violet-200 hover:bg-gradient-to-r hover:from-indigo-50/40 hover:to-violet-50/40 hover:shadow-[0_8px_30px_-12px_rgba(124,58,237,0.15)] transition-all duration-300 ease-out cursor-pointer overflow-hidden"
            >
              {/* Left edge accent line on hover */}
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-indigo-400 to-violet-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-l-2xl" />

              <div className="flex items-center gap-4">
                <span className="w-8 flex justify-center text-sm font-semibold text-indigo-300 group-hover:text-violet-500 transition-colors duration-300">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="text-[15px] font-medium tracking-tight text-indigo-900 group-hover:text-indigo-950 transition-colors">
                  {section.sectionName}
                </span>
              </div>

              <div className="flex items-center gap-3 shrink-0 md:ml-4 pl-12 md:pl-0">
                <span className="flex items-center gap-1.5 text-[13px] font-medium text-indigo-500/80 bg-indigo-50/50 group-hover:bg-white group-hover:text-violet-600 px-3 py-1 rounded-full border border-indigo-100/30 group-hover:border-violet-100 transition-all duration-300">
                  <BookOpen className="w-3.5 h-3.5" />
                  {lectureCount} {lectureCount === 1 ? "Lesson" : "Lessons"}
                </span>
                <div className="w-8 h-8 rounded-full bg-slate-50 group-hover:bg-violet-100 border border-slate-100 group-hover:border-violet-200 flex items-center justify-center transition-all duration-300 shadow-sm">
                  <Lock className="w-3.5 h-3.5 text-slate-400 group-hover:text-violet-600 transition-colors" />
                </div>
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Lock CTA Banner */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.4 }}
        className="mt-6 flex items-center justify-center gap-2.5 py-4 bg-gradient-to-r from-indigo-50 via-white to-violet-50 rounded-2xl border border-indigo-100/60 shadow-sm"
      >
        <Lock className="w-4 h-4 text-indigo-400" />
        <p className="text-sm font-semibold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600 tracking-wide">
          Enroll to unlock the full curriculum
        </p>
      </motion.div>
    </div>
  );
}