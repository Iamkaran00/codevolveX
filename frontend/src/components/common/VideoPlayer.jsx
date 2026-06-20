import React, { useRef, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { motion } from "framer-motion"
import { CheckCircle2, SkipBack, SkipForward } from "lucide-react"
import { toast } from "react-toastify"

import { markLectureAsComplete } from "../../services/operations/courseApi"
import { setActiveLecture,removeCompletedLecture,updateCompletedLectures } from "../../slices/viewCourse.slice"
export default function VideoPlayer() {
  const dispatch = useDispatch()
  const videoRef = useRef(null)
  const [marking, setMarking] = useState(false)

  const { token } = useSelector((state) => state.auth)
  const {
    courseSectionData,
    courseEntireData,
    completedLectures,
    activeSectionId,
    activeSubSectionId,
  } = useSelector((state) => state.viewCourse)

  if (!courseEntireData || !activeSubSectionId) {
    return (
      <div className="flex-1 flex items-center justify-center text-slate-400 text-sm font-semibold">
        Select a lecture to begin
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
    <div className="flex-1 flex flex-col overflow-y-auto">
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-4xl">
          <div className="relative w-full aspect-video bg-slate-900 rounded-2xl overflow-hidden shadow-xl">
            <video
              ref={videoRef}
              key={currentLecture?._id}
              src={currentLecture?.videoUrl}
              controls
              onEnded={handleVideoEnd}
              className="w-full h-full"
            />
          </div>

          <div className="mt-6 flex items-start justify-between gap-4">
            <div>
              <h1 className="text-xl font-black text-slate-900">
                {currentLecture?.title}
              </h1>
              <p className="mt-1.5 text-sm text-slate-500 leading-relaxed">
                {currentLecture?.description}
              </p>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              onClick={handleMarkComplete}
              disabled={marking}
              className={`shrink-0 flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-bold transition-colors ${
                isCompleted
                  ? "bg-emerald-50 text-emerald-600 hover:bg-emerald-100"
                  : "bg-indigo-600 text-white hover:bg-indigo-700"
              }`}
            >
              <CheckCircle2 size={16} />
              {marking
                ? "Updating..."
                : isCompleted
                ? "Completed · Click to undo"
                : "Mark as Complete"}
            </motion.button>
          </div>

          <div className="mt-8 flex items-center justify-between border-t border-slate-100 pt-5">
            <button
              onClick={() => goTo(prevLecture)}
              disabled={!prevLecture}
              className="flex items-center gap-1.5 text-sm font-bold text-slate-500 hover:text-slate-900 disabled:opacity-30 disabled:hover:text-slate-500 transition-colors"
            >
              <SkipBack size={15} />
              Previous
            </button>
            <button
              onClick={() => goTo(nextLecture)}
              disabled={!nextLecture}
              className="flex items-center gap-1.5 text-sm font-bold text-slate-500 hover:text-slate-900 disabled:opacity-30 disabled:hover:text-slate-500 transition-colors"
            >
              Next
              <SkipForward size={15} />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}