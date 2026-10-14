import React, { useRef, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { motion, AnimatePresence, useReducedMotion } from "framer-motion"
import { ArrowLeft, ArrowRight, Check, Play } from "lucide-react"

import { markLectureAsComplete } from "../../services/operations/courseApi"
import {
  setActiveLecture,
  removeCompletedLecture,
  updateCompletedLectures,
} from "../../slices/viewCourse.slice"

const EASE = [0.23, 1, 0.32, 1]

const display = "font-['Space_Grotesk',ui-sans-serif,system-ui,sans-serif]"
const mono = "font-['JetBrains_Mono',ui-monospace,monospace]"

const GRAIN = `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.8' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>")`

const FOCUS = "outline-none focus-visible:ring-1 focus-visible:ring-[#ffb454]/70"

const Grain = () => (
  <div
    aria-hidden
    className="pointer-events-none absolute inset-0 opacity-[0.06] mix-blend-overlay"
    style={{ backgroundImage: GRAIN }}
  />
)

/* The check draws itself when a lecture is marked complete */
const DrawnCheck = ({ reduce }) => (
  <svg width="14" height="14" viewBox="0 0 12 12" fill="none" aria-hidden>
    <motion.path
      d="M2.5 6.2l2.4 2.4 4.6-5"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      initial={reduce ? false : { pathLength: 0 }}
      animate={{ pathLength: 1 }}
      transition={{ duration: 0.5, ease: EASE }}
    />
  </svg>
)

/* Previous / next lecture card */
const NavCard = ({ lecture, direction, onClick }) => {
  const isNext = direction === "next"
  const Icon = isNext ? ArrowRight : ArrowLeft

  if (!lecture) {
    // keeps the two-column rhythm without a dead button
    return <div aria-hidden className="hidden rounded-3xl border border-dashed border-white/[0.06] sm:block" />
  }

  return (
    <button
      onClick={onClick}
      className={`group flex cursor-pointer items-center gap-4 rounded-3xl border border-white/[0.08] bg-[#14130f] p-5 text-left transition-all duration-500 hover:border-[#ffb454]/40 ${FOCUS} focus-visible:border-[#ffb454] ${
        isNext ? "flex-row-reverse text-right" : ""
      }`}
    >
      <span
        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/15 text-zinc-400 transition-all duration-500 group-hover:border-[#ffb454] group-hover:bg-[#ffb454] group-hover:text-[#1d1a16] ${
          isNext ? "group-hover:translate-x-0.5" : "group-hover:-translate-x-0.5"
        }`}
      >
        <Icon size={18} />
      </span>
      <span className="min-w-0 flex-1">
        <span className={`block text-[11px] text-zinc-600 ${mono}`}>
          {isNext ? "Up next" : "Previous"}
        </span>
        <span
          className={`mt-1 block truncate text-base font-medium text-[#f3ece0] transition-colors duration-500 group-hover:text-[#ffb454] ${display}`}
        >
          {lecture.title}
        </span>
      </span>
    </button>
  )
}

export default function VideoPlayer() {
  const dispatch = useDispatch()
  const reduce = useReducedMotion()
  const videoRef = useRef(null)
  const [marking, setMarking] = useState(false)

  const { token } = useSelector((state) => state.auth)
  const {
    courseSectionData,
    courseEntireData,
    completedLectures,
    activeSubSectionId,
  } = useSelector((state) => state.viewCourse)

  if (!courseEntireData || !activeSubSectionId) {
    return (
      <div className="relative flex flex-1 items-center justify-center overflow-hidden bg-[#100f0d] px-6">
        <Grain />
        <div className="relative flex max-w-sm flex-col items-center text-center">
          <span className="flex h-16 w-16 items-center justify-center rounded-full border border-white/10">
            <Play size={24} className="translate-x-0.5 text-zinc-500" />
          </span>
          <h3 className={`mt-6 text-2xl font-semibold text-[#f3ece0] ${display}`}>
            Pick a lecture
          </h3>
          <p className="mt-2 text-zinc-500">
            Choose any lecture from the list to start watching.
          </p>
        </div>
      </div>
    )
  }

  const flatLectures = courseSectionData.flatMap((section) =>
    section.SubSection.map((sub) => ({ ...sub, sectionId: section._id }))
  )
  const currentIndex = flatLectures.findIndex((l) => l._id === activeSubSectionId)
  const currentLecture = flatLectures[currentIndex]
  const nextLecture = flatLectures[currentIndex + 1]
  const prevLecture = flatLectures[currentIndex - 1]
  const sectionName = courseSectionData.find(
    (s) => s._id === currentLecture?.sectionId
  )?.sectionName

  const isCompleted = completedLectures.includes(activeSubSectionId)

  const goTo = (lecture) => {
    if (!lecture) return
    dispatch(
      setActiveLecture({
        sectionId: lecture.sectionId,
        subSectionId: lecture._id,
      })
    )
  }

  const handleMarkComplete = async () => {
    if (marking) return
    setMarking(true)
    const completed = await markLectureAsComplete(
      { courseId: courseEntireData._id, subsectionId: activeSubSectionId },
      token
    )
    if (completed === true) {
      dispatch(updateCompletedLectures(activeSubSectionId))
    } else if (completed === false) {
      dispatch(removeCompletedLecture(activeSubSectionId))
    }
    setMarking(false)
  }

  const handleVideoEnd = () => {
    if (!isCompleted) {
      handleMarkComplete()
    }
  }

  return (
    <div className="relative flex flex-1 flex-col overflow-y-auto bg-[#100f0d] [scrollbar-color:rgba(255,255,255,0.12)_transparent] [scrollbar-width:thin]">
      <Grain />

      <div className="relative flex flex-1 justify-center px-5 py-8 sm:px-8 lg:py-12">
        <div className="w-full max-w-4xl">
          {/* video */}
          <div className="relative aspect-video w-full overflow-hidden rounded-3xl border border-white/[0.08] bg-black shadow-[0_40px_80px_-40px_rgba(0,0,0,0.9)]">
            <video
              ref={videoRef}
              key={currentLecture?._id}
              src={currentLecture?.videoUrl}
              controls
              playsInline
              onEnded={handleVideoEnd}
              className="h-full w-full"
            />
          </div>

          {/* lecture info + action */}
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={currentLecture?._id}
              initial={reduce ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: EASE }}
              className="mt-9 flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between"
            >
              <div className="min-w-0 max-w-2xl">
                <div className="flex items-center gap-3">
                  <span className="h-px w-8 bg-[#ffb454]" />
                  <p className={`truncate text-xs text-zinc-500 ${mono}`}>
                    Lecture {currentIndex + 1} of {flatLectures.length}
                    {sectionName ? ` in ${sectionName}` : ""}
                  </p>
                </div>

                <h1
                  className={`mt-5 text-3xl font-semibold leading-[1.1] tracking-tight text-[#f3ece0] sm:text-4xl ${display}`}
                >
                  {currentLecture?.title}
                </h1>

                {currentLecture?.description && (
                  <p className="mt-5 max-w-xl text-base leading-relaxed text-zinc-400">
                    {currentLecture.description}
                  </p>
                )}
              </div>

              <button
                onClick={handleMarkComplete}
                disabled={marking}
                aria-pressed={isCompleted}
                aria-label={
                  isCompleted ? "Completed. Click to mark as not complete" : "Mark as complete"
                }
                className={`group relative flex w-full shrink-0 cursor-pointer items-center justify-center gap-2.5 overflow-hidden rounded-full px-7 py-4 text-sm font-semibold transition-all duration-500 active:scale-[0.98] disabled:cursor-wait disabled:opacity-60 lg:w-auto ${FOCUS} ${
                  isCompleted
                    ? "border border-[#ffb454]/50 bg-[#ffb454]/[0.08] text-[#ffb454] hover:border-white/20 hover:bg-transparent hover:text-zinc-400"
                    : "bg-[#ffb454] text-[#1d1a16] hover:bg-[#ffc272]"
                }`}
              >
                {isCompleted ? (
                  <>
                    <DrawnCheck reduce={reduce} />
                    <span className="group-hover:hidden">{marking ? "Updating" : "Completed"}</span>
                    <span className="hidden group-hover:inline">
                      {marking ? "Updating" : "Mark as not complete"}
                    </span>
                  </>
                ) : (
                  <>
                    <Check size={15} strokeWidth={2.5} />
                    {marking ? "Updating" : "Mark as complete"}
                  </>
                )}
              </button>
            </motion.div>
          </AnimatePresence>

       
          <div className="mt-14 grid grid-cols-1 gap-4 border-t border-white/[0.07] pt-8 sm:grid-cols-2">
            <NavCard lecture={prevLecture} direction="prev" onClick={() => goTo(prevLecture)} />
            <NavCard lecture={nextLecture} direction="next" onClick={() => goTo(nextLecture)} />
          </div>
        </div>
      </div>
    </div>
  )
}