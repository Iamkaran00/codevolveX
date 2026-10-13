import React, { useState, useEffect, useMemo } from "react";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";
import { HiStar, HiArrowRight, HiArrowUpRight } from "react-icons/hi2";
import {
  getAllCourses,
  getAverageRating,
} from "../../../services/operations/courseApi";
import { useNavigate } from "react-router-dom";

const EASE = [0.23, 1, 0.32, 1];

const display = "font-['Space_Grotesk',ui-sans-serif,system-ui,sans-serif]";
const mono = "font-['JetBrains_Mono',ui-monospace,monospace]";

const GRAIN = `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.8' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>")`;

const gridV = { hidden: {}, show: { transition: { staggerChildren: 0.1 } } };
const cardV = {
  hidden: { opacity: 0, y: 26 },
  show: { opacity: 1, y: 0, transition: { duration: 0.95, ease: EASE } },
};

const outline = { WebkitTextStroke: "1px rgba(243,236,220,0.5)" };
const clamp2 = {
  display: "-webkit-box",
  WebkitLineClamp: 2,
  WebkitBoxOrient: "vertical",
  overflow: "hidden",
  minHeight: "2.75em",
};

const idOf = (v) => (typeof v === "string" ? v : v?._id ?? String(v));
const rankLabel = (i) => String(i + 1).padStart(2, "0");

/* ------------------------------------------------------------------ */
/*  Pieces                                                             */
/* ------------------------------------------------------------------ */

const Rating = ({ value }) =>
  value > 0 ? (
    <span className="inline-flex items-center gap-1.5 text-sm text-zinc-300">
      <HiStar className="text-[#ffb454]" size={15} />
      <span className="tabular-nums">{value.toFixed(1)}</span>
    </span>
  ) : (
    <span className={`text-[11px] uppercase tracking-widest text-zinc-500 ${mono}`}>
      New
    </span>
  );

