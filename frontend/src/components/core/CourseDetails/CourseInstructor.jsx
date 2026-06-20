import React from "react"
import { motion } from "framer-motion"
import { BadgeCheck, BookOpen, Users } from "lucide-react"

export default function CourseInstructor({ course }) {
  const instructor = course.instructor
  if (!instructor) return null

  const instructorName =
    `${instructor.firstName ?? ""} ${instructor.lastName ?? ""}`.trim() ||
    "Expert Instructor"

  const bio = instructor.additionalDetails?.about ?? ""
  const image = instructor.image ?? null
  const totalCourses = instructor.courses?.length ?? 0
  const initial = instructorName.charAt(0).toUpperCase()

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2, ease: [0.23, 1, 0.32, 1] }}
      className="bg-white rounded-3xl border border-slate-100 overflow-hidden"
    >
      <div className="p-8">
        <h2 className="text-xl font-black text-slate-900 mb-6">Your Instructor</h2>

        <div className="flex items-start gap-5">
          {/* Avatar */}
          <div className="relative shrink-0">
            <div className="w-20 h-20 rounded-2xl overflow-hidden bg-indigo-100 flex items-center justify-center shadow-[0_8px_24px_-8px_rgba(79,70,229,0.25)]">
              {image ? (
                <img src={image} alt={instructorName} className="w-full h-full object-cover" />
              ) : (
                <span className="text-3xl font-black text-indigo-500">{initial}</span>
              )}
            </div>
            <div className="absolute -bottom-1.5 -right-1.5 w-6 h-6 bg-indigo-600 rounded-full flex items-center justify-center shadow-sm">
              <BadgeCheck size={14} className="text-white" />
            </div>
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <p className="text-xl font-black text-slate-900">{instructorName}</p>
            <p className="text-sm font-bold text-indigo-500 mt-0.5">Verified Instructor</p>

            <div className="flex items-center gap-4 mt-3">
              {totalCourses > 0 && (
                <span className="flex items-center gap-1.5 text-xs font-bold text-slate-400">
                  <BookOpen size={13} className="text-slate-300" />
                  {totalCourses} {totalCourses === 1 ? "course" : "courses"}
                </span>
              )}
              {course.studentsEnrolled?.length > 0 && (
                <span className="flex items-center gap-1.5 text-xs font-bold text-slate-400">
                  <Users size={13} className="text-slate-300" />
                  {course.studentsEnrolled.length.toLocaleString()} students
                </span>
              )}
            </div>
          </div>
        </div>

        {bio && (
          <div className="mt-6 pt-6 border-t border-slate-100">
            <p className="text-sm font-medium text-slate-500 leading-relaxed">{bio}</p>
          </div>
        )}
      </div>
    </motion.div>
  )
}