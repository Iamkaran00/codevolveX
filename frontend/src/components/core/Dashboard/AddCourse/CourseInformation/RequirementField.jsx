import React, { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { HiOutlinePlusCircle, HiOutlineTrash } from "react-icons/hi2"

export default function RequirementsField({
  name,
  label,
  register,
  setValue,
  errors,
  getValues,
}) {
  const { editCourse, course } = useSelector((state) => state.course)
  const [requirement, setRequirement] = useState("")
  const [requirementsList, setRequirementsList] = useState([])

  useEffect(() => {
    if (editCourse && course?.instructions) {
      setRequirementsList(course.instructions)
    }
    register(name, { required: true, validate: (value) => value?.length > 0 })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    setValue(name, requirementsList)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [requirementsList])

  const handleAddRequirement = () => {
    if (requirement.trim()) {
      setRequirementsList([...requirementsList, requirement.trim()])
      setRequirement("")
    }
  }

  const handleRemoveRequirement = (index) => {
    const updatedRequirements = [...requirementsList]
    updatedRequirements.splice(index, 1)
    setRequirementsList(updatedRequirements)
  }

  return (
    <div className="flex flex-col gap-2">
      {/* Dynamic Field Label */}
      <label className="text-xs font-bold uppercase tracking-wider text-slate-500" htmlFor={name}>
        {label} <sup className="text-red-500">*</sup>
      </label>
      
      {/* INPUT CONTROLS SECTION */}
      <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center">
        <input
          type="text"
          id={name}
          value={requirement}
          placeholder="e.g., Working knowledge of JavaScript syntax basic protocols"
          onChange={(e) => setRequirement(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              handleAddRequirement();
            }
          }}
          className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-800 placeholder:text-slate-300 outline-none transition-all focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50/60"
        />
        
        <button
          type="button"
          onClick={handleAddRequirement}
          className="inline-flex h-[46px] items-center justify-center gap-1.5 rounded-xl border border-indigo-200 bg-indigo-50/40 px-5 text-xs font-bold text-indigo-600 transition-all hover:bg-indigo-600 hover:text-white shrink-0 active:scale-[0.97]"
        >
          <HiOutlinePlusCircle className="text-base" />
          <span>Add</span>
        </button>
      </div>

      {/* REQUIREMENTS RENDERED LIST DATA TILES */}
      {requirementsList.length > 0 && (
        <div className="mt-3 overflow-hidden rounded-xl border border-slate-100 bg-slate-50/30 p-2 flex flex-col gap-y-1.5">
          {requirementsList.map((reqItem, index) => (
            <div 
              key={index} 
              className="flex items-center justify-between gap-x-4 rounded-lg border border-slate-200/60 bg-white px-4 py-2.5 shadow-sm transition-all animate-scaleUp"
            >
              <span className="text-xs font-semibold text-slate-700 leading-relaxed break-all">
                {reqItem}
              </span>
              
              <button
                type="button"
                onClick={() => handleRemoveRequirement(index)}
                className="inline-flex items-center justify-center p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors shrink-0"
                title="Remove Requirement"
              >
                <HiOutlineTrash className="text-sm" />
              </button>
            </div>
          ))}
        </div>
      )}

      {errors[name] && (
        <span className="text-xs font-semibold text-red-500 mt-0.5">
          Please initialize at least one item row within {label.toLowerCase()} settings.
        </span>
      )}
    </div>
  )
}