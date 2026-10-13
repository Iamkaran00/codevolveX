import React, { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { HiStar, HiXMark } from "react-icons/hi2";
import { getAverageRating, getReviewsForCourse } from "../../services/operations/courseApi";

const EASE = [0.23, 1, 0.32, 1];

const display = "font-['Space_Grotesk',ui-sans-serif,system-ui,sans-serif]";
const mono = "font-['JetBrains_Mono',ui-monospace,monospace]";

const GRAIN = `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.8' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>")`;

const outline = { WebkitTextStroke: "1px rgba(243,236,220,0.25)" };

const gridV = { hidden: {}, show: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } } };
const cardV = {
  hidden: { opacity: 0, y: 22 },
  show: { opacity: 1, y: 0, transition: { duration: 0.9, ease: EASE } },
};

/* ------------------------------------------------------------------ */
/*  Pieces                                                             */
/* ------------------------------------------------------------------ */

// Five stars with exact partial fill (4.3 fills 4 stars and 30% of the fifth)
const Stars = ({ value = 0, size = 16 }) => {
  const pct = Math.max(0, Math.min(5, value)) * 20;
  const row = (cls) => (
    <span className="flex gap-0.5">
      {[0, 1, 2, 3, 4].map((i) => (
        <HiStar key={i} size={size} className={`shrink-0 ${cls}`} />
      ))}
    </span>
  );
  return (
    <span
      className="relative inline-flex"
      role="img"
      aria-label={`${Number(value).toFixed(1)} out of 5 stars`}
    >
      {row("text-white/10")}
      <span className="absolute inset-y-0 left-0 overflow-hidden" style={{ width: `${pct}%` }}>
        {row("text-[#ffb454]")}
      </span>
    </span>
  );
};

