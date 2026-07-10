import React, { useEffect, useState } from "react";
import { Star, Terminal, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";
import { getAllReviews } from "../../services/operations/courseApi";

function StaticStars({ rating, size = 15, className = "" }) {
  const fullStars = Math.floor(rating);
  return (
    <div className={`flex items-center gap-0.5 ${className}`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          size={size}
          className={
            i < fullStars
              ? "fill-[#ffb454] text-[#ffb454]"
              : "fill-transparent text-[#3a3a40]"
          }
        />
      ))}
    </div>
  );
}

function ReviewCard({ r }) {
  const initials = `${r.user?.firstName?.charAt(0) || ""}${
    r.user?.lastName?.charAt(0) || ""
  }`;
  const slug =
    (r.course?.courseName || "student-review")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .slice(0, 18) || "review";

  return (
    <div className="shrink-0 w-[360px] h-[280px] mx-3 [perspective:1400px] group">
      <div
        className="relative w-full h-full transition-transform duration-[650ms] [transform-style:preserve-3d]"
        style={{ transitionTimingFunction: "cubic-bezier(0.23, 1, 0.32, 1)" }}
        onMouseEnter={(e) =>
          (e.currentTarget.style.transform = "rotateY(180deg)")
        }
        onMouseLeave={(e) => (e.currentTarget.style.transform = "rotateY(0deg)")}
      >
        {/* FRONT — terminal log look */}
        <div className="absolute inset-0 [backface-visibility:hidden] rounded-2xl border border-[#232328] bg-[#141417] p-6 flex flex-col overflow-hidden">
          <div className="flex items-center gap-2 pb-4 mb-4 border-b border-[#232328]">
            <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f56]/50" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]/50" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#27c93f]/50" />
            <span className="ml-2 font-['JetBrains_Mono'] text-[11px] text-[#5c5c64] truncate">
              ~/reviews/{slug}.log
            </span>
          </div>

          <StaticStars rating={r.rating || 5} />

          <p className="mt-4 text-[14.5px] leading-relaxed text-[#c9c7c2] font-['IBM_Plex_Sans'] line-clamp-5 flex-1">
            {r.review}
          </p>

          <div className="mt-4 pt-4 border-t border-[#232328] flex items-center justify-between">
            <p className="font-['Space_Grotesk'] font-bold text-sm text-[#ede9e4] truncate">
              {r.user?.firstName} {r.user?.lastName}
            </p>
            <span className="font-['JetBrains_Mono'] text-[10px] text-[#ffb454]/80 flex items-center gap-1">
              <Terminal size={11} /> hover
            </span>
          </div>
        </div>

        {/* BACK — full photo takeover */}
        <div className="absolute inset-0 [backface-visibility:hidden] [transform:rotateY(180deg)] rounded-2xl overflow-hidden border border-[#ffb454]/30">
          {r.user?.image ? (
            <img
              src={r.user.image}
              alt={r.user?.firstName}
              className="absolute inset-0 w-full h-full object-cover"
            />
          ) : (
            <div className="absolute inset-0 bg-[#1a1a1d] flex items-center justify-center">
              <span className="font-['Space_Grotesk'] font-black text-[110px] text-[#232328]">
                {initials}
              </span>
            </div>
          )}

          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-black/10" />

          <div className="absolute top-4 right-4 flex items-center gap-1 bg-black/50 backdrop-blur-sm border border-[#ffb454]/30 rounded-full px-2.5 py-1">
            <CheckCircle2 size={12} className="text-[#ffb454]" />
            <span className="font-['JetBrains_Mono'] text-[10px] text-[#ffb454]">
              verified
            </span>
          </div>

          <div className="absolute bottom-0 left-0 right-0 p-6">
            <StaticStars rating={r.rating || 5} size={13} className="mb-2" />
            <p className="font-['IBM_Plex_Sans'] text-[13px] italic text-[#ede9e4]/90 line-clamp-3 mb-3">
              "{r.review}"
            </p>
            <p className="font-['Space_Grotesk'] font-bold text-sm text-white">
              {r.user?.firstName} {r.user?.lastName}
            </p>
            <p className="font-['JetBrains_Mono'] text-[11px] text-[#ffb454]/80 truncate">
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
    <section className="py-24 bg-[#0b0b0d] overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16 text-center flex flex-col items-center">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="inline-flex items-center gap-2 border border-[#232328] bg-[#141417] text-[#ffb454] font-['JetBrains_Mono'] text-xs px-4 py-2 rounded-full mb-6"
        >
          <Terminal size={13} />
          $ cat reviews.log
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="font-['Space_Grotesk'] text-4xl md:text-5xl font-black text-[#ede9e4] tracking-tight"
        >
          Don't just take our word for it.
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="mt-4 text-lg text-[#8a8a92] font-['IBM_Plex_Sans'] max-w-2xl"
        >
          Join thousands of developers who have accelerated their careers through our structured learning paths.
        </motion.p>
      </div>

      <div className="relative flex flex-col gap-6">
        <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-[#0b0b0d] to-transparent z-20 pointer-events-none" />
        <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-[#0b0b0d] to-transparent z-20 pointer-events-none" />

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