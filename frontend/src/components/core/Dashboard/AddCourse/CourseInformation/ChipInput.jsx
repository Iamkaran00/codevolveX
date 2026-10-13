import React, { useEffect, useState } from "react"
import { MdClose } from "react-icons/md"
import { useSelector } from "react-redux"
import { motion, AnimatePresence, useReducedMotion } from "framer-motion"

/* ---------- design tokens (shared with the rest of the site) ---------- */
const EASE = [0.23, 1, 0.32, 1]
const display = "font-['Space_Grotesk',ui-sans-serif,system-ui,sans-serif]"

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
  const reduce = useReducedMotion()

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
      <label htmlFor={name} className={`text-sm font-medium text-[#f3ece0] ${display}`}>
        {label}{" "}
        <span aria-hidden className="text-[#ffb454]">
          *
        </span>
      </label>

      <div className="flex w-full flex-col gap-3">
        {chips.length > 0 && (
          <ul className="flex w-full flex-wrap gap-2">
            <AnimatePresence initial={false}>
              {chips.map((chip, index) => (
                <motion.li
                  key={chip}
                  layout={!reduce}
                  initial={reduce ? false : { opacity: 0, scale: 0.85 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={reduce ? undefined : { opacity: 0, scale: 0.85 }}
                  transition={{ duration: 0.35, ease: EASE }}
                  className="inline-flex items-center gap-1 rounded-full border border-[#ffb454]/40 bg-[#ffb454]/10 py-1 pl-3 pr-1.5 text-xs text-[#ffb454]"
                >
                  <span>{chip}</span>
                  <button
                    type="button"
                    onClick={() => handleDeleteChip(index)}
                    aria-label={`Remove tag ${chip}`}
                    className="cursor-pointer rounded-full p-1 text-[#ffb454]/70 transition-colors duration-300 hover:bg-[#ffb454]/20 hover:text-[#ffb454] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ffb454]/70"
                  >
                    <MdClose className="text-xs" />
                  </button>
                </motion.li>
              ))}
            </AnimatePresence>
          </ul>
        )}

        <input
          id={name}
          name={name}
          type="text"
          placeholder={placeholder}
          aria-invalid={!!errors[name]}
          onKeyDown={handleKeyDown}
          className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-[#f3ece0] outline-none transition-colors duration-300 placeholder:text-zinc-600 focus:border-[#ffb454]/60 aria-[invalid=true]:border-red-400/60"
        />
      </div>

      {errors[name] && (
        <p role="alert" className="text-xs text-red-400">
          Add at least one {label.toLowerCase()} tag.
        </p>
      )}
    </div>
  )
}