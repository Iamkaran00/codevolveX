import React from "react";
import { BadgeCheck, BookOpen, Users, Award } from "lucide-react";

const display = "font-['Space_Grotesk',ui-sans-serif,system-ui,sans-serif]";
const mono = "font-['JetBrains_Mono',ui-monospace,monospace]";

export default function CourseInstructor({ course }) {
  const instructor = course.instructor;
  if (!instructor) return null;

  const instructorName =
    `${instructor.firstName ?? ""} ${instructor.lastName ?? ""}`.trim() ||
    "Expert Instructor";
  const bio = instructor.additionalDetails?.about ?? "";
  const image = instructor.image ?? null;
  const totalCourses = instructor.courses?.length ?? 0;
  const totalStudents = course.studentsEnrolled?.length ?? 0;
  const initial = instructorName.charAt(0).toUpperCase();

  const stats = [
    totalCourses > 0 && { Icon: BookOpen, value: totalCourses, label: "Courses" },
    totalStudents > 0 && { Icon: Users, value: totalStudents, label: "Learners" },
  ].filter(Boolean);

  return (
    <section className="group relative overflow-hidden rounded-3xl border border-white/[0.08] bg-[#14130f] p-7 transition-colors duration-500 hover:border-[#ffb454]/30 sm:p-9">
      <div
        aria-hidden
        className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-[#ffb454]/[0.06] blur-3xl"
      />

      <div className="relative flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="h-px w-8 bg-[#ffb454]" />
          <h2 className={`text-[11px] uppercase tracking-[0.25em] text-zinc-500 ${mono}`}>
            About the instructor
          </h2>
        </div>
        <span
          className={`flex items-center gap-1.5 rounded-full border border-[#ffb454]/40 px-3 py-1 text-[10px] uppercase tracking-[0.2em] text-[#ffb454] ${mono}`}
        >
          <Award size={12} /> Expert
        </span>
      </div>

      <div className="relative mt-9 flex flex-col gap-7 sm:flex-row sm:items-center">
        {/* avatar */}
        <div className="relative shrink-0">
          <div className="flex h-28 w-28 items-center justify-center overflow-hidden rounded-3xl bg-[#2a2112] ring-1 ring-[#ffb454]/40">
            {image ? (
              <img
                src={image}
                alt={instructorName}
                className="h-full w-full object-cover saturate-[0.85] transition-all duration-[1200ms] ease-out group-hover:scale-105 group-hover:saturate-100"
              />
            ) : (
              <span className={`text-4xl font-semibold text-[#ffb454] ${display}`}>
                {initial}
              </span>
            )}
          </div>
          <span className="absolute -bottom-2 -right-2 flex h-8 w-8 items-center justify-center rounded-full border border-[#ffb454]/50 bg-[#14130f]">
            <BadgeCheck size={18} className="text-[#ffb454]" />
          </span>
        </div>

        {/* details */}
        <div className="min-w-0 flex-1">
          <h3
            className={`text-3xl font-semibold tracking-tight text-[#f3ece0] ${display}`}
          >
            {instructorName}
            <span className="text-[#ffb454]">.</span>
          </h3>
          <p className={`mt-2 text-[11px] uppercase tracking-[0.2em] text-zinc-500 ${mono}`}>
            Verified professional instructor
          </p>

          {stats.length > 0 && (
            <div className="mt-6 flex flex-wrap gap-x-10 gap-y-4">
              {stats.map(({ Icon, value, label }) => (
                <div key={label} className="flex items-center gap-3">
                  <Icon size={16} className="text-zinc-600" />
                  <p className="text-sm text-zinc-500">
                    <span
                      className={`mr-1.5 text-xl font-semibold tabular-nums text-[#f3ece0] ${display}`}
                    >
                      {value.toLocaleString("en-IN")}
                    </span>
                    {label}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {bio && (
        <div className="relative mt-9 border-t border-white/[0.07] pt-8">
          <p className="border-l-2 border-[#ffb454]/60 pl-5 text-[15px] leading-relaxed text-zinc-400">
            {bio}
          </p>
        </div>
      )}
    </section>
  );
}