import React, { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Pencil, Trash2, ChevronLeft, ChevronRight, BookOpen, Users } from "lucide-react";

import { formatDate } from "../../../../services/formateDate";
import { deleteCourse, fetchInstructorCourses } from "../../../../services/operations/courseApi";
import { COURSE_STATUS } from "../../../../utils/constants";
import ConfirmationModal from "../../../common/ConfirmationModal";

const EASE = [0.23, 1, 0.32, 1];

const display = "font-['Space_Grotesk',ui-sans-serif,system-ui,sans-serif]";
const mono = "font-['JetBrains_Mono',ui-monospace,monospace]";

const PAGE_SIZE = 5;

const FILTERS = [
  ["all", "All"],
  ["published", "Published"],
  ["draft", "Drafts"],
];

const SORTS = [
  ["newest", "Newest"],
  ["price-high", "Price: high"],
  ["price-low", "Price: low"],
];

const isDraft = (c) => c.status === COURSE_STATUS.DRAFT;

function StatusPill({ draft }) {
  return draft ? (
    <span className="inline-flex items-center gap-2 rounded-full border border-[#ffb454]/40 px-3 py-1 text-xs text-[#ffb454]">
      <span className="h-1.5 w-1.5 rounded-full border border-[#ffb454]" />
      Draft
    </span>
  ) : (
    <span className="inline-flex items-center gap-2 rounded-full border border-[#a8c48f]/40 px-3 py-1 text-xs text-[#a8c48f]">
      <span className="h-1.5 w-1.5 rounded-full bg-[#a8c48f]" />
      Published
    </span>
  );
}

function Chip({ active, onClick, children }) {
  return (
    <button
      onClick={onClick}
      className={`shrink-0 whitespace-nowrap rounded-full border px-4 py-2 text-sm outline-none transition-all duration-500 focus-visible:ring-2 focus-visible:ring-[#ffb454]/60 ${
        active
          ? "border-[#ffb454] bg-[#ffb454] font-semibold text-[#1d1a16]"
          : "border-white/15 text-zinc-400 hover:border-[#ffb454]/40 hover:text-[#ffb454]"
      }`}
    >
      {children}
    </button>
  );
}

