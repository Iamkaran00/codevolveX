import React, { useEffect, useMemo, useState } from "react"
import { useNavigate } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { motion, AnimatePresence, useReducedMotion } from "framer-motion"
import { ArrowLeft, Check, ChevronDown, Play, Star } from "lucide-react"

import { setActiveLecture } from "../../slices/viewCourse.slice"
import { getReviewsForCourse } from "../../services/operations/courseApi"
import WriteReviewModal from "./WriteReview"

const EASE = [0.23, 1, 0.32, 1]

const display = "font-['Space_Grotesk',ui-sans-serif,system-ui,sans-serif]"
const mono = "font-['JetBrains_Mono',ui-monospace,monospace]"

const GRAIN = `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.8' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>")`

const FOCUS =
  "outline-none focus-visible:ring-1 focus-visible:ring-[#ffb454]/70"

/* ------------------------------------------------------------------ */
/*  Lecture node: one stop on the thread                               */
/* ------------------------------------------------------------------ */

const Node = ({ done, active, reduce }) => {
  if (done) {
    return (
      <span className="relative z-10 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#ffb454]">
        <Check size={12} strokeWidth={3} className="text-[#1d1a16]" />
      </span>
    )
  }
  if (active) {
    return (
      <span className="relative z-10 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-[#ffb454]/70 bg-[#100f0d]">
        {reduce ? (
          <Play size={9} className="translate-x-px fill-[#ffb454] text-[#ffb454]" />
        ) : (
          <motion.span
            animate={{ scale: [1, 1.35, 1], opacity: [1, 0.6, 1] }}
            transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
            className="h-2 w-2 rounded-full bg-[#ffb454]"
          />
        )}
      </span>
    )
  }
  return (
    <span className="relative z-10 h-6 w-6 shrink-0 rounded-full border border-white/15 bg-[#100f0d] transition-colors duration-500 group-hover:border-[#ffb454]/50" />
  )
}

/* ------------------------------------------------------------------ */
/*  Progress strip: one tick per lecture                               */
/* ------------------------------------------------------------------ */

