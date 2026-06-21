import React from "react";
import { motion } from "framer-motion";
import { BadgeCheck, BookOpen, Users, Award } from "lucide-react";

export default function CourseInstructor({ course }) {
  const instructor = course.instructor;
  if (!instructor) return null;

  const instructorName = `${instructor.firstName ?? ""} ${instructor.lastName ?? ""}`.trim() || "Expert Instructor";
  const bio = instructor.additionalDetails?.about ?? "";
  const image = instructor.image ?? null;
  const totalCourses = instructor.courses?.length ?? 0;
  const initial = instructorName.charAt(0).toUpperCase();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="bg-white rounded-3xl border border-indigo-50 shadow-[0_4px_24px_-8px_rgba(79,70,229,0.08)] p-8"
    >
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-lg font-semibold text-indigo-950">About the Instructor</h2>
        <div className="flex items-center gap-1.5 px-3 py-1 bg-violet-50 text-violet-700 rounded-full">
          <Award size={14} />
          <span className="text-[11px] font-bold uppercase tracking-wider">Expert</span>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-6">
        {/* Avatar Section */}
        <div className="relative shrink-0">
          <div className="w-24 h-24 rounded-2xl overflow-hidden bg-gradient-to-tr from-indigo-100 to-violet-100 flex items-center justify-center border-4 border-white shadow-lg">
            {image ? (
              <img src={image} alt={instructorName} className="w-full h-full object-cover" />
            ) : (
              <span className="text-3xl font-semibold text-indigo-600">{initial}</span>
            )}
          </div>
          <div className="absolute -bottom-1 -right-1 w-7 h-7 bg-white rounded-full flex items-center justify-center">
            <BadgeCheck size={20} className="text-indigo-600" />
          </div>
        </div>

        {/* Details Section */}
        <div className="flex-1">
          <h3 className="text-2xl font-semibold text-indigo-950">{instructorName}</h3>
          <p className="text-sm font-medium text-indigo-500 mb-4">Verified Professional Instructor</p>

          <div className="flex items-center gap-6">
            {totalCourses > 0 && (
              <div className="flex items-center gap-2">
                <BookOpen size={16} className="text-indigo-300" />
                <span className="text-sm font-semibold text-slate-700">{totalCourses} <span className="text-slate-400 font-normal">Courses</span></span>
              </div>
            )}
            {course.studentsEnrolled?.length > 0 && (
              <div className="flex items-center gap-2">
                <Users size={16} className="text-indigo-300" />
                <span className="text-sm font-semibold text-slate-700">{course.studentsEnrolled.length.toLocaleString()} <span className="text-slate-400 font-normal">Students</span></span>
              </div>
            )}
          </div>
        </div>
      </div>

      {bio && (
        <div className="mt-8 pt-8 border-t border-slate-100">
          <p className="text-[15px] leading-relaxed text-slate-600">
            {bio}
          </p>
        </div>
      )}
    </motion.div>
  );
}