import React, { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { FiEdit2, FiSearch } from "react-icons/fi";
import { RiDeleteBin6Line } from "react-icons/ri";
import { HiArrowRight } from "react-icons/hi2";
import { TbFileCode } from "react-icons/tb";

import { fetchInstructorCourses, deleteCourse } from "../../../../services/operations/courseApi";
import { formatDate } from "../../../../services/formateDate";
import { COURSE_STATUS } from "../../../../utils/constants";
import ConfirmationModal from "../../../common/ConfirmationModal";
import SpotlightCard from "../../../common/Spotlight";

/* ---------- design tokens (shared with the hero) ---------- */
const EASE = [0.23, 1, 0.32, 1];
const display = "font-['Space_Grotesk',ui-sans-serif,system-ui,sans-serif]";
const mono = "font-['JetBrains_Mono',ui-monospace,monospace]";
const GRAIN = `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.8' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>")`;

const container = { hidden: {}, show: { transition: { staggerChildren: 0.1, delayChildren: 0.05 } } };
const item = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: EASE } },
};

const ROW = "md:grid md:grid-cols-[minmax(0,1fr)_88px_88px_112px_92px] md:items-center md:gap-4";
const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ffb454]/70 focus-visible:ring-offset-2 focus-visible:ring-offset-[#100f0d]";

/* ---------- small pieces ---------- */
const SkeletonRow = () => (
  <div className="flex items-center gap-5 rounded-2xl border border-white/[0.07] bg-white/[0.02] p-5">
    <div className="aspect-[16/10] w-[140px] shrink-0 animate-pulse rounded-xl bg-white/[0.05]" />
    <div className="flex flex-1 flex-col gap-3">
      <div className="h-5 w-2/3 max-w-[280px] animate-pulse rounded bg-white/[0.05]" />
      <div className="h-4 w-1/2 max-w-[180px] animate-pulse rounded bg-white/[0.05]" />
    </div>
  </div>
);

const StatusPill = ({ status }) =>
  status === COURSE_STATUS.DRAFT ? (
    <span className="inline-flex items-center gap-2 rounded-full border border-white/15 px-3 py-1 text-xs text-zinc-400">
      <span className="h-1.5 w-1.5 rounded-full bg-zinc-600" />
      Draft
    </span>
  ) : (
    <span className="inline-flex items-center gap-2 rounded-full border border-[#ffb454]/40 bg-[#ffb454]/10 px-3 py-1 text-xs text-[#ffb454]">
      <span className="h-1.5 w-1.5 rounded-full bg-[#ffb454]" />
      Published
    </span>
  );

/* ---------- page ---------- */
export default function MyCourses() {
  const { token } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const reduce = useReducedMotion();

  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [confirmationModal, setConfirmationModal] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");

  const loadCourses = async () => {
    setLoading(true);
    try {
      const result = await fetchInstructorCourses(token);
      if (result) setCourses(result);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) loadCourses();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const handleDelete = async (courseId) => {
    try {
      await deleteCourse({ courseId }, token);
      await loadCourses();
    } finally {
      setConfirmationModal(null);
    }
  };

  const askDelete = (course) =>
    setConfirmationModal({
      text1: `Delete “${course.courseName}”?`,
      text2: "This can't be undone. The course and all its content will be removed.",
      btn1Text: "Delete",
      btn2Text: "Cancel",
      btn1Handler: () => handleDelete(course._id),
      btn2Handler: () => setConfirmationModal(null),
    });

  const filteredCourses = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return courses.filter((c) => {
      const matchesSearch =
        c.courseName.toLowerCase().includes(q) || (c.courseDescription || "").toLowerCase().includes(q);
      const matchesStatus = filterStatus === "All" || c.status === filterStatus;
      return matchesSearch && matchesStatus;
    });
  }, [courses, searchQuery, filterStatus]);

  const facts = useMemo(
    () => [
      ["Courses", courses.length],
      ["Students", courses.reduce((n, c) => n + (c.studentsEnrolled?.length || 0), 0)],
      ["Published", courses.filter((c) => c.status === COURSE_STATUS.PUBLISHED).length],
    ],
    [courses]
  );

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-[#100f0d] pb-24 pt-10">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.06] mix-blend-overlay"
        style={{ backgroundImage: GRAIN }}
      />

      <motion.div
        variants={container}
        initial={reduce ? false : "hidden"}
        animate="show"
        className="relative mx-auto flex w-full max-w-7xl flex-col gap-10 px-4 sm:px-6 lg:px-8"
      >
        {/* header */}
        <motion.div variants={item} className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className={`text-4xl font-semibold tracking-tight text-[#f3ece0] sm:text-5xl ${display}`}>
              Your courses
            </h1>
            <p className="mt-3 max-w-md text-base leading-relaxed text-zinc-400">
              Create, edit and publish the courses students see in the catalogue.
            </p>
          </div>

          <button
            onClick={() => navigate("/dashboard/add-course")}
            className={`group flex shrink-0 cursor-pointer items-center justify-center gap-2 rounded-full bg-[#ffb454] px-7 py-3.5 text-sm font-semibold text-[#1d1a16] transition-all duration-500 hover:bg-[#ffc272] active:scale-[0.98] ${focusRing}`}
          >
            New course
            <HiArrowRight className="h-4 w-4 transition-transform duration-500 group-hover:translate-x-1" />
          </button>
        </motion.div>

        {/* quick facts */}
        <motion.dl
          variants={item}
          className="grid grid-cols-3 gap-6 border-y border-white/[0.07] py-6"
        >
          {facts.map(([label, value]) => (
            <div key={label}>
              <dd className={`text-3xl font-semibold tabular-nums text-[#f3ece0] sm:text-4xl ${display}`}>
                {loading ? "–" : value}
              </dd>
              <dt className={`mt-1 text-xs text-zinc-500 ${mono}`}>{label}</dt>
            </div>
          ))}
        </motion.dl>

        {/* controls */}
        <motion.div variants={item} className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="relative w-full max-w-lg">
            <FiSearch className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-lg text-zinc-600" />
            <input
              type="text"
              aria-label="Search courses"
              placeholder="Search by title or keyword"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-full border border-white/10 bg-white/[0.03] py-3 pl-11 pr-4 text-sm text-[#f3ece0] outline-none transition-colors duration-300 placeholder:text-zinc-600 focus:border-[#ffb454]/60"
            />
          </div>

          <div role="tablist" aria-label="Filter by status" className="flex shrink-0 items-center rounded-full border border-white/10 p-1">
            {["All", COURSE_STATUS.PUBLISHED, COURSE_STATUS.DRAFT].map((status) => {
              const active = filterStatus === status;
              return (
                <button
                  key={status}
                  role="tab"
                  aria-selected={active}
                  onClick={() => setFilterStatus(status)}
                  className={`relative cursor-pointer whitespace-nowrap rounded-full px-5 py-2 text-xs font-medium transition-colors duration-300 ${focusRing} ${
                    active ? "text-[#1d1a16]" : "text-zinc-400 hover:text-[#f3ece0]"
                  }`}
                >
                  {active && (
                    <motion.span
                      layoutId="status-pill"
                      transition={{ duration: reduce ? 0 : 0.5, ease: EASE }}
                      className="absolute inset-0 rounded-full bg-[#ffb454]"
                    />
                  )}
                  <span className="relative">{status}</span>
                </button>
              );
            })}
          </div>
        </motion.div>

        {/* list */}
        <motion.div variants={item} className="flex flex-col gap-3">
          <div className={`hidden px-5 pb-1 text-xs text-zinc-600 ${ROW} ${mono}`}>
            <span>Course</span>
            <span className="text-center">Students</span>
            <span className="text-center">Price</span>
            <span className="text-center">Status</span>
            <span />
          </div>

          {loading ? (
            [1, 2, 3].map((i) => <SkeletonRow key={i} />)
          ) : filteredCourses.length === 0 ? (
            <div className="flex flex-col items-center rounded-3xl border border-dashed border-white/15 px-6 py-24 text-center">
              <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.03]">
                <TbFileCode className="text-2xl text-[#ffb454]" />
              </div>
              <p className={`text-xl font-semibold tracking-tight text-[#f3ece0] ${display}`}>
                {searchQuery || filterStatus !== "All" ? "No matching courses" : "No courses yet"}
              </p>
              <p className="mt-2 max-w-sm text-sm leading-relaxed text-zinc-500">
                {searchQuery || filterStatus !== "All"
                  ? "Clear the search or switch the status filter to see more."
                  : "Create your first course and it will show up here."}
              </p>
            </div>
          ) : (
            <AnimatePresence mode="popLayout" initial={false}>
              {filteredCourses.map((course) => (
                <motion.div
                  key={course._id}
                  layout={!reduce}
                  initial={reduce ? false : { opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.97 }}
                  transition={{ duration: 0.6, ease: EASE }}
                  className="group"
                >
                  <SpotlightCard
                    className="rounded-2xl border border-white/[0.07] bg-white/[0.02] transition-colors duration-500 hover:border-[#ffb454]/30"
                    spotlightColor="rgba(255, 180, 84, 0.10)"
                  >
                    <div className={`relative z-10 flex flex-col gap-5 p-5 ${ROW}`}>
                      {/* course */}
                      <div className="flex min-w-0 items-center gap-5">
                        <div className="relative shrink-0 overflow-hidden rounded-xl bg-white/[0.04]">
                          <img
                            src={course.thumbnail}
                            alt=""
                            loading="lazy"
                            className="aspect-[16/10] w-[120px] object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04] sm:w-[140px]"
                          />
                          <div className="absolute inset-0 rounded-xl ring-1 ring-inset ring-white/10" />
                        </div>
                        <div className="min-w-0">
                          <h3 className={`truncate text-[17px] font-semibold tracking-tight text-[#f3ece0] ${display}`}>
                            {course.courseName}
                          </h3>
                          <p className="mt-1 line-clamp-1 text-sm text-zinc-500">{course.courseDescription}</p>
                          <p className={`mt-3 text-xs text-zinc-600 ${mono}`}>
                            Created {formatDate(course.createdAt)}
                          </p>
                        </div>
                      </div>

                      {/* numbers */}
                      <p className={`hidden text-center text-base tabular-nums text-[#f3ece0] md:block ${display}`}>
                        {course.studentsEnrolled?.length || 0}
                      </p>
                      <p className={`hidden text-center text-base tabular-nums text-[#f3ece0] md:block ${display}`}>
                        ₹{course.price}
                      </p>
                      <div className="hidden justify-center md:flex">
                        <StatusPill status={course.status} />
                      </div>

                      {/* mobile meta + actions */}
                      <div className="flex items-center justify-between gap-3 md:justify-end">
                        <div className="flex items-center gap-3 md:hidden">
                          <StatusPill status={course.status} />
                          <span className={`text-xs text-zinc-500 ${mono}`}>₹{course.price}</span>
                        </div>
                        <div className="flex gap-2 transition-opacity duration-300 md:opacity-0 md:group-focus-within:opacity-100 md:group-hover:opacity-100">
                          <button
                            onClick={() => navigate(`/dashboard/edit-course/${course._id}`)}
                            aria-label={`Edit ${course.courseName}`}
                            title="Edit course"
                            className={`flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-white/10 text-zinc-400 transition-colors duration-300 hover:border-[#ffb454]/50 hover:text-[#ffb454] active:scale-95 ${focusRing}`}
                          >
                            <FiEdit2 size={16} />
                          </button>
                          <button
                            onClick={() => askDelete(course)}
                            aria-label={`Delete ${course.courseName}`}
                            title="Delete course"
                            className={`flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-white/10 text-zinc-400 transition-colors duration-300 hover:border-red-400/50 hover:text-red-400 active:scale-95 ${focusRing}`}
                          >
                            <RiDeleteBin6Line size={16} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </SpotlightCard>
                </motion.div>
              ))}
            </AnimatePresence>
          )}
        </motion.div>
      </motion.div>

      {confirmationModal && <ConfirmationModal modalData={confirmationModal} />}
    </div>
  );
}