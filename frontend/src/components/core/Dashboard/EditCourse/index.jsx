import React, { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useParams } from "react-router-dom"

import { getFullDetailsOfCourse } from "../../../../services/operations/courseDetailsAPI"
import { setCourse, setEditCourse } from "../../../../slices/courseSlice"
import RenderSteps from "../AddCourse/RenderSteps"

export default function EditCourse() {
  const dispatch = useDispatch()
  const { courseId } = useParams()
  const { course } = useSelector((state) => state.course)
  const [loading, setLoading] = useState(false)
  const { token } = useSelector((state) => state.auth)

  useEffect(() => {
    const populateCourseDetails = async () => {
      setLoading(true)
      const result = await getFullDetailsOfCourse(courseId, token)
      if (result?.courseDetails) {
        dispatch(setEditCourse(true))
        dispatch(setCourse(result?.courseDetails))
      }
      setLoading(false)
    }
    if (courseId && token) {
      populateCourseDetails()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [courseId, token, dispatch])

  // RENDERS A CLEAN MATCHING BRAND INDIGO LOADER WHILE FETCHING BACKEND STRUCTS
  if (loading) {
    return (
      <div className="flex min-h-[400px] flex-1 items-center justify-center rounded-2xl border border-slate-200 bg-white shadow-md">
        <div className="h-9 w-9 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent" />
      </div>
    )
  }

  return (
    <div className="w-full min-h-screen bg-gray-50/10">
      
      {/* Viewport Core Section Header */}
      <div className="mb-8 border-b border-slate-200 pb-5">
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
          Edit Course
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Modify active modules, update existing lecture timelines, or alter publish states smoothly.
        </p>
      </div>

      {/* Central Wizard Injection Canvas wrapper */}
      <div className="mx-auto max-w-[800px] w-full animate-fadeIn">
        {course ? (
          <RenderSteps />
        ) : (
          /* Branded Fallback Empty Warning Interface Card */
          <div className="flex h-[240px] flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white p-8 shadow-md text-center">
            <p className="text-lg font-bold text-slate-700">Course Identifier Map Not Found</p>
            <p className="text-sm text-slate-400 mt-1 max-w-xs">
              The targeted curriculum setup record couldn't be mounted into the system state workspace.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}