import React from "react"
import { motion } from "framer-motion"
import { Users, Clock, BookOpen, BarChart2, Star } from "lucide-react"

export default function CourseHero({ course, totalDuration }) {
  const instructorName = course.instructor
    ? `${course.instructor.firstName ?? ""} ${course.instructor.lastName ?? ""}`.trim()
    : "Expert Instructor"

  const enrolled = course.studentsEnrolled?.length ?? 0

  const totalLectures =
    course.courseContent?.reduce(
      (sum, s) => sum + (s.subSection?.length ?? s.SubSection?.length ?? 0),
      0
    ) ?? 0

  const rating =
    course.ratingAndReviews?.length
      ? course.ratingAndReviews.reduce((s, r) => s + r.rating, 0) /
        course.ratingAndReviews.length
      : 0

  const reviewCount = course.ratingAndReviews?.length ?? 0

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
      className="space-y-7"
    >
      {/* Category + tags */}
      <div className="flex flex-wrap gap-2">
        {course.category?.name && (
          <span className="inline-flex items-center bg-indigo-100 text-indigo-700 text-xs font-black uppercase tracking-widest px-4 py-2 rounded-full">
            {course.category.name}
          </span>
        )}
        {course.tag?.map((t) => (
          <span
            key={t}
            className="inline-flex items-center bg-slate-100 text-slate-500 text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-full"
          >
            {t}
          </span>
        ))}
      </div>

      {/* Title */}
      <div className="space-y-1">
        <h1 className="text-4xl md:text-[2.75rem] font-black text-slate-900 tracking-tight leading-[1.1]">
          {course.courseName}
        </h1>
        <div className="w-16 h-1 bg-indigo-500 rounded-full mt-4" />
      </div>

      {/* Description */}
      <p className="text-lg text-slate-500 font-medium leading-relaxed max-w-2xl">
        {course.courseDescription}
      </p>

      {/* Instructor row */}
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-full overflow-hidden bg-indigo-100 shrink-0 flex items-center justify-center">
          {course.instructor?.image ? (
            <img
              src={course.instructor.image}
              alt={instructorName}
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-sm font-black text-indigo-600">
              {instructorName.charAt(0)}
            </span>
          )}
        </div>
        <p className="text-sm font-medium text-slate-500">
          Instructed by{" "}
          <span className="font-black text-indigo-600">{instructorName}</span>
        </p>
      </div>

      {/* Rating + quick stats */}
      <div className="flex flex-wrap items-center gap-x-6 gap-y-3 pt-1">
        {reviewCount > 0 && (
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-0.5">
              {Array.from({ length: 5 }, (_, i) => (
                <Star
                  key={i}
                  size={14}
                  className={i < Math.floor(rating) ? "text-amber-400 fill-amber-400" : "text-slate-200 fill-slate-200"}
                />
              ))}
            </div>
            <span className="text-sm font-black text-slate-900">{rating.toFixed(1)}</span>
            <span className="text-sm font-medium text-slate-400">({reviewCount.toLocaleString()})</span>
          </div>
        )}
        <span className="flex items-center gap-1.5 text-sm font-medium text-slate-500">
          <Users size={14} className="text-slate-400" />
          {enrolled.toLocaleString()} students
        </span>
        <span className="flex items-center gap-1.5 text-sm font-medium text-slate-500">
          <Clock size={14} className="text-slate-400" />
          {totalDuration}
        </span>
        <span className="flex items-center gap-1.5 text-sm font-medium text-slate-500">
          <BookOpen size={14} className="text-slate-400" />
          {totalLectures} lectures
        </span>
      </div>

      {/* Divider */}
      <div className="border-t border-slate-100 pt-7">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { icon: BarChart2, label: "Sections", value: course.courseContent?.length ?? 0, color: "bg-violet-50 text-violet-600" },
            { icon: BookOpen,  label: "Lectures",  value: totalLectures, color: "bg-blue-50 text-blue-600" },
            { icon: Clock,     label: "Duration",  value: totalDuration, color: "bg-amber-50 text-amber-600" },
            { icon: Users,     label: "Enrolled",  value: enrolled.toLocaleString(), color: "bg-emerald-50 text-emerald-600" },
          ].map(({ icon: Icon, label, value, color }) => (
            <div
              key={label}
              className="group bg-white rounded-2xl border border-slate-100 p-4 flex flex-col gap-3 hover:-translate-y-1 hover:border-indigo-100 hover:shadow-[0_8px_24px_-8px_rgba(79,70,229,0.15)] transition-all duration-300"
            >
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${color}`}>
                <Icon size={16} />
              </div>
              <div>
                <p className="text-xl font-black text-slate-900 leading-none">{value}</p>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mt-1">{label}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  )
}