const CourseCard = ({ course, rank, rating, onOpen }) => {
  const instructor =
    `${course.instructor?.firstName ?? ""} ${course.instructor?.lastName ?? ""}`.trim() ||
    "Expert Instructor";
  const learners = course.studentsEnrolled?.length ?? 0;
  const price = course.price
    ? `₹${Number(course.price).toLocaleString("en-IN")}`
    : "Free";

  const handleKey = (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onOpen();
    }
  };

  return (
    <motion.article
      variants={cardV}
      role="link"
      tabIndex={0}
      onClick={onOpen}
      onKeyDown={handleKey}
      className="group flex h-full cursor-pointer flex-col overflow-hidden rounded-3xl border border-white/[0.08] bg-[#14130f] outline-none transition-all duration-500 hover:-translate-y-1 hover:border-[#ffb454]/40 focus-visible:border-[#ffb454]"
    >
      <div className="relative aspect-[16/10] w-full shrink-0 overflow-hidden bg-white/5">
        <img
          src={course.thumbnail}
          alt={course.courseName}
          className="h-full w-full object-cover opacity-80 saturate-[0.7] transition-all duration-[1200ms] ease-out group-hover:scale-[1.05] group-hover:opacity-100 group-hover:saturate-100"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#14130f] via-transparent to-transparent" />

        <span
          className={`absolute bottom-2 left-5 text-6xl font-semibold leading-none text-transparent ${display}`}
          style={outline}
        >
          {rankLabel(rank)}
        </span>

        {rank === 0 && (
          <span
            className={`absolute right-4 top-4 rounded-full border border-[#ffb454]/40 bg-[#100f0d]/70 px-3 py-1 text-[10px] uppercase tracking-[0.2em] text-[#ffb454] backdrop-blur-sm ${mono}`}
          >
            Most popular
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-6">
        <div className="flex items-center justify-between gap-3">
          <p className={`truncate text-[11px] uppercase tracking-[0.2em] text-zinc-500 ${mono}`}>
            {course.category?.name || "Course"}
          </p>
          <Rating value={rating} />
        </div>

        <h3
          style={clamp2}
          className={`mt-3 text-xl font-semibold leading-snug tracking-tight text-[#f3ece0] transition-colors duration-500 group-hover:text-[#ffb454] ${display}`}
        >
          {course.courseName}
        </h3>
        <p className="mt-1.5 truncate text-sm text-zinc-500">by {instructor}</p>

        <div className="mt-auto flex items-end justify-between gap-4 pt-7">
          <div>
            <p className={`text-2xl font-semibold text-[#f3ece0] ${display}`}>
              {price}
            </p>
            <p className="mt-0.5 h-4 text-xs text-zinc-600">
              {learners > 0 ? `${learners.toLocaleString("en-IN")} learners` : ""}
            </p>
          </div>
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/15 text-zinc-400 transition-all duration-500 group-hover:border-[#ffb454] group-hover:bg-[#ffb454] group-hover:text-[#1d1a16]">
            <HiArrowUpRight size={18} />
          </span>
        </div>
      </div>
    </motion.article>
  );
};

const SkeletonGrid = () => (
  <div className="grid auto-rows-fr grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
    {[0, 1, 2, 3, 4, 5].map((i) => (
      <div
        key={i}
        className="min-h-[380px] animate-pulse rounded-3xl border border-white/[0.06] bg-white/[0.03]"
      />
    ))}
  </div>
);

/* ------------------------------------------------------------------ */
/*  Section                                                            */
/* ------------------------------------------------------------------ */

export const CatalogueSection = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.profile);
  const [courses, setCourses] = useState([]);
  const [ratings, setRatings] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      const coursesData = await getAllCourses();
      setCourses(coursesData ?? []);

      if (coursesData) {
        const ratingMap = {};
        await Promise.all(
          coursesData.map(async (course) => {
            try {
              const avg = await getAverageRating(course._id);
              ratingMap[course._id] =
                typeof avg === "number" && !isNaN(avg) ? avg : 0;
            } catch (err) {
              console.error("Rating fetch failed for", course._id, err);
              ratingMap[course._id] = 0;
            }
          })
        );
        setRatings(ratingMap);
      }
      setLoading(false);
    }
    load();
  }, []);

  // ids of courses this student is already enrolled in (these live in the dashboard)
  const enrolledIds = useMemo(() => {
    const set = new Set();
    if (user?.accountType === "Student") {
      (user?.courses ?? []).forEach((c) => set.add(String(idOf(c))));
    }
    return set;
  }, [user]);

  const isEnrolled = (course) =>
    enrolledIds.has(String(course._id)) ||
    (!!user?._id &&
      (course.studentsEnrolled ?? []).some(
        (s) => String(idOf(s)) === String(user._id)
      ));

  const displayedCourses = useMemo(() => {
    return [...courses]
      .filter((c) => !isEnrolled(c))
      .sort(
        (a, b) =>
          (b.studentsEnrolled?.length ?? 0) - (a.studentsEnrolled?.length ?? 0)
      )
      .slice(0, 6);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [courses, enrolledIds, user?._id]);

  const allEnrolled = courses.length > 0 && displayedCourses.length === 0;

  return (
    <section className="relative overflow-hidden bg-[#100f0d] px-5 py-24 sm:px-8 sm:py-32">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.06] mix-blend-overlay"
        style={{ backgroundImage: GRAIN }}
      />

      <div className="relative mx-auto max-w-7xl">
        {/* header */}
        <div className="mb-14 flex flex-col justify-between gap-8 sm:flex-row sm:items-end">
          <div>
            <div className="flex items-center gap-3">
              <span className="h-px w-8 bg-[#ffb454]" />
              <p className={`text-[11px] uppercase tracking-[0.25em] text-zinc-500 ${mono}`}>
                Popular courses · ranked by learners
              </p>
            </div>
            <h2
              className={`mt-6 text-4xl font-semibold leading-[1.04] tracking-tight text-[#f3ece0] sm:text-6xl ${display}`}
            >
              Build skills
              <br />
              that matter<span className="text-[#ffb454]">.</span>
            </h2>
          </div>

          <button
            onClick={() => navigate("/catalogue")}
            className="group inline-flex items-center gap-2 self-start rounded-full border border-white/15 px-6 py-3 text-sm text-zinc-300 transition-all duration-500 hover:border-[#ffb454]/60 hover:bg-[#ffb454]/10 hover:text-[#ffb454] sm:self-auto"
          >
            See all courses
            <HiArrowRight className="transition-transform duration-500 group-hover:translate-x-1" />
          </button>
        </div>

        {/* body */}
        {loading ? (
          <SkeletonGrid />
        ) : courses.length === 0 ? (
          <div className="rounded-3xl border border-white/[0.08] bg-white/[0.02] px-8 py-20 text-center">
            <p className={`text-2xl font-semibold text-[#f3ece0] ${display}`}>
              No courses yet
            </p>
            <p className="mt-2 text-zinc-500">
              New courses are on the way. Check back soon.
            </p>
          </div>
        ) : allEnrolled ? (
          <div className="rounded-3xl border border-white/[0.08] bg-white/[0.02] px-8 py-20 text-center">
            <p className={`text-2xl font-semibold text-[#f3ece0] ${display}`}>
              You're in every popular course
            </p>
            <p className="mt-2 text-zinc-500">
              Pick up right where you left off.
            </p>
            <button
              onClick={() => navigate("/dashboard/enrolled-courses")}
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-[#ffb454] px-7 py-3 text-sm font-semibold text-[#1d1a16] transition-all duration-500 hover:bg-[#ffc272]"
            >
              Go to my dashboard
              <HiArrowRight />
            </button>
          </div>
        ) : (
          <motion.div
            variants={gridV}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-80px" }}
            className="grid auto-rows-fr grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
          >
            {displayedCourses.map((course, i) => (
              <CourseCard
                key={course._id}
                course={course}
                rank={i}
                rating={ratings[course._id] ?? 0}
                onOpen={() => navigate(`/catalogue/${course._id}`)}
              />
            ))}
          </motion.div>
        )}
      </div>
    </section>
  );
};