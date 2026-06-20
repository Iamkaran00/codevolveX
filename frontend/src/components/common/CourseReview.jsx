import React, { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { FaStar } from "react-icons/fa"
import ReactStars from "react-rating-stars-component"
import { Quote } from "lucide-react"

import { getAverageRating,getReviewsForCourse } from "../../services/operations/courseApi"

export default function CourseReviews({ courseId }) {
  const [reviews, setReviews] = useState([])
  const [average, setAverage] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      setLoading(true)
      const [avg, list] = await Promise.all([
        getAverageRating(courseId),
        getReviewsForCourse(courseId),
      ])
      setAverage(avg || 0)
      setReviews(list || [])
      setLoading(false)
    }
    load()
  }, [courseId])

  if (loading) return null

  const distribution = [5, 4, 3, 2, 1].map((star) => {
    const count = reviews.filter((r) => Math.round(r.rating) === star).length
    const pct = reviews.length ? (count / reviews.length) * 100 : 0
    return { star, count, pct }
  })

  return (
    <div className="rounded-3xl border border-slate-100 bg-white p-7 sm:p-9">
      <h2 className="text-lg font-black text-slate-900 mb-7">Student Reviews</h2>

      {reviews.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-sm font-semibold text-slate-400">
            No reviews yet — be the first to share your experience.
          </p>
        </div>
      ) : (
        <>
          <div className="flex flex-col sm:flex-row gap-8 sm:gap-12 mb-8 pb-8 border-b border-slate-100">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
              className="flex flex-col items-center justify-center shrink-0"
            >
              <span className="text-6xl font-black text-slate-900 tracking-tight leading-none">
                {average.toFixed(1)}
              </span>
              <ReactStars
                count={5}
                value={average}
                size={18}
                edit={false}
                activeColor="#f59e0b"
                emptyIcon={<FaStar />}
                fullIcon={<FaStar />}
              />
              <span className="mt-2 text-xs font-bold text-slate-400 uppercase tracking-widest">
                {reviews.length} {reviews.length === 1 ? "Review" : "Reviews"}
              </span>
            </motion.div>

            <div className="flex-1 flex flex-col gap-2 justify-center">
              {distribution.map(({ star, count, pct }, i) => (
                <div key={star} className="flex items-center gap-3">
                  <span className="text-xs font-bold text-slate-500 w-8 shrink-0">
                    {star} ★
                  </span>
                  <div className="flex-1 h-1.5 rounded-full bg-slate-100 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: `${pct}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: i * 0.06, ease: [0.23, 1, 0.32, 1] }}
                      className="h-full bg-amber-400 rounded-full"
                    />
                  </div>
                  <span className="text-xs font-semibold text-slate-400 w-6 text-right shrink-0">
                    {count}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {reviews.map((r, i) => (
              <motion.div
                key={r._id}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.35, delay: i * 0.05, ease: [0.23, 1, 0.32, 1] }}
                className="rounded-2xl border border-slate-100 p-5 relative"
              >
                <Quote size={28} className="absolute top-4 right-4 text-slate-50" />
                <div className="flex items-center gap-3 mb-3">
                  <img
                    src={r.user?.image}
                    alt={r.user?.firstName}
                    className="h-10 w-10 rounded-full object-cover border border-slate-100 shrink-0"
                  />
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-slate-900 truncate">
                      {r.user?.firstName} {r.user?.lastName}
                    </p>
                    <ReactStars
                      count={5}
                      value={r.rating}
                      size={12}
                      edit={false}
                      activeColor="#f59e0b"
                      emptyIcon={<FaStar />}
                      fullIcon={<FaStar />}
                    />
                  </div>
                </div>
                <p className="text-sm text-slate-600 leading-relaxed relative z-10">
                  {r.review}
                </p>
              </motion.div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}