import React, { useEffect, useState } from "react"
import { MdClose } from "react-icons/md"
import { useSelector } from "react-redux"

export default function ChipInput({
  label,
  name,
  placeholder,
  register,
  errors,
  setValue,
  getValues,
}) {
  const { editCourse, course } = useSelector((state) => state.course)
  const [chips, setChips] = useState([])

  useEffect(() => {
    if (editCourse && course?.tag) {
      setChips(course.tag)
    }
    register(name, { required: true, validate: (value) => value?.length > 0 })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    setValue(name, chips)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chips])

  const handleKeyDown = (event) => {
    if (event.key === "Enter" || event.key === ",") {
      event.preventDefault()
      const chipValue = event.target.value.trim()
      
      if (chipValue && !chips.includes(chipValue)) {
        const newChips = [...chips, chipValue]
        setChips(newChips)
        event.target.value = ""
      }
    }
  }

  const handleDeleteChip = (chipIndex) => {
    const newChips = chips.filter((_, index) => index !== chipIndex)
    setChips(newChips)
  }

  return (
    <div className="flex flex-col gap-2">
      {/* Structural Field Label */}
      <label className="text-xs font-bold uppercase tracking-wider text-slate-500" htmlFor={name}>
        {label} <sup className="text-red-500">*</sup>
      </label>
      
      <div className="flex w-full flex-col gap-2">
        {/* CHIPS DISPLAY BAR PANEL
          Renders out active chips using elegant white-and-indigo structural modules
        */}
        {chips.length > 0 && (
          <div className="flex w-full flex-wrap gap-1.5 p-1 rounded-xl bg-slate-50/50 border border-slate-100 min-h-[46px] items-center">
            {chips.map((chip, index) => (
              <div
                key={index}
                className="inline-flex items-center gap-1 rounded-full bg-indigo-50 px-2.5 py-1 text-xs font-bold text-indigo-700 border border-indigo-100 m-0.5 shadow-sm transition-all animate-scaleUp"
              >
                <span>{chip}</span>
                <button
                  type="button"
                  onClick={() => handleDeleteChip(index)}
                  className="p-0.5 rounded-full text-indigo-400 hover:text-indigo-700 hover:bg-indigo-100/60 transition-colors outline-none"
                >
                  <MdClose className="text-xs" />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Dynamic Key Input Element */}
        <input
          id={name}
          name={name}
          type="text"
          placeholder={placeholder}
          onKeyDown={handleKeyDown}
          className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-800 placeholder:text-slate-300 outline-none transition-all focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50/60"
        />
      </div>

      {/* Validation Errors Overlay */}
      {errors[name] && (
        <span className="text-xs font-semibold text-red-500 mt-0.5">
          At least one {label.toLowerCase()} attribute tag is required.
        </span>
      )}
    </div>
  )
}