import React, { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X } from "lucide-react"
import { FaStar } from "react-icons/fa"
import ReactStars from "react-rating-stars-component"
import { useSelector } from "react-redux"

import { createRating } from "../../services/operations/courseApi"
export default function WriteReviewModal({ isOpen, onClose, courseId, onSubmitted }) {
  const { token } = useSelector((state) => state.auth)
  const [rating, setRating] = useState(0)
  const [review, setReview] = useState("")
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async () => {
    if (rating === 0) return
    if (review.trim().length === 0) return

    setSubmitting(true)
    const success = await createRating(
      { rating, review: review.trim(), courseId },
      token
    )
    setSubmitting(false)

    if (success) {
      setRating(0)
      setReview("")
      onSubmitted?.()
      onClose()
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.97 }}
            transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md rounded-2xl bg-white border border-slate-200 p-6"
          >
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-black text-slate-900">Rate this course</h2>
              <button
                onClick={onClose}
                className="text-slate-400 hover:text-slate-700 transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            <div className="flex flex-col items-center gap-2 py-2">
              <ReactStars
                count={5}
                value={rating}
                size={36}
                isHalf={false}
                onChange={(val) => setRating(val)}
                activeColor="#f59e0b"
                emptyIcon={<FaStar />}
                fullIcon={<FaStar />}
              />
              <p className="text-xs font-semibold text-slate-400">
                {rating === 0 ? "Tap to rate" : `${rating} of 5 stars`}
              </p>
            </div>

            <textarea
              value={review}
              onChange={(e) => setReview(e.target.value)}
              placeholder="Share your experience with this course..."
              rows={4}
              className="mt-4 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-300 resize-none"
            />

            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleSubmit}
              disabled={rating === 0 || review.trim().length === 0 || submitting}
              className="mt-5 w-full rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed py-3 text-sm font-bold text-white transition-colors"
            >
              {submitting ? "Submitting..." : "Submit Review"}
            </motion.button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}