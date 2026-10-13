import React, { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { motion, AnimatePresence, useReducedMotion } from "framer-motion"
import { HiOutlinePlusCircle, HiOutlineTrash } from "react-icons/hi2"

/* ---------- design tokens (shared with the rest of the site) ---------- */
const EASE = [0.23, 1, 0.32, 1]
const display = "font-['Space_Grotesk',ui-sans-serif,system-ui,sans-serif]"

const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ffb454]/70 focus-visible:ring-offset-2 focus-visible:ring-offset-[#100f0d]"

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
  const reduce = useReducedMotion()

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
      <label htmlFor={name} className={`text-sm font-medium text-[#f3ece0] ${display}`}>
        {label}{" "}
        <span aria-hidden className="text-[#ffb454]">
          *
        </span>
      </label>

      <div className="flex flex-col items-stretch gap-3 sm:flex-row sm:items-center">
        <input
          type="text"
          id={name}
          value={requirement}
          placeholder="e.g. Basic JavaScript knowledge"
          aria-invalid={!!errors[name]}
          onChange={(e) => setRequirement(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault()
              handleAddRequirement()
            }
          }}
          className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-[#f3ece0] outline-none transition-colors duration-300 placeholder:text-zinc-600 focus:border-[#ffb454]/60 aria-[invalid=true]:border-red-400/60"
        />

        <button
          type="button"
          onClick={handleAddRequirement}
          className={`inline-flex h-[46px] shrink-0 cursor-pointer items-center justify-center gap-1.5 rounded-full border border-[#ffb454]/40 px-5 text-sm text-[#ffb454] transition-colors duration-300 hover:bg-[#ffb454] hover:text-[#1d1a16] active:scale-[0.98] ${focusRing}`}
        >
          <HiOutlinePlusCircle className="text-base" />
          Add
        </button>
      </div>

      {requirementsList.length > 0 && (
        <ul className="mt-2 flex flex-col gap-2">
          <AnimatePresence initial={false}>
            {requirementsList.map((reqItem, index) => (
              <motion.li
                key={`${reqItem}-${index}`}
                layout={!reduce}
                initial={reduce ? false : { opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduce ? undefined : { opacity: 0, scale: 0.97 }}
                transition={{ duration: 0.4, ease: EASE }}
                className="flex items-center justify-between gap-4 rounded-xl border border-white/[0.07] bg-white/[0.02] px-4 py-2.5"
              >
                <span className="break-all text-sm leading-relaxed text-zinc-300">{reqItem}</span>

                <button
                  type="button"
                  onClick={() => handleRemoveRequirement(index)}
                  aria-label={`Remove requirement: ${reqItem}`}
                  title="Remove"
                  className={`inline-flex shrink-0 cursor-pointer items-center justify-center rounded-full p-2 text-zinc-500 transition-colors duration-300 hover:text-red-400 ${focusRing}`}
                >
                  <HiOutlineTrash className="text-base" />
                </button>
              </motion.li>
            ))}
          </AnimatePresence>
        </ul>
      )}

      {errors[name] && (
        <p role="alert" className="text-xs text-red-400">
          Add at least one {label.toLowerCase()} item.
        </p>
      )}
    </div>
  )
}