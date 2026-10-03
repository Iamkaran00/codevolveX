import React, { useEffect, useMemo, useState } from "react";
import { Star, Terminal } from "lucide-react";
import { motion } from "framer-motion";
import { getAllReviews } from "../../services/operations/courseApi";

 

const SECONDS_PER_CARD = 3;  
const MIN_PER_ROW = 6;  

 

const nameOf = (r) =>
  `${r.user?.firstName || ""} ${r.user?.lastName || ""}`.trim() || "Student";

const initialsOf = (r) =>
  `${r.user?.firstName?.charAt(0) || ""}${r.user?.lastName?.charAt(0) || ""}` ||
  "?";

const handleOf = (r) =>
  (r.user?.firstName || "student").toLowerCase().replace(/[^a-z0-9]/g, "") ||
  "student";

function Stars({ rating = 5, size = 12, className = "" }) {
  const full = Math.floor(rating);
  return (
    <div className={`flex items-center gap-0.5 ${className}`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          size={size}
          className={
            i < full
              ? "fill-[#ffb454] text-[#ffb454]"
              : "fill-transparent text-[#4a4a52]"
          }
        />
      ))}
    </div>
  );
}
 
function ReviewCard({ r }) {
  return (
    <div className="shrink-0 w-[320px] sm:w-[380px] pr-4">
      <div className="rv-card h-[300px]" tabIndex={0}>
       <div className="rv-inner relative h-full w-full">
        {/* front: a little terminal window with the review */}
        <div className="rv-face absolute inset-0 flex flex-col overflow-hidden rounded-2xl border border-[#26262c] bg-[#111115]">
          <div className="flex items-center gap-1.5 px-3 py-2 border-b border-[#26262c]">
            <span className="w-2 h-2 rounded-full bg-[#ff5f56]/70" />
            <span className="w-2 h-2 rounded-full bg-[#ffbd2e]/70" />
            <span className="w-2 h-2 rounded-full bg-[#27c93f]/70" />
            <span className="ml-2 font-['JetBrains_Mono'] text-[10.5px] text-[#5c5c64] truncate">
              review_{handleOf(r)}.log
            </span>
          </div>

          <div className="flex-1 min-h-0 px-4 pt-3">
            <p className="font-['JetBrains_Mono'] text-[11px] text-[#ffb454]">
              <span className="text-[#5c5c64]">$ </span>cat review.txt
            </p>
            <p className="mt-2 font-['IBM_Plex_Sans'] text-[14px] leading-relaxed text-[#d8d5d0] line-clamp-5">
              {r.review}
            </p>
          </div>

          <div className="flex items-center justify-between px-4 py-3">
            <span className="font-['JetBrains_Mono'] text-[11px] text-[#27c93f] truncate">
              {handleOf(r)}@codevolvex
            </span>
            <Stars rating={r.rating || 5} />
          </div>
        </div>

        {/* back: the card flips and their photo fills the box */}
        <div className="rv-face rv-back absolute inset-0 overflow-hidden rounded-2xl border border-[#ffb454]/40 bg-[#111115]">
          {r.user?.image ? (
            <img
              src={r.user.image}
              alt={nameOf(r)}
              className="absolute inset-0 h-full w-full object-cover"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-[#2a2112] to-[#111115] font-['Space_Grotesk'] text-8xl font-black text-[#ffb454]/40">
              {initialsOf(r)}
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/60 to-black/20" />

          <div className="absolute inset-0 flex flex-col justify-end p-4">
            <Stars rating={r.rating || 5} size={13} />
            <p className="mt-2 font-['Space_Grotesk'] text-[18px] font-bold text-white truncate">
              {nameOf(r)}
            </p>
            <p className="font-['JetBrains_Mono'] text-[11px] text-[#ffb454] truncate">
              {r.course?.courseName || "CodevolveX student"}
            </p>
          </div>
        </div>
       </div>
      </div>
    </div>
  );
}

/* ---------- one sliding row ---------- */

function Row({ items, reverse }) {
  const duration = items.length * SECONDS_PER_CARD;
  return (
    <div className="rv-row overflow-hidden">
      <div
        className={`rv-track flex w-max ${reverse ? "rv-right" : "rv-left"}`}
        style={{ animationDuration: `${duration}s` }}
      >
        {[...items, ...items].map((r, i) => (
          <ReviewCard key={i} r={r} />
        ))}
      </div>
    </div>
  );
}

/* ---------- section ---------- */

export default function ReviewsMarquee() {
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    async function load() {
      const data = await getAllReviews();
      setReviews(data || []);
    }
    load();
  }, []);

  const row = useMemo(() => {
    if (!reviews.length) return [];
    let out = reviews;
    while (out.length < MIN_PER_ROW) out = out.concat(reviews);
    return out;
  }, [reviews]);

  if (reviews.length === 0) return null;

  return (
    <section className="py-24 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-14 text-center flex flex-col items-center">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
          className="inline-flex items-center gap-2 border border-slate-200 bg-slate-50 text-slate-600 font-['JetBrains_Mono'] text-xs px-4 py-2 rounded-full mb-6"
        >
          <Terminal size={13} className="text-[#e89a2c]" />
          $ cat reviews.log
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1, ease: [0.23, 1, 0.32, 1] }}
          className="font-['Space_Grotesk'] text-4xl md:text-5xl font-black text-slate-900 tracking-tight"
        >
          Don't just take our word for it.
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2, ease: [0.23, 1, 0.32, 1] }}
          className="mt-4 text-lg text-slate-500 font-['IBM_Plex_Sans'] max-w-2xl"
        >
          Real reviews from learners on CodevolveX. Hover a card to see who
          wrote it.
        </motion.p>
      </div>

      {/* outer dark box: side margins let the white page show on left and right */}
      <div className="mx-4 sm:mx-8 lg:mx-16">
        <div className="relative rounded-[2rem] bg-[#0c0c0f] py-8 sm:py-10 overflow-hidden">
          {/* soft amber glow in the corners */}
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "radial-gradient(ellipse at 0% 0%, rgba(255,180,84,0.10), transparent 45%), radial-gradient(ellipse at 100% 100%, rgba(255,180,84,0.10), transparent 45%)",
            }}
          />

          <Row items={row} />

          {/* dark, faded corners: cards dim and blur out as they slide in and out */}
          <div className="pointer-events-none absolute inset-y-0 left-0 w-24 sm:w-48 bg-gradient-to-r from-[#0c0c0f] via-[#0c0c0f]/80 to-transparent backdrop-blur-[2px] [mask-image:linear-gradient(to_right,#000_40%,transparent)]" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-24 sm:w-48 bg-gradient-to-l from-[#0c0c0f] via-[#0c0c0f]/80 to-transparent backdrop-blur-[2px] [mask-image:linear-gradient(to_left,#000_40%,transparent)]" />
        </div>
      </div>

      <style>{`
        .rv-track { animation-timing-function: linear; animation-iteration-count: infinite; }
        .rv-left  { animation-name: rv-left; }
        .rv-right { animation-name: rv-right; }
        @keyframes rv-left  { from { transform: translateX(0); }    to { transform: translateX(-50%); } }
        @keyframes rv-right { from { transform: translateX(-50%); } to { transform: translateX(0); } }
        .rv-row { overflow: hidden; scrollbar-width: none; }
        .rv-row::-webkit-scrollbar { display: none; }
        .rv-card { perspective: 1000px; }
        .rv-card:focus { outline: none; }
        .rv-inner {
          transform-style: preserve-3d;
          transition: transform 0.7s cubic-bezier(0.23, 1, 0.32, 1);
        }
        .rv-face {
          backface-visibility: hidden;
          -webkit-backface-visibility: hidden;
        }
        .rv-back { transform: rotateY(180deg); }
        @media (hover: hover) {
          .rv-card:hover .rv-inner { transform: rotateY(180deg); }
        }
        .rv-card:focus-within .rv-inner { transform: rotateY(180deg); }
        .rv-row:hover .rv-track { animation-play-state: paused; }
      `}</style>
    </section>
  );
}