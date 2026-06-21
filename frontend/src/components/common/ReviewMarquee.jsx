import React, { useEffect, useState } from "react";
import { Star, MessageSquareQuote, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { getAllReviews } from "../../services/operations/courseApi";

function StaticStars({ rating }) {
  const fullStars = Math.floor(rating);
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          size={23}
          className={`${
            i < fullStars 
              ? "fill-amber-400 text-amber-400" 
              : "fill-slate-100 text-slate-200"
          }`}
        />
      ))}
    </div>
  );
}

function ReviewCard({ r }) {
  return (
    <div className="relative shrink-0 w-[380px] rounded-3xl border border-slate-200/60 bg-white p-8 shadow-sm hover:shadow-xl hover:shadow-indigo-500/5 transition-all duration-300 mx-3 overflow-hidden group">
      
      <MessageSquareQuote 
        size={120} 
        className="absolute -top-6 -right-6 text-slate-50 opacity-50 group-hover:scale-110 group-hover:-rotate-6 transition-transform duration-500" 
      />

      <div className="relative z-10">
        <StaticStars rating={r.rating || 5} />
        
        <p className="mt-5 text-[15px] text-slate-600 leading-relaxed line-clamp-4 min-h-[90px]">
          "{r.review}"
        </p>
        
        <div className="mt-6 pt-6 border-t border-slate-100 flex items-center gap-4">
          {r.user?.image ? (
            <img
              src={r.user?.image}
              alt={r.user?.firstName}
              className="h-11 w-11 rounded-full object-cover border-2 border-white shadow-sm"
            />
          ) : (
            <div className="h-11 w-11 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-sm border-2 border-white shadow-sm">
              {r.user?.firstName?.charAt(0)}{r.user?.lastName?.charAt(0)}
            </div>
          )}
          
          <div className="min-w-0 flex-1">
            <p className="text-sm font-bold text-slate-900 truncate">
              {r.user?.firstName} {r.user?.lastName}
            </p>
            <p className="text-xs font-medium text-indigo-600 truncate mt-0.5">
              {r.course?.courseName || "CodevolveX Student"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ReviewsMarquee() {
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    async function load() {
      const data = await getAllReviews();
      setReviews(data || []);
    }
    load();
  }, []);

  if (reviews.length === 0) return null;

  const track = [...reviews, ...reviews, ...reviews, ...reviews];

  return (
    <section className="py-24 bg-slate-50 overflow-hidden font-sans">
      
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16 text-center flex flex-col items-center">
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="inline-flex items-center gap-2 bg-indigo-100 text-indigo-700 text-sm font-bold px-4 py-2 rounded-full mb-6 shadow-sm"
        >
          <Sparkles size={16} />
          Learner Outcomes
        </motion.div>
        
        <motion.h2 
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight"
        >
          Don't just take our word for it.
        </motion.h2>
        
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="mt-4 text-lg text-slate-500 font-medium max-w-2xl"
        >
          Join thousands of developers who have accelerated their careers through our structured learning paths.
        </motion.p>
      </div>

       
      <div className="relative flex flex-col gap-6">
        
        <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-slate-50 to-transparent z-20 pointer-events-none" />
        <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-slate-50 to-transparent z-20 pointer-events-none" />

        <div className="flex animate-marquee-fast hover:[animation-play-state:paused] py-2">
          {track.map((r, i) => (
            <ReviewCard key={`row1-${r._id}-${i}`} r={r} />
          ))}
        </div>
      </div>

      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee-fast {
          animation: marquee 50s linear infinite;
          width: max-content;
          will-change: transform;
        }
      `}</style>
    </section>
  );
}