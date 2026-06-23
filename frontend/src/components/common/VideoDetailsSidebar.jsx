import React, { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowLeft, CheckCircle2, Circle, PlayCircle, ChevronDown, Star } from "lucide-react"

import { setActiveLecture } from '../../slices/viewCourse.slice';

import { getReviewsForCourse } from "../../services/operations/courseApi"
import WriteReviewModal from './WriteReview'

export default function VideoDetailsSidebar() {
  const navigate = useNavigate()
  const dispatch = useDispatch()

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

  const toggleSection = (sectionId) => {
    setOpenSections((prev) => ({ ...prev, [sectionId]: !prev[sectionId] }))
  }

  const hasWatchedAny = completedLectures.length > 0

  if (!courseEntireData) return null

  return (
    <aside className="w-[320px] shrink-0 border-r border-slate-200 bg-white h-full overflow-y-auto">
      <div className="p-5 border-b border-slate-100">
        <button
          onClick={() => navigate("/dashboard/enrolled-courses")}
          className="flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-slate-900 transition-colors mb-4"
        >
          <ArrowLeft size={14} />
          Back to My Courses
        </button>
        <h2 className="text-base font-bold text-slate-900 leading-snug">
          {courseEntireData.courseName}
        </h2>
        <p className="mt-1.5 text-xs font-semibold text-slate-400">
          {completedLectures.length} of{" "}
          {courseSectionData.reduce((acc, s) => acc + s.SubSection.length, 0)}{" "}
          lectures completed
        </p>
        {checkingReview ? null : hasReviewed ? (
          <p className="mt-4 flex items-center gap-1.5 text-xs font-bold text-emerald-600">
            <Star size={13} className="fill-emerald-600" />
            Thanks for rating this course
          </p>
        ) : hasWatchedAny ? (
          <button
            onClick={() => setReviewModalOpen(true)}
            className="mt-4 flex items-center gap-1.5 text-xs font-bold text-indigo-600 hover:text-indigo-700 transition-colors"
          >
            <Star size={13} />
            Rate this course
          </button>
        ) : (
          <p className="mt-4 flex items-center gap-1.5 text-xs font-semibold text-slate-300">
            <Star size={13} />
            Watch a lecture to unlock rating
          </p>
        )}
      </div>

      <div className="py-2">
        {courseSectionData.map((section) => {
          const isOpen = !!openSections[section._id]
          const doneInSection = section.SubSection.filter((sub) =>
            completedLectures.includes(sub._id)
          ).length

          return (
            <div key={section._id} className="px-3 py-1.5">
              <button
                onClick={() => toggleSection(section._id)}
                className="flex items-center justify-between w-full px-2 py-2.5 rounded-xl hover:bg-slate-50 transition-colors"
              >
                <div className="flex flex-col items-start min-w-0">
                  <p className="text-xs font-black text-slate-700 uppercase tracking-widest truncate">
                    {section.sectionName}
                  </p>
                  <p className="text-[11px] font-semibold text-slate-400 mt-0.5">
                    {doneInSection}/{section.SubSection.length} done
                  </p>
                </div>
                <motion.div
                  animate={{ rotate: isOpen ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                  className="shrink-0"
                >
                  <ChevronDown size={16} className="text-slate-400" />
                </motion.div>
              </button>

              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
                    className="overflow-hidden"
                  >
                    <div className="flex flex-col gap-0.5 pb-1 pt-1">
                      {section.SubSection.map((sub) => {
                        const isActive = sub._id === activeSubSectionId
                        const isDone = completedLectures.includes(sub._id)

                        return (
                          <button
                            key={sub._id}
                            onClick={() =>
                              dispatch(
                                setActiveLecture({
                                  sectionId: section._id,
                                  subSectionId: sub._id,
                                })
                              )
                            }
                            className={`flex items-center gap-2.5 w-full text-left px-3 py-2.5 rounded-xl text-sm transition-colors ${
                              isActive
                                ? "bg-indigo-50 text-indigo-700 font-bold"
                                : "text-slate-600 hover:bg-slate-50 font-medium"
                            }`}
                          >
                            {isDone ? (
                              <CheckCircle2 size={16} className="text-emerald-500 shrink-0" />
                            ) : isActive ? (
                              <PlayCircle size={16} className="text-indigo-600 shrink-0" />
                            ) : (
                              <Circle size={16} className="text-slate-300 shrink-0" />
                            )}
                            <span className="truncate">{sub.title}</span>
                          </button>
                        )
                      })}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )
        })}
      </div>

      <WriteReviewModal
        isOpen={reviewModalOpen}
        onClose={() => setReviewModalOpen(false)}
        courseId={courseEntireData._id}
        onSubmitted={() => setHasReviewed(true)}
      />
    </aside>
  )
}