const Strip = ({ flat, completed, activeId }) => {
  if (flat.length === 0) return null

  // too many lectures for ticks to stay legible: fall back to a single bar
  if (flat.length > 48) {
    const pct = (completed.length / flat.length) * 100
    return (
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/10">
        <motion.div
          initial={false}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 1, ease: EASE }}
          className="h-full rounded-full bg-[#ffb454]"
        />
      </div>
    )
  }

  return (
    <div className="flex h-1.5 w-full gap-[3px]" aria-hidden>
      {flat.map((l) => {
        const done = completed.includes(l._id)
        const active = l._id === activeId
        return (
          <span
            key={l._id}
            className={`h-full flex-1 rounded-full transition-colors duration-700 ${
              done ? "bg-[#ffb454]" : active ? "bg-[#ffb454]/40" : "bg-white/10"
            }`}
          />
        )
      })}
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Sidebar                                                            */
/* ------------------------------------------------------------------ */

export default function VideoDetailsSidebar() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const reduce = useReducedMotion()

  const {
    courseSectionData,
    courseEntireData,
    completedLectures,
    activeSectionId,
    activeSubSectionId,
  } = useSelector((state) => state.viewCourse)
  const { user } = useSelector((state) => state.profile)

  const [openSections, setOpenSections] = useState({})
  const [reviewModalOpen, setReviewModalOpen] = useState(false)
  const [hasReviewed, setHasReviewed] = useState(false)
  const [checkingReview, setCheckingReview] = useState(true)

  useEffect(() => {
    if (activeSectionId) {
      setOpenSections((prev) => ({ ...prev, [activeSectionId]: true }))
    }
  }, [activeSectionId])

  useEffect(() => {
    async function checkExistingReview() {
      if (!courseEntireData?._id || !user?._id) {
        setCheckingReview(false)
        return
      }
      const reviews = await getReviewsForCourse(courseEntireData._id)
      const alreadyReviewed = (reviews || []).some(
        (r) => r.user?._id === user._id
      )
      setHasReviewed(alreadyReviewed)
      setCheckingReview(false)
    }
    checkExistingReview()
  }, [courseEntireData?._id, user?._id])

  // every lecture in order, tagged with its section, so "continue" can find the next one
  const flat = useMemo(
    () =>
      (courseSectionData ?? []).flatMap((s) =>
        (s.SubSection ?? []).map((sub) => ({
          _id: sub._id,
          title: sub.title,
          sectionId: s._id,
        }))
      ),
    [courseSectionData]
  )

  if (!courseEntireData) return null

  const total = flat.length
  const doneCount = completedLectures.length
  const pct = total ? Math.round((doneCount / total) * 100) : 0
  const hasWatchedAny = doneCount > 0
  const next = flat.find((l) => !completedLectures.includes(l._id))

  const toggleSection = (id) =>
    setOpenSections((prev) => ({ ...prev, [id]: !prev[id] }))

  const goTo = (sectionId, subSectionId) =>
    dispatch(setActiveLecture({ sectionId, subSectionId }))

  return (
    <aside className="relative flex h-full w-[320px] shrink-0 flex-col overflow-hidden border-r border-white/[0.07] bg-[#100f0d]">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.06] mix-blend-overlay"
        style={{ backgroundImage: GRAIN }}
      />

      {/* ---------------- header ---------------- */}
      <div className="relative shrink-0 border-b border-white/[0.07] px-6 pb-6 pt-6">
        <button
          onClick={() => navigate("/dashboard/enrolled-courses")}
          className={`group mb-7 flex cursor-pointer items-center gap-3 text-sm text-zinc-500 transition-colors duration-500 hover:text-[#ffb454] ${FOCUS} rounded-full`}
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-full border border-white/15 transition-all duration-500 group-hover:-translate-x-1 group-hover:border-[#ffb454]/60">
            <ArrowLeft size={14} />
          </span>
          My courses
        </button>

        <h2
          className={`line-clamp-3 text-xl font-semibold leading-snug tracking-tight text-[#f3ece0] ${display}`}
        >
          {courseEntireData.courseName}
        </h2>

        <div className="mt-6 flex items-end justify-between">
          <p className={`text-4xl font-semibold tabular-nums text-[#ffb454] ${display}`}>
            {pct}
            <span className="ml-0.5 text-xl text-[#ffb454]/60">%</span>
          </p>
          <p className={`pb-1 text-xs tabular-nums text-zinc-500 ${mono}`}>
            {doneCount} / {total} lectures
          </p>
        </div>

        <div className="mt-4">
          <Strip flat={flat} completed={completedLectures} activeId={activeSubSectionId} />
        </div>

        {next && (
          <button
            onClick={() => goTo(next.sectionId, next._id)}
            className={`group mt-6 flex w-full cursor-pointer items-center gap-3 rounded-full bg-[#ffb454] py-2.5 pl-2.5 pr-5 text-left text-[#1d1a16] transition-all duration-500 hover:bg-[#ffc272] active:scale-[0.98] ${FOCUS}`}
          >
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#1d1a16]/10">
              <Play size={13} className="translate-x-px fill-[#1d1a16]" />
            </span>
            <span className="min-w-0">
              <span className="block text-sm font-semibold leading-tight">
                {hasWatchedAny ? "Continue learning" : "Start course"}
              </span>
              <span className="block truncate text-xs leading-tight text-[#1d1a16]/60">
                {next.title}
              </span>
            </span>
          </button>
        )}

        {!checkingReview && (
          <div className="mt-5">
            {hasReviewed ? (
              <p className="flex items-center gap-2 text-sm text-[#ffb454]">
                <Star size={14} className="fill-[#ffb454]" />
                You rated this course
              </p>
            ) : hasWatchedAny ? (
              <button
                onClick={() => setReviewModalOpen(true)}
                className={`group flex cursor-pointer items-center gap-2 rounded-full text-sm text-zinc-400 transition-colors duration-500 hover:text-[#ffb454] ${FOCUS}`}
              >
                <Star size={14} className="transition-colors duration-500 group-hover:fill-[#ffb454]" />
                Rate this course
              </button>
            ) : (
              <p className="flex items-center gap-2 text-sm text-zinc-600">
                <Star size={14} />
                Finish a lecture to leave a rating
              </p>
            )}
          </div>
        )}
      </div>

      {/* ---------------- sections ---------------- */}
      <nav
        aria-label="Course content"
        className="relative flex-1 overflow-y-auto px-3 py-3 [scrollbar-color:rgba(255,255,255,0.12)_transparent] [scrollbar-width:thin]"
      >
        {courseSectionData.map((section, sIdx) => {
          const subs = section.SubSection ?? []
          const isOpen = !!openSections[section._id]
          const doneInSection = subs.filter((s) =>
            completedLectures.includes(s._id)
          ).length
          const sectionComplete = subs.length > 0 && doneInSection === subs.length

          return (
            <div key={section._id} className="mb-1">
              <button
                onClick={() => toggleSection(section._id)}
                aria-expanded={isOpen}
                className={`group flex w-full cursor-pointer items-center gap-4 rounded-2xl px-3 py-3 text-left transition-colors duration-500 hover:bg-white/[0.03] ${FOCUS}`}
              >
                <span className={`w-5 shrink-0 text-xs text-zinc-700 ${mono}`}>
                  {String(sIdx + 1).padStart(2, "0")}
                </span>

                <span className="min-w-0 flex-1">
                  <span
                    className={`block truncate text-[15px] font-medium leading-snug transition-colors duration-500 ${
                      isOpen ? "text-[#f3ece0]" : "text-zinc-400 group-hover:text-[#f3ece0]"
                    } ${display}`}
                  >
                    {section.sectionName}
                  </span>
                  <span
                    className={`mt-0.5 flex items-center gap-1.5 text-[11px] tabular-nums ${
                      sectionComplete ? "text-[#ffb454]" : "text-zinc-600"
                    } ${mono}`}
                  >
                    {sectionComplete && <Check size={11} strokeWidth={3} />}
                    {sectionComplete ? "Complete" : `${doneInSection}/${subs.length} done`}
                  </span>
                </span>

                <ChevronDown
                  size={16}
                  className={`shrink-0 text-zinc-600 transition-transform duration-500 ${
                    isOpen ? "rotate-180 text-[#ffb454]" : ""
                  }`}
                />
              </button>

              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.ul
                    initial={reduce ? false : { height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={reduce ? { opacity: 0 } : { height: 0, opacity: 0 }}
                    transition={{ duration: 0.45, ease: EASE }}
                    className="overflow-hidden"
                  >
                    <div className="py-1 pl-3">
                      {subs.map((sub, i) => {
                        const isActive = sub._id === activeSubSectionId
                        const isDone = completedLectures.includes(sub._id)
                        const nextDone =
                          i < subs.length - 1 &&
                          completedLectures.includes(subs[i + 1]._id)

                        return (
                          <li key={sub._id} className="relative">
                            {/* thread: amber where the learner has already walked */}
                            {i > 0 && (
                              <span
                                aria-hidden
                                className={`absolute left-[11.5px] top-0 h-1/2 w-px transition-colors duration-700 ${
                                  isDone ? "bg-[#ffb454]" : "bg-white/10"
                                }`}
                              />
                            )}
                            {i < subs.length - 1 && (
                              <span
                                aria-hidden
                                className={`absolute bottom-0 left-[11.5px] h-1/2 w-px transition-colors duration-700 ${
                                  nextDone ? "bg-[#ffb454]" : "bg-white/10"
                                }`}
                              />
                            )}

                            <button
                              onClick={() => goTo(section._id, sub._id)}
                              aria-current={isActive ? "true" : undefined}
                              className={`group relative flex w-full cursor-pointer items-center gap-4 rounded-full py-2 pl-0 pr-4 text-left transition-colors duration-500 ${FOCUS} ${
                                isActive ? "bg-[#ffb454]/[0.08]" : "hover:bg-white/[0.03]"
                              }`}
                            >
                              <Node done={isDone} active={isActive} reduce={reduce} />
                              <span
                                className={`truncate text-sm transition-colors duration-500 ${
                                  isActive
                                    ? "font-medium text-[#ffb454]"
                                    : isDone
                                    ? "text-zinc-500 group-hover:text-zinc-300"
                                    : "text-zinc-400 group-hover:text-[#f3ece0]"
                                }`}
                              >
                                {sub.title}
                              </span>
                            </button>
                          </li>
                        )
                      })}
                    </div>
                  </motion.ul>
                )}
              </AnimatePresence>
            </div>
          )
        })}
      </nav>

      <WriteReviewModal
        isOpen={reviewModalOpen}
        onClose={() => setReviewModalOpen(false)}
        courseId={courseEntireData._id}
        onSubmitted={() => setHasReviewed(true)}
      />
    </aside>
  )
}