import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FaStar } from "react-icons/fa";
import ReactStars from "react-rating-stars-component";
import { Star, MessageSquareQuote } from "lucide-react";
import { getAverageRating, getReviewsForCourse } from "../../services/operations/courseApi";

export default function CourseReviews({ courseId }) {
  const [reviews, setReviews] = useState([]);
  const [average, setAverage] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      const [avg, list] = await Promise.all([
        getAverageRating(courseId),
        getReviewsForCourse(courseId),
      ]);
      setAverage(avg || 0);
      setReviews(list || []);
      setLoading(false);
    }
    load();
  }, [courseId]);

  if (loading) return null;

  const distribution = [5, 4, 3, 2, 1].map((star) => {
    const count = reviews.filter((r) => Math.round(r.rating) === star).length;
    const pct = reviews.length ? (count / reviews.length) * 100 : 0;
    return { star, count, pct };
  });

  return (
    <div className="bg-white rounded-[2rem] border border-indigo-50 p-8 md:p-10 shadow-[0_2px_40px_-12px_rgba(79,70,229,0.05)]">
      <div className="flex items-center gap-3 mb-10">
        <div className="p-2 bg-indigo-50 rounded-xl">
          <Star className="text-indigo-600" size={20} fill="currentColor" />
        </div>
        <h2 className="text-xl font-semibold text-indigo-950">Student Feedback</h2>
      </div>

      {reviews.length === 0 ? (
        <div className="text-center py-16 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
          <p className="text-sm font-medium text-slate-500">No reviews yet.</p>
        </div>
      ) : (
        <>
          <div className="grid md:grid-cols-3 gap-10 mb-12">
            {/* Rating Summary */}
            <div className="flex flex-col items-center justify-center p-6 bg-indigo-50/50 rounded-3xl border border-indigo-100/50">
              <span className="text-6xl font-bold text-indigo-950 tracking-tighter">
                {average.toFixed(1)}
              </span>
              <div className="my-2 text-violet-500">
                <ReactStars count={5} value={average} size={20} edit={false} activeColor="#8b5cf6" />
              </div>
              <span className="text-xs font-bold text-indigo-400 uppercase tracking-widest">
                {reviews.length} Verified Reviews
              </span>
            </div>

            {/* Progress Bars */}
            <div className="md:col-span-2 flex flex-col gap-3 justify-center">
              {distribution.map(({ star, count, pct }, i) => (
                <div key={star} className="flex items-center gap-4">
                  <span className="text-xs font-semibold text-slate-500 w-8">{star} Star</span>
                  <div className="flex-1 h-2 rounded-full bg-slate-100 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: `${pct}%` }}
                      className="h-full bg-violet-400 rounded-full"
                    />
                  </div>
                  <span className="text-xs font-bold text-slate-900 w-8 text-right">{count}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Reviews Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {reviews.map((r) => (
              <motion.div
                key={r._id}
                className="bg-white border border-indigo-50 rounded-2xl p-6 hover:border-violet-200 hover:shadow-[0_8px_24px_-8px_rgba(139,92,246,0.1)] transition-all"
              >
                <div className="flex items-center gap-4 mb-4">
                  <img
                    src={r.user?.image}
                    alt={r.user?.firstName}
                    className="h-12 w-12 rounded-full object-cover border border-indigo-50"
                  />
                  <div>
                    <p className="text-sm font-semibold text-indigo-950">
                      {r.user?.firstName} {r.user?.lastName}
                    </p>
                    <div className="text-violet-500">
                      <ReactStars count={5} value={r.rating} size={12} edit={false} activeColor="#8b5cf6" />
                    </div>
                  </div>
                </div>
                <p className="text-[14px] text-slate-600 leading-relaxed italic">
                  "{r.review}"
                </p>
              </motion.div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}