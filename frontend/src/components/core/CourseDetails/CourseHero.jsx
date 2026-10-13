import React, { useEffect, useRef, useState } from "react";
import { animate, motion, useInView, useReducedMotion } from "framer-motion";
import { Users, Clock, BookOpen, BarChart2 } from "lucide-react";

const EASE = [0.23, 1, 0.32, 1];

const display = "font-['Space_Grotesk',ui-sans-serif,system-ui,sans-serif]";
const mono = "font-['JetBrains_Mono',ui-monospace,monospace]";

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.05 } },
};
const item = {
  hidden: { opacity: 0, y: 22 },
  show: { opacity: 1, y: 0, transition: { duration: 0.95, ease: EASE } },
};

const CountUp = ({ to }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  const reduce = useReducedMotion();
  const [n, setN] = useState(reduce ? to : 0);

  useEffect(() => {
    if (!inView || reduce) {
      if (reduce) setN(to);
      return undefined;
    }
    const controls = animate(0, to, {
      duration: 1.4,
      ease: EASE,
      onUpdate: (v) => setN(Math.round(v)),
    });
    return () => controls.stop();
  }, [inView, to, reduce]);

  return <span ref={ref}>{n.toLocaleString("en-IN")}</span>;
};

export default function CourseHero({ course, totalDuration }) {
  const instructorName = course.instructor
    ? `${course.instructor.firstName ?? ""} ${course.instructor.lastName ?? ""}`.trim() ||
      "Expert Instructor"
    : "Expert Instructor";

  const enrolled = course.studentsEnrolled?.length ?? 0;
  const totalLectures =
    course.courseContent?.reduce(
      (sum, s) => sum + (s.subSection?.length ?? s.SubSection?.length ?? 0),
      0
    ) ?? 0;

  const stats = [
    { Icon: BarChart2, label: "Sections", value: course.courseContent?.length ?? 0 },
    { Icon: BookOpen, label: "Lessons", value: totalLectures },
    { Icon: Clock, label: "Duration", value: totalDuration },
    { Icon: Users, label: "Learners", value: enrolled },
  ];

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-10">
      {/* eyebrow */}
      <motion.div variants={item} className="flex items-center gap-3">
        <span className="h-px w-8 bg-[#ffb454]" />
        <p className={`text-[11px] uppercase tracking-[0.25em] text-zinc-500 ${mono}`}>
          {course.category?.name || "Course"}
        </p>
      </motion.div>

      {/* title + description */}
      <div className="space-y-6">
        <motion.h1
          variants={item}
          className={`text-4xl font-semibold leading-[1.04] tracking-tight text-[#f3ece0] sm:text-5xl lg:text-6xl ${display}`}
        >
          {course.courseName}
          <span className="text-[#ffb454]">.</span>
        </motion.h1>
        <motion.p
          variants={item}
          className="max-w-2xl text-lg leading-relaxed text-zinc-400"
        >
          {course.courseDescription}
        </motion.p>
      </div>

      {/* instructor */}
      <motion.div
        variants={item}
        className="flex items-center gap-4 border-y border-white/[0.07] py-5"
      >
        <span className="h-11 w-11 shrink-0 overflow-hidden rounded-full ring-1 ring-[#ffb454]/40">
          {course.instructor?.image ? (
            <img
              src={course.instructor.image}
              alt={instructorName}
              className="h-full w-full object-cover"
            />
          ) : (
            <span
              className={`flex h-full w-full items-center justify-center bg-[#2a2112] text-sm font-semibold text-[#ffb454] ${display}`}
            >
              {instructorName.charAt(0)}
            </span>
          )}
        </span>
        <div className="min-w-0">
          <p className={`text-[10px] uppercase tracking-[0.2em] text-zinc-600 ${mono}`}>
            Taught by
          </p>
          <p className={`mt-0.5 truncate text-base font-medium text-[#f3ece0] ${display}`}>
            {instructorName}
          </p>
        </div>
      </motion.div>

      {/* stats */}
      <motion.div
        variants={item}
        className="grid grid-cols-2 overflow-hidden rounded-3xl border border-white/[0.08] bg-[#14130f] md:grid-cols-4"
      >
        {stats.map(({ Icon, label, value }, i) => (
          <div
            key={label}
            className={`group relative p-6 transition-colors duration-500 hover:bg-white/[0.02] ${
              i % 2 === 1 ? "border-l border-white/[0.07]" : ""
            } ${i > 1 ? "border-t border-white/[0.07] md:border-t-0" : ""} ${
              i > 0 ? "md:border-l md:border-white/[0.07]" : ""
            }`}
          >
            <Icon
              size={18}
              className="text-zinc-600 transition-colors duration-500 group-hover:text-[#ffb454]"
            />
            <p
              className={`mt-6 text-3xl font-semibold tabular-nums tracking-tight text-[#f3ece0] ${display}`}
            >
              {typeof value === "number" ? <CountUp to={value} /> : value}
            </p>
            <p className={`mt-1.5 text-[10px] uppercase tracking-[0.2em] text-zinc-500 ${mono}`}>
              {label}
            </p>
          </div>
        ))}
      </motion.div>
    </motion.div>
  );
}