export default function CoursesTable({ courses, setCourses }) {
  const navigate = useNavigate();
  const { token } = useSelector((state) => state.auth);

  const [loading, setLoading] = useState(false);
  const [confirmationModal, setConfirmationModal] = useState(null);
  const [filter, setFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [page, setPage] = useState(0);

  const handleCourseDelete = async (courseId) => {
    setLoading(true);
    await deleteCourse({ courseId }, token);
    const result = await fetchInstructorCourses(token);
    if (result) setCourses(result);
    setConfirmationModal(null);
    setLoading(false);
  };

  const askDelete = (course) =>
    setConfirmationModal({
      text1: "Delete this course?",
      text2: "Its sections, lectures, and student progress will be permanently deleted. This can't be undone.",
      btn1Text: loading ? "Deleting..." : "Delete",
      btn2Text: "Cancel",
      btn1Handler: loading ? () => {} : () => handleCourseDelete(course._id),
      btn2Handler: loading ? () => {} : () => setConfirmationModal(null),
    });

  const all = courses ?? [];

  const counts = useMemo(
    () => ({
      all: all.length,
      published: all.filter((c) => !isDraft(c)).length,
      draft: all.filter(isDraft).length,
    }),
    [all]
  );

  const visible = useMemo(() => {
    const list = all.filter((c) =>
      filter === "all" ? true : filter === "draft" ? isDraft(c) : !isDraft(c)
    );
    return list.sort((a, b) => {
      if (sortBy === "price-high") return (b.price ?? 0) - (a.price ?? 0);
      if (sortBy === "price-low") return (a.price ?? 0) - (b.price ?? 0);
      return new Date(b.createdAt ?? 0).getTime() - new Date(a.createdAt ?? 0).getTime();
    });
  }, [all, filter, sortBy]);

  const pageCount = Math.max(1, Math.ceil(visible.length / PAGE_SIZE));

  // go back to page one when the view changes, and never sit past the last page
  useEffect(() => setPage(0), [filter, sortBy]);
  useEffect(() => {
    if (page > pageCount - 1) setPage(pageCount - 1);
  }, [page, pageCount]);

  const rows = visible.slice(page * PAGE_SIZE, page * PAGE_SIZE + PAGE_SIZE);
  const from = visible.length ? page * PAGE_SIZE + 1 : 0;
  const to = Math.min(visible.length, (page + 1) * PAGE_SIZE);

  return (
    <div className="relative w-full overflow-hidden rounded-3xl border border-white/[0.08] bg-[#14130f]">
      {/* amber line sweeps while a delete is running */}
      {loading && (
        <div className="absolute inset-x-0 top-0 z-10 h-px overflow-hidden bg-white/[0.06]">
          <motion.div
            className="h-full w-1/3 bg-[#ffb454]"
            initial={{ x: "-100%" }}
            animate={{ x: "300%" }}
            transition={{ duration: 1.4, ease: "easeInOut", repeat: Infinity }}
          />
        </div>
      )}

      {/* toolbar */}
      <div className="flex flex-col gap-4 border-b border-white/[0.07] px-6 py-5 lg:flex-row lg:items-center lg:justify-between sm:px-8">
        <div className="flex items-center gap-2 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {FILTERS.map(([key, label]) => (
            <Chip key={key} active={filter === key} onClick={() => setFilter(key)}>
              {label}{" "}
              <span className={`ml-1 text-xs tabular-nums opacity-70 ${mono}`}>{counts[key]}</span>
            </Chip>
          ))}
        </div>

        <div className="flex items-center gap-2 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <span className="mr-1 shrink-0 text-sm text-zinc-600">Sort by</span>
          {SORTS.map(([key, label]) => (
            <Chip key={key} active={sortBy === key} onClick={() => setSortBy(key)}>
              {label}
            </Chip>
          ))}
        </div>
      </div>

      {/* rows */}
      {rows.length === 0 ? (
        <div className="flex flex-col items-center justify-center px-8 py-24 text-center">
          <span className="flex h-16 w-16 items-center justify-center rounded-full border border-white/10">
            <BookOpen size={26} className="text-zinc-500" />
          </span>
          <h3 className={`mt-6 text-2xl font-semibold text-[#f3ece0] ${display}`}>
            {all.length === 0 ? "No courses yet" : "Nothing matches this filter"}
          </h3>
          <p className="mt-2 max-w-md text-zinc-500">
            {all.length === 0
              ? "Create your first course and it will show up here."
              : "Try another filter to see the rest of your courses."}
          </p>
          {all.length > 0 && (
            <button
              onClick={() => setFilter("all")}
              className="mt-8 rounded-full border border-white/15 px-7 py-3 text-sm text-zinc-300 transition-all duration-500 hover:border-[#ffb454]/60 hover:text-[#ffb454]"
            >
              Show all courses
            </button>
          )}
        </div>
      ) : (
        <ul>
          <AnimatePresence mode="popLayout" initial={false}>
            {rows.map((course) => {
              const learners = Array.isArray(course.studentsEnrolled)
                ? course.studentsEnrolled.length
                : null;
              return (
                <motion.li
                  layout="position"
                  key={course._id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.6, ease: EASE }}
                  className="group flex flex-col gap-5 border-b border-white/[0.05] px-6 py-5 transition-colors duration-500 last:border-b-0 hover:bg-white/[0.025] sm:flex-row sm:items-center sm:gap-6 sm:px-8"
                >
                  {/* thumbnail + text */}
                  <div className="flex min-w-0 flex-1 items-center gap-5">
                    <div className="h-[4.5rem] w-28 shrink-0 overflow-hidden rounded-2xl border border-white/10 bg-white/5">
                      {course.thumbnail ? (
                        <img
                          src={course.thumbnail}
                          alt={course.courseName}
                          className="h-full w-full object-cover opacity-80 saturate-[0.7] transition-all duration-[1200ms] ease-out group-hover:scale-[1.05] group-hover:opacity-100 group-hover:saturate-100"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center">
                          <BookOpen size={20} className="text-zinc-700" />
                        </div>
                      )}
                    </div>

                    <div className="min-w-0">
                      <button
                        onClick={() => navigate(`/dashboard/edit-course/${course._id}`)}
                        className={`block max-w-full truncate text-left text-lg font-semibold tracking-tight text-[#f3ece0] outline-none transition-colors duration-500 hover:text-[#ffb454] focus-visible:text-[#ffb454] ${display}`}
                      >
                        {course.courseName}
                      </button>
                      <p className="mt-1 line-clamp-1 max-w-md text-sm text-zinc-500">
                        {course.courseDescription}
                      </p>
                      <p className={`mt-2 flex items-center gap-3 text-xs text-zinc-600 ${mono}`}>
                        <span>Created {formatDate(course.createdAt)}</span>
                        {learners !== null && (
                          <span className="flex items-center gap-1.5">
                            <Users size={12} />
                            {learners.toLocaleString("en-IN")}
                          </span>
                        )}
                      </p>
                    </div>
                  </div>

                  {/* status, price, actions */}
                  <div className="flex items-center justify-between gap-6 sm:justify-end">
                    <StatusPill draft={isDraft(course)} />

                    <p className={`w-20 text-right text-xl font-semibold tabular-nums text-[#f3ece0] ${display}`}>
                      {course.price ? `₹${Number(course.price).toLocaleString("en-IN")}` : "Free"}
                    </p>

                    <div className="flex items-center gap-2">
                      <button
                        disabled={loading}
                        onClick={() => navigate(`/dashboard/edit-course/${course._id}`)}
                        title="Edit course"
                        aria-label={`Edit ${course.courseName}`}
                        className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 text-zinc-400 outline-none transition-all duration-500 hover:border-[#ffb454] hover:bg-[#ffb454] hover:text-[#1d1a16] focus-visible:ring-2 focus-visible:ring-[#ffb454]/60 disabled:pointer-events-none disabled:opacity-40"
                      >
                        <Pencil size={15} />
                      </button>
                      <button
                        disabled={loading}
                        onClick={() => askDelete(course)}
                        title="Delete course"
                        aria-label={`Delete ${course.courseName}`}
                        className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 text-zinc-400 outline-none transition-all duration-500 hover:border-[#e0816f] hover:bg-[#e0816f]/10 hover:text-[#e0816f] focus-visible:ring-2 focus-visible:ring-[#e0816f]/60 disabled:pointer-events-none disabled:opacity-40"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>
                </motion.li>
              );
            })}
          </AnimatePresence>
        </ul>
      )}

      {/* pagination */}
      {visible.length > PAGE_SIZE && (
        <div className="flex items-center justify-between border-t border-white/[0.07] px-6 py-4 sm:px-8">
          <p className={`text-xs tabular-nums text-zinc-500 ${mono}`}>
            {from}–{to} of {visible.length}
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              disabled={page === 0}
              aria-label="Previous page"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 text-zinc-400 outline-none transition-all duration-500 hover:border-[#ffb454]/50 hover:text-[#ffb454] focus-visible:ring-2 focus-visible:ring-[#ffb454]/60 disabled:pointer-events-none disabled:opacity-30"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              onClick={() => setPage((p) => Math.min(pageCount - 1, p + 1))}
              disabled={page >= pageCount - 1}
              aria-label="Next page"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 text-zinc-400 outline-none transition-all duration-500 hover:border-[#ffb454]/50 hover:text-[#ffb454] focus-visible:ring-2 focus-visible:ring-[#ffb454]/60 disabled:pointer-events-none disabled:opacity-30"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}

      {confirmationModal && <ConfirmationModal modalData={confirmationModal} />}
    </div>
  );
}