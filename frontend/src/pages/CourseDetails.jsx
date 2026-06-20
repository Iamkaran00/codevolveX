import React, { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import { useSelector } from "react-redux"
import { ArrowLeft, BookOpen } from "lucide-react"
import { fetchCourseDetails } from "../services/operations/courseApi"

import CourseDetailsCard from "../components/core/CourseDetails/CourseDetailsCard"
import CourseWhatYouLearn from "../components/core/CourseDetails/CourseWhatYouLearn";
import CourseRequirements from "../components/core/CourseDetails/CourseRequirement";
import CourseHero from "../components/core/CourseDetails/CourseHero"
import CourseInstructor from "../components/core/CourseDetails/CourseInstructor"
import CourseAccordion from "../components/core/CourseDetails/CourseAccordion"
import CourseFAQ from "../components/core/CourseDetails/CourseFaq"
import CourseReviews from "../components/common/CourseReview"
function SkeletonDetail() {
  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-32 font-sans animate-pulse">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="h-5 w-32 bg-slate-200 rounded-full mb-10" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 space-y-6">
            <div className="h-10 bg-slate-200 rounded-full w-3/4" />
            <div className="h-10 bg-slate-200 rounded-full w-1/2" />
            <div className="h-5 bg-slate-100 rounded-full w-full mt-4" />
            <div className="h-5 bg-slate-100 rounded-full w-5/6" />
            <div className="h-5 bg-slate-100 rounded-full w-4/6" />
          </div>
          <div className="lg:col-span-1">
            <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden">
              <div className="w-full aspect-video bg-slate-100" />
              <div className="p-6 space-y-4">
                <div className="h-10 bg-slate-100 rounded-full w-1/3" />
                <div className="h-14 bg-slate-100 rounded-2xl w-full" />
                <div className="h-14 bg-slate-100 rounded-2xl w-full" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function CourseDetails() {
  const { courseId } = useParams()
  const navigate = useNavigate()
  const { user } = useSelector((state) => state.profile);

  const [courseData, setCourseData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    async function load() {
      setLoading(true)
      setError(false)
      try {
        const result = await fetchCourseDetails(courseId)
        if (result?.success) {
          setCourseData(result.data)
        } else {
          setError(true)
        }
      } catch {
        setError(true)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [courseId])

  if (loading) return <SkeletonDetail />

  if (error || !courseData) {
    return (
      <div className="min-h-screen bg-slate-50 pt-24 pb-32 font-sans flex items-center justify-center">
        <div className="flex flex-col items-center text-center py-24 bg-white rounded-3xl border border-rose-100 shadow-sm px-12">
          <div className="w-16 h-16 rounded-full bg-rose-50 flex items-center justify-center mb-6">
            <BookOpen size={28} className="text-rose-500" />
          </div>
          <h3 className="text-2xl font-bold text-slate-900">Course not found</h3>
          <p className="text-slate-500 mt-2 text-lg">We couldn't load this course. Please try again.</p>
          <button
            onClick={() => navigate("/catalogue")}
            className="mt-8 px-8 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white text-base font-bold rounded-xl transition-colors shadow-lg shadow-indigo-200"
          >
            Back to Catalogue
          </button>
        </div>
      </div>
    )
  }

  const { courseDetails, totalDuration } = courseData

  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-32 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <motion.button
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => navigate("/catalogue")}
          className="flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-slate-900 transition-colors mb-10"
        >
          <ArrowLeft size={16} />
          Back to Catalogue
        </motion.button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 lg:gap-14">

          <div className="lg:col-span-2 space-y-10">
            <CourseHero course={courseDetails} totalDuration={totalDuration} />
            <CourseWhatYouLearn course={courseDetails} />
            <CourseAccordion course={courseDetails} />
            <CourseInstructor course={courseDetails} />
            <CourseRequirements course={courseDetails} />
            <CourseFAQ/>
            <CourseReviews courseId = {courseDetails._id} />
          </div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.1, ease: [0.23, 1, 0.32, 1] }}
            className="lg:col-span-1"
          >
            <CourseDetailsCard
              course={courseDetails}
              totalDuration={totalDuration}
              user={user}
            />
          </motion.div>

        </div>
      </div>
    </div>
  )
}