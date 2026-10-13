import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import { HiArrowRight, HiPlay } from "react-icons/hi2";
import { getEnrolledCourse } from "../../../services/operations/profileApi";

const EASE = [0.23, 1, 0.32, 1];

const display = "font-['Space_Grotesk',ui-sans-serif,system-ui,sans-serif]";
const mono = "font-['JetBrains_Mono',ui-monospace,monospace]";

const GRAIN = `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.8' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>")`;

const outline = { WebkitTextStroke: "1px rgba(243,236,220,0.3)" };

const listV = { hidden: {}, show: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } } };
const rowV = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.85, ease: EASE } },
};

const pad = (n) => String(n).padStart(2, "0");

const Skeleton = () => (
  <div className="flex animate-pulse flex-col gap-5 rounded-3xl border border-white/[0.06] bg-white/[0.03] p-5 sm:flex-row sm:items-center">
    <div className="h-24 w-full shrink-0 rounded-2xl bg-white/[0.06] sm:w-40" />
    <div className="flex-1 space-y-3">
      <div className="h-4 w-2/3 rounded-full bg-white/[0.08]" />
      <div className="h-3 w-full rounded-full bg-white/[0.05]" />
    </div>
    <div className="h-11 w-44 shrink-0 rounded-full bg-white/[0.06]" />
  </div>
);

const EnrolledCourse = () => {
  const { enrolledCourses, loading } = useSelector((state) => state.profile);
  const { token } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const reduce = useReducedMotion();

  useEffect(() => {
    if (token) {
      dispatch(getEnrolledCourse(token));
    }
  }, [dispatch, token]);

  const count = enrolledCourses?.length ?? 0;

  return (
    <div className="relative w-full min-h-[calc(100vh-120px)] px-5 py-8 sm:px-8 sm:py-10 lg:px-12 lg:py-12">
      {/* header */}
      <div className="mb-10 flex items-end justify-between gap-6 border-b border-white/[0.07] pb-8">
        <div>
          <div className="flex items-center gap-3">
            <span className="h-px w-8 bg-[#ffb454]" />
            <p className={`text-[11px] uppercase tracking-[0.25em] text-zinc-500 ${mono}`}>
              Dashboard · your library
            </p>
          </div>
          <h1
            className={`mt-5 text-3xl font-semibold leading-[1.05] tracking-tight text-[#f3ece0] sm:text-4xl ${display}`}
          >
            Enrolled courses<span className="text-[#ffb454]">.</span>
          </h1>
          <p className="mt-3 max-w-md text-sm leading-relaxed text-zinc-500">
            Track your active learning progress and resume lectures.
          </p>
        </div>

        {!loading && count > 0 && (
          <div className="text-right">
            <p className={`text-4xl font-semibold tabular-nums text-[#ffb454] sm:text-5xl ${display}`}>
              {pad(count)}
            </p>
            <p className={`mt-1 text-[11px] uppercase tracking-[0.2em] text-zinc-600 ${mono}`}>
              {count === 1 ? "Course" : "Courses"}
            </p>
          </div>
        )}
      </div>

      {loading ? (
        <div className="flex flex-col gap-4" role="status" aria-label="Loading courses">
          {[1, 2, 3].map((index) => (
            <Skeleton key={index} />
          ))}
        </div>
      ) : !enrolledCourses || enrolledCourses.length === 0 ? (
        <div className="relative flex min-h-[280px] flex-col items-center justify-center overflow-hidden rounded-3xl border border-dashed border-[#ffb454]/30 px-8 py-16 text-center">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-[0.06] mix-blend-overlay"
            style={{ backgroundImage: GRAIN }}
          />
          <p className={`relative text-2xl font-semibold text-[#f3ece0] ${display}`}>
            You haven't enrolled in any courses yet
          </p>
          <p className="relative mt-2 text-sm text-zinc-500">
            Explore CodevolveX catalog courses to start learning.
          </p>
          <button
            type="button"
            onClick={() => navigate("/catalogue")}
            className="group relative mt-8 inline-flex cursor-pointer items-center gap-2 rounded-full bg-[#ffb454] px-7 py-3 text-sm font-semibold text-[#1d1a16] transition-all duration-500 hover:bg-[#ffc272] active:scale-[0.98]"
          >
            Explore catalogue
            <HiArrowRight className="h-4 w-4 transition-transform duration-500 group-hover:translate-x-1" />
          </button>
        </div>
      ) : (
        <motion.ul
          variants={listV}
          initial={reduce ? false : "hidden"}
          animate="show"
          className="flex flex-col gap-4"
        >
          {enrolledCourses.map((course, i) => (
            <motion.li
              key={course._id}
              variants={rowV}
              className="group relative flex flex-col gap-5 overflow-hidden rounded-3xl border border-white/[0.08] bg-[#14130f] p-5 transition-all duration-500 hover:-translate-y-1 hover:border-[#ffb454]/40 sm:flex-row sm:items-center sm:justify-between"
            >
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0 opacity-[0.06] mix-blend-overlay"
                style={{ backgroundImage: GRAIN }}
              />

              <div className="relative flex min-w-0 flex-1 flex-col gap-5 sm:flex-row sm:items-center">
                {/* thumbnail */}
                <div className="relative aspect-[16/10] w-full shrink-0 overflow-hidden rounded-2xl bg-white/5 sm:aspect-auto sm:h-24 sm:w-40">
                  <img
                    src={course.thumbnail}
                    alt={course.courseName}
                    className="h-full w-full object-cover opacity-80 saturate-[0.7] transition-all duration-[1200ms] ease-out group-hover:scale-[1.06] group-hover:opacity-100 group-hover:saturate-100"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#14130f]/80 via-transparent to-transparent" />
                  <span
                    className={`absolute bottom-1 left-3 text-3xl font-semibold leading-none text-transparent ${display}`}
                    style={outline}
                  >
                    {pad(i + 1)}
                  </span>
                  <span className="absolute right-2.5 top-2.5 flex h-8 w-8 scale-75 items-center justify-center rounded-full bg-[#ffb454] text-[#1d1a16] opacity-0 transition-all duration-500 group-hover:scale-100 group-hover:opacity-100">
                    <HiPlay className="h-3.5 w-3.5 translate-x-px" />
                  </span>
                </div>

                {/* text */}
                <div className="min-w-0">
                  <h3
                    className={`line-clamp-1 text-lg font-semibold tracking-tight text-[#f3ece0] transition-colors duration-500 group-hover:text-[#ffb454] ${display}`}
                  >
                    {course.courseName}
                  </h3>
                  <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-zinc-500 sm:max-w-md">
                    {course.courseDescription}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => navigate(`/dashboard/view-courses/${course._id}`)}
                className="group/btn relative flex w-full shrink-0 cursor-pointer items-center justify-center gap-2 rounded-full border border-white/15 px-6 py-3 text-sm text-zinc-300 transition-all duration-500 hover:border-[#ffb454] hover:bg-[#ffb454] hover:text-[#1d1a16] active:scale-[0.98] sm:w-auto"
              >
                Resume learning
                <HiArrowRight className="h-4 w-4 transition-transform duration-500 group-hover/btn:translate-x-1" />
              </button>
            </motion.li>
          ))}
        </motion.ul>
      )}
    </div>
  );
};

export default EnrolledCourse;