import React, { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"

import { editCourseDetails } from "../../../../services/operations/courseApi"
import { resetCourseState,setStep } from "../../../../slices/course.slice"
import { COURSE_STATUS } from "../../../../utils/constants"
export default function PublishCourse() {
  const { register, handleSubmit, setValue, getValues } = useForm()

  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { token } = useSelector((state) => state.auth)
  const { course } = useSelector((state) => state.course)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (course?.status === COURSE_STATUS.PUBLISHED) {
      setValue("public", true)
    }
  }, [course, setValue])

  const goBack = () => {
    dispatch(setStep(2))
  }

  const goToCourses = () => {
    dispatch(resetCourseState())
    navigate("/dashboard/my-courses")
  }

  const handleCoursePublish = async () => {
    // check if form has been updated or not
    if (
      (course?.status === COURSE_STATUS.PUBLISHED && getValues("public") === true) ||
      (course?.status === COURSE_STATUS.DRAFT && getValues("public") === false)
    ) {
      // form has not been updated, no need to make api call
      goToCourses()
      return
    }
    
    const formData = new FormData()
    formData.append("courseId", course._id)
    
    const courseStatus = getValues("public")
      ? COURSE_STATUS.PUBLISHED
      : COURSE_STATUS.DRAFT
    formData.append("status", courseStatus)
    
    setLoading(true)
    const result = await editCourseDetails(formData, token)
    if (result) {
      goToCourses()
    }
    setLoading(false)
  }

  const onSubmit = (data) => {
    handleCoursePublish()
  }

  return (
    <div className="w-full rounded-2xl border border-slate-200 bg-white p-6 shadow-md">
      <h2 className="text-xl font-bold text-slate-900 tracking-tight">
        Publish Settings
      </h2>
      
      <form onSubmit={handleSubmit(onSubmit)}>
        {/* INTERACTIVE CHECKBOX FIELD CARD */}
        <div className="my-6 mb-8 rounded-xl border border-slate-100 bg-slate-50/50 p-5 shadow-sm">
          <label htmlFor="public" className="inline-flex items-center cursor-pointer select-none group">
            <input
              type="checkbox"
              id="public"
              {...register("public")}
              className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-4 focus:ring-indigo-50/60 transition-all cursor-pointer"
            />
            <div className="ml-3 flex flex-col">
              <span className="text-sm font-bold text-slate-800 group-hover:text-slate-900 transition-colors">
                Make this course public
              </span>
              <span className="text-xs font-semibold text-slate-400 mt-0.5">
                Once published, this course route will be instantly accessible across the catalog dashboard.
              </span>
            </div>
          </label>
        </div>

        {/* WIZARD FLOW ACTIONS FOOTER CONTROL PANELS */}
        <div className="ml-auto flex max-w-max items-center gap-x-3 border-t border-slate-100 pt-5 w-full">
          <button
            disabled={loading}
            type="button"
            onClick={goBack}
            className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-xs font-bold text-slate-600 transition-all hover:bg-slate-50 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Back
          </button>
          
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center justify-center rounded-xl bg-indigo-600 px-6 py-2.5 text-xs font-bold text-white shadow-sm shadow-indigo-100 transition-all hover:bg-indigo-700 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Saving Changes..." : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  )
}