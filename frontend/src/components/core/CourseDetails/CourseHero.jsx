import React from "react";
import { motion } from "framer-motion";
import { Users, Clock, BookOpen, BarChart2, Star } from "lucide-react";

export default function CourseHero({ course, totalDuration }) {
  const instructorName = course.instructor
    ? `${course.instructor.firstName ?? ""} ${course.instructor.lastName ?? ""}`.trim()
    : "Expert Instructor";

  const enrolled = course.studentsEnrolled?.length ?? 0;
  const totalLectures = course.courseContent?.reduce(
    (sum, s) => sum + (s.subSection?.length ?? s.SubSection?.length ?? 0),
    0
  ) ?? 0;

 
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="space-y-8"
    >
      <div className="flex flex-wrap gap-3">
        {course.category?.name && (
          <span className="px-3 py-1 rounded-lg bg-indigo-100/50 text-indigo-700 text-[11px] font-semibold tracking-wide uppercase">
            {course.category.name}
          </span>
        )}
      </div>

      <div className="space-y-4">
        <h1 className="text-4xl md:text-5xl font-semibold text-indigo-950 tracking-tight leading-[1.1]">
          {course.courseName}
        </h1>
        <p className="text-lg text-slate-600 max-w-2xl leading-relaxed">
          {course.courseDescription}
        </p>
      </div>

      {/* Meta Info */}
      <div className="flex items-center gap-4 py-2 border-y border-slate-200/60">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full overflow-hidden bg-indigo-100 ring-2 ring-indigo-50">
            {course.instructor?.image ? (
              <img src={course.instructor.image} alt={instructorName} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-xs font-semibold text-indigo-600">
                {instructorName.charAt(0)}
              </div>
            )}
          </div>
          <span className="text-sm font-medium text-slate-700">
            By <span className="font-semibold text-indigo-700">{instructorName}</span>
          </span>
        </div>
        <div className="h-4 w-[1px] bg-slate-300" />
       
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { icon: BarChart2, label: "Sections", value: course.courseContent?.length ?? 0 },
          { icon: BookOpen, label: "Lessons", value: totalLectures },
          { icon: Clock, label: "Duration", value: totalDuration },
          { icon: Users, label: "Students", value: enrolled.toLocaleString() },
        ].map(({ icon: Icon, label, value }) => (
          <div
            key={label}
            className="p-5 rounded-2xl bg-indigo-50/40 border border-indigo-100/60 hover:bg-white hover:border-indigo-200 hover:shadow-[0_8px_20px_-8px_rgba(79,70,229,0.15)] transition-all duration-300"
          >
            <div className="w-8 h-8 rounded-xl bg-white flex items-center justify-center mb-4 shadow-sm border border-slate-100">
              <Icon size={16} className="text-indigo-600" />
            </div>
            <div className="text-lg font-bold text-indigo-950">{value}</div>
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">{label}</div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}