const Avatar = ({ user }) => {
  const [failed, setFailed] = useState(false);
  const initials =
    `${user?.firstName?.[0] ?? ""}${user?.lastName?.[0] ?? ""}`.toUpperCase() || "?";

  return (
    <span className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-full border border-white/15 bg-white/5 ring-2 ring-[#14130f] transition-colors duration-500 group-hover:border-[#ffb454]/60">
      {user?.image && !failed ? (
        <img
          src={user.image}
          alt={user?.firstName ?? "Reviewer"}
          onError={() => setFailed(true)}
          className="h-full w-full object-cover saturate-[0.8]"
        />
      ) : (
        <span className={`text-xs text-[#ffb454] ${mono}`}>{initials}</span>
      )}
    </span>
  );
};

const ReviewCard = ({ r, reduce }) => (
  <motion.li
    layout={!reduce}
    initial={{ opacity: 0, y: 16, scale: 0.98 }}
    animate={{ opacity: 1, y: 0, scale: 1 }}
    exit={{ opacity: 0, scale: 0.96 }}
    transition={{ duration: 0.6, ease: EASE }}
    className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-white/[0.07] bg-white/[0.02] p-6 transition-colors duration-500 hover:border-[#ffb454]/40 hover:bg-[#ffb454]/[0.04]"
  >
    {/* oversized outlined quote mark */}
    <span
      aria-hidden
      className={`pointer-events-none absolute -top-2 right-4 select-none text-[7rem] font-semibold leading-none text-transparent transition-all duration-500 group-hover:[-webkit-text-stroke:1px_rgba(255,180,84,0.6)] ${display}`}
      style={outline}
    >
      &rdquo;
    </span>

    <div className="relative flex items-center justify-between">
      <Stars value={r.rating} size={14} />
      <span className={`text-[11px] tabular-nums text-zinc-600 ${mono}`}>
        {Number(r.rating).toFixed(1)}
      </span>
    </div>

    <p className="relative mt-5 text-[15px] leading-relaxed text-zinc-300 transition-colors duration-500 group-hover:text-[#f3ece0]">
      {r.review || <span className="text-zinc-600">Rated without a written review.</span>}
    </p>

    <div className="relative mt-7 flex items-center gap-3.5 border-t border-white/[0.06] pt-5">
      <Avatar user={r.user} />
      <p className={`truncate text-[15px] font-medium text-[#f3ece0] ${display}`}>
        {r.user?.firstName} {r.user?.lastName}
      </p>
    </div>
  </motion.li>
);

/* ------------------------------------------------------------------ */
/*  Section                                                            */
/* ------------------------------------------------------------------ */

export default function CourseReviews({ courseId }) {
  const reduce = useReducedMotion();
  const [reviews, setReviews] = useState([]);
  const [average, setAverage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState(null); // star value or null

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      setFilter(null);
      try {
        const [avg, list] = await Promise.all([
          getAverageRating(courseId),
          getReviewsForCourse(courseId),
        ]);
        if (cancelled) return;
        setAverage(avg || 0);
        setReviews(list || []);
      } catch (err) {
        console.error("Failed to load reviews", err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [courseId]);

  const distribution = useMemo(
    () =>
      [5, 4, 3, 2, 1].map((star) => {
        const count = reviews.filter((r) => Math.round(r.rating) === star).length;
        const pct = reviews.length ? (count / reviews.length) * 100 : 0;
        return { star, count, pct };
      }),
    [reviews]
  );

  const visible = useMemo(
    () => (filter ? reviews.filter((r) => Math.round(r.rating) === filter) : reviews),
    [reviews, filter]
  );

  if (loading) return null;

  const whole = Math.floor(average);
  const decimal = average.toFixed(1).split(".")[1];

  return (
    <motion.section
      initial={reduce ? false : { opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 1, ease: EASE }}
      className="relative overflow-hidden rounded-3xl border border-white/[0.08] bg-[#14130f] p-7 sm:p-10"
    >
      {/* grain */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.06] mix-blend-overlay"
        style={{ backgroundImage: GRAIN }}
      />
      {/* soft amber glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-[#ffb454] opacity-[0.08] blur-3xl"
      />

      <div className="relative">
        {/* header */}
        <div className="flex items-center gap-3">
          <motion.span
            initial={reduce ? false : { scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, ease: EASE, delay: 0.2 }}
            style={{ originX: 0 }}
            className="h-px w-8 bg-[#ffb454]"
          />
          <p className={`text-[11px] uppercase tracking-[0.25em] text-zinc-500 ${mono}`}>
            Feedback · straight from learners
          </p>
        </div>
        <h2
          className={`mt-5 text-3xl font-semibold leading-[1.05] tracking-tight text-[#f3ece0] sm:text-4xl ${display}`}
        >
          Student
          <br />
          feedback<span className="text-[#ffb454]">.</span>
        </h2>

        {reviews.length === 0 ? (
          <div className="mt-10 rounded-2xl border border-dashed border-[#ffb454]/30 px-8 py-16 text-center">
            <p className={`text-2xl font-semibold text-[#f3ece0] ${display}`}>No reviews yet</p>
            <p className="mt-2 text-sm text-zinc-500">
              Be the first to share how this course went.
            </p>
          </div>
        ) : (
          <>
            {/* summary */}
            <div className="mt-10 grid items-center gap-10 border-t border-white/[0.07] pt-10 md:grid-cols-[auto_1fr] md:gap-16">
              <div>
                <p
                  className={`flex items-baseline font-semibold leading-[0.85] tracking-tighter tabular-nums ${display}`}
                >
                  <span className="text-8xl text-[#f3ece0] sm:text-9xl">{whole}</span>
                  <span className="text-5xl text-[#ffb454] sm:text-6xl">.{decimal}</span>
                </p>
                <div className="mt-5">
                  <Stars value={average} size={20} />
                </div>
                <p className={`mt-3 text-[11px] uppercase tracking-[0.2em] text-zinc-600 ${mono}`}>
                  {reviews.length} {reviews.length === 1 ? "review" : "reviews"}
                </p>
              </div>

              {/* distribution (click a row to filter) */}
              <div>
                <p className={`mb-4 text-[11px] uppercase tracking-[0.2em] text-zinc-600 ${mono}`}>
                  Tap a row to filter
                </p>
                <ul className="flex flex-col gap-1.5">
                  {distribution.map(({ star, count, pct }) => {
                    const active = filter === star;
                    const dim = filter && !active;
                    return (
                      <li key={star}>
                        <button
                          type="button"
                          disabled={count === 0}
                          aria-pressed={active}
                          onClick={() => setFilter(active ? null : star)}
                          className={`group flex w-full items-center gap-4 rounded-xl px-3 py-2 text-left outline-none transition-all duration-500 focus-visible:ring-1 focus-visible:ring-[#ffb454]/60 enabled:cursor-pointer enabled:hover:bg-white/[0.04] disabled:opacity-40 ${
                            active ? "bg-[#ffb454]/[0.07]" : ""
                          } ${dim ? "opacity-40" : ""}`}
                        >
                          <span
                            className={`flex w-9 shrink-0 items-center gap-1 text-xs ${mono} ${
                              active ? "text-[#ffb454]" : "text-zinc-400"
                            }`}
                          >
                            {star}
                            <HiStar size={12} className="text-[#ffb454]" />
                          </span>

                          <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/[0.07]">
                            <motion.span
                              initial={reduce ? false : { width: 0 }}
                              whileInView={{ width: `${pct}%` }}
                              viewport={{ once: true }}
                              transition={{ duration: 1.2, ease: EASE, delay: 0.2 }}
                              className="block h-full rounded-full bg-[#ffb454]"
                            />
                          </span>

                          <span className={`w-8 shrink-0 text-right text-xs tabular-nums text-zinc-500 ${mono}`}>
                            {count}
                          </span>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>

            {/* filter status */}
            <div className="mt-10 flex min-h-[40px] items-center justify-between gap-4 border-t border-white/[0.07] pt-6">
              <p className={`text-[11px] uppercase tracking-[0.2em] text-zinc-500 ${mono}`}>
                {filter
                  ? `Showing ${visible.length} of ${reviews.length} · ${filter} star`
                  : `All ${reviews.length} ${reviews.length === 1 ? "review" : "reviews"}`}
              </p>
              {filter && (
                <button
                  type="button"
                  onClick={() => setFilter(null)}
                  className={`group inline-flex items-center gap-2 rounded-full border border-white/15 px-4 py-2 text-[11px] uppercase tracking-[0.2em] text-zinc-400 transition-all duration-500 hover:border-[#ffb454]/60 hover:text-[#ffb454] ${mono}`}
                >
                  <HiXMark className="h-3.5 w-3.5" />
                  Clear
                </button>
              )}
            </div>

            {/* reviews */}
            <motion.ul
              variants={gridV}
              initial={reduce ? false : "hidden"}
              whileInView="show"
              viewport={{ once: true, margin: "-60px" }}
              className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-2"
            >
              <AnimatePresence mode="popLayout" initial={false}>
                {visible.map((r, i) => (
                  <ReviewCard key={r._id ?? i} r={r} reduce={reduce} />
                ))}
              </AnimatePresence>
            </motion.ul>
          </>
        )}
      </div>
    </motion.section>
  );
}