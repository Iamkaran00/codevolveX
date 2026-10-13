
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { X, ArrowUpRight, Star, MessageSquareText } from "lucide-react";
import { useSelector } from "react-redux";

import { createRating } from "../../services/operations/courseApi";

const EASE = [0.23, 1, 0.32, 1];

const display =
  "font-['Space_Grotesk',ui-sans-serif,system-ui,sans-serif]";

const mono = "font-['JetBrains_Mono',ui-monospace,monospace]";

const AMBER = "#ffb454";

const overlayVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.25 } },
  exit: { opacity: 0, transition: { duration: 0.2 } },
};

const modalVariants = {
  hidden: { opacity: 0, y: 24, scale: 0.97 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.45, ease: EASE },
  },
  exit: {
    opacity: 0,
    y: 12,
    scale: 0.98,
    transition: { duration: 0.2, ease: EASE },
  },
};

export default function WriteReviewModal({
  isOpen,
  onClose,
  courseId,
  onSubmitted,
}) {
  const { token } = useSelector((state) => state.auth);
  const reduceMotion = useReducedMotion();

  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [review, setReview] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const MAX_LENGTH = 1000;
  const displayedRating = hoverRating || rating;

  useEffect(() => {
    if (!isOpen) {
      setRating(0);
      setHoverRating(0);
      setReview("");
      setError("");
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return undefined;

    const handleKeyDown = (event) => {
      if (event.key === "Escape" && !submitting) {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose, submitting]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (rating === 0) {
      setError("Please select a star rating.");
      return;
    }

    if (!review.trim()) {
      setError("Please write a review before submitting.");
      return;
    }

    if (review.trim().length > MAX_LENGTH) {
      setError(`Your review must be ${MAX_LENGTH} characters or fewer.`);
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      const success = await createRating(
        {
          rating,
          review: review.trim(),
          courseId,
        },
        token
      );

      if (success) {
        setRating(0);
        setHoverRating(0);
        setReview("");
        onSubmitted?.();
        onClose();
      } else {
        setError("Unable to submit your review. Please try again.");
      }
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          "Something went wrong. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          variants={overlayVariants}
          initial={reduceMotion ? false : "hidden"}
          animate="show"
          exit="exit"
          onClick={() => !submitting && onClose()}
          className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-black/80 px-4 py-8 backdrop-blur-md"
          role="presentation"
        >
          <motion.div
            variants={modalVariants}
            initial={reduceMotion ? false : "hidden"}
            animate="show"
            exit="exit"
            onClick={(event) => event.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="review-modal-title"
            className="relative my-auto w-full max-w-lg overflow-hidden rounded-[28px] border border-white/[0.09] bg-[#100f0d] text-[#f3ece0] shadow-[0_30px_100px_rgba(0,0,0,0.55)]"
          >
            {/* Ambient amber glow */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -right-24 -top-28 h-64 w-64 rounded-full bg-[#ffb454]/[0.07] blur-[90px]"
            />

            {/* Header */}
            <div className="relative flex items-start justify-between gap-4 border-b border-white/[0.07] px-6 py-6 sm:px-8">
              <div>
                <div className="mb-3 flex items-center gap-2">
                  <span className="h-px w-6 bg-[#ffb454]" />
                  <p
                    className={`${mono} text-[10px] uppercase tracking-[0.2em] text-zinc-500`}
                  >
                    Course feedback
                  </p>
                </div>

                <h2
                  id="review-modal-title"
                  className={`${display} text-2xl font-semibold tracking-tight text-[#f3ece0] sm:text-3xl`}
                >
                  Rate this course<span className="text-[#ffb454]">.</span>
                </h2>

                <p className="mt-2 max-w-sm text-sm leading-relaxed text-zinc-500">
                  Share your experience and help other developers learn better.
                </p>
              </div>

              <button
                type="button"
                onClick={onClose}
                disabled={submitting}
                aria-label="Close review modal"
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/[0.03] text-zinc-400 transition-all duration-300 hover:border-[#ffb454]/40 hover:bg-[#ffb454]/[0.08] hover:text-[#ffb454] disabled:cursor-not-allowed disabled:opacity-50"
              >
                <X size={18} />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="relative px-6 py-7 sm:px-8 sm:py-8">
              {/* Star rating */}
              <div className="rounded-2xl border border-white/[0.07] bg-white/[0.02] px-4 py-6 sm:px-6">
                <div className="flex flex-col items-center text-center">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl border border-[#ffb454]/20 bg-[#ffb454]/[0.08]">
                    <Star
                      size={21}
                      strokeWidth={1.5}
                      className="text-[#ffb454]"
                    />
                  </div>

                  <h3
                    className={`${display} text-lg font-medium text-[#f3ece0]`}
                  >
                    How was your experience?
                  </h3>

                  <p className="mt-1 text-xs text-zinc-500">
                    Select a rating from one to five stars
                  </p>

                  <div
                    className="mt-5 flex items-center gap-2 sm:gap-3"
                    role="group"
                    aria-label="Course rating"
                    onMouseLeave={() => setHoverRating(0)}
                  >
                    {[1, 2, 3, 4, 5].map((value) => {
                      const active = value <= displayedRating;

                      return (
                        <motion.button
                          key={value}
                          type="button"
                          whileHover={reduceMotion ? undefined : { scale: 1.15, y: -2 }}
                          whileTap={reduceMotion ? undefined : { scale: 0.9 }}
                          onMouseEnter={() => setHoverRating(value)}
                          onFocus={() => setHoverRating(value)}
                          onBlur={() => setHoverRating(0)}
                          onClick={() => {
                            setRating(value);
                            setError("");
                          }}
                          aria-label={`${value} ${value === 1 ? "star" : "stars"}`}
                          aria-pressed={rating === value}
                          className="rounded-lg p-1 outline-none focus-visible:ring-2 focus-visible:ring-[#ffb454] focus-visible:ring-offset-4 focus-visible:ring-offset-[#100f0d]"
                        >
                          <Star
                            size={30}
                            strokeWidth={1.5}
                            fill={active ? AMBER : "transparent"}
                            className={
                              active
                                ? "text-[#ffb454] drop-shadow-[0_0_10px_rgba(255,180,84,0.18)]"
                                : "text-zinc-700 transition-colors duration-200 hover:text-zinc-400"
                            }
                          />
                        </motion.button>
                      );
                    })}
                  </div>

                  <motion.p
                    key={displayedRating}
                    initial={reduceMotion ? false : { opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`${mono} mt-4 text-[10px] uppercase tracking-[0.16em] ${
                      displayedRating ? "text-[#ffb454]" : "text-zinc-600"
                    }`}
                    aria-live="polite"
                  >
                    {displayedRating === 0
                      ? "Your rating · 0/5"
                      : [
                          "",
                          "Needs improvement",
                          "Fair experience",
                          "Good experience",
                          "Great experience",
                          "Exceptional experience",
                        ][displayedRating]}
                  </motion.p>
                </div>
              </div>

              {/* Review text */}
              <div className="mt-7">
                <div className="mb-3 flex items-center justify-between gap-3">
                  <label
                    htmlFor="course-review"
                    className="flex items-center gap-2 text-sm font-medium text-[#f3ece0]"
                  >
                    <MessageSquareText size={16} className="text-[#ffb454]" />
                    Your review
                  </label>

                  <span
                    className={`${mono} text-[10px] ${
                      review.length > MAX_LENGTH
                        ? "text-red-400"
                        : "text-zinc-600"
                    }`}
                  >
                    {review.length}/{MAX_LENGTH}
                  </span>
                </div>

                <textarea
                  id="course-review"
                  value={review}
                  onChange={(event) => {
                    setReview(event.target.value);
                    if (error) setError("");
                  }}
                  placeholder="What did you learn? What stood out? Share your thoughts..."
                  rows={5}
                  maxLength={MAX_LENGTH}
                  disabled={submitting}
                  className="w-full resize-none rounded-2xl border border-white/[0.09] bg-white/[0.025] px-4 py-4 text-sm leading-7 text-[#f3ece0] outline-none transition-all duration-300 placeholder:text-zinc-600 hover:border-white/[0.15] focus:border-[#ffb454]/50 focus:bg-white/[0.035] focus:ring-4 focus:ring-[#ffb454]/[0.05] disabled:opacity-50 sm:px-5"
                />

                <p className="mt-2 text-xs leading-relaxed text-zinc-600">
                  Keep it honest, constructive, and helpful to fellow learners.
                </p>
              </div>

              {/* Validation feedback */}
              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, height: 0, y: -4 }}
                    animate={{ opacity: 1, height: "auto", y: 0 }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-4 overflow-hidden"
                  >
                    <p
                      role="alert"
                      className="rounded-xl border border-red-400/15 bg-red-400/[0.06] px-4 py-3 text-sm text-red-300"
                    >
                      {error}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Submit */}
              <motion.button
                type="submit"
                whileHover={
                  reduceMotion || submitting
                    ? undefined
                    : { y: -2, backgroundColor: "#ffc272" }
                }
                whileTap={
                  reduceMotion || submitting ? undefined : { scale: 0.985 }
                }
                disabled={
                  rating === 0 ||
                  review.trim().length === 0 ||
                  review.trim().length > MAX_LENGTH ||
                  submitting
                }
                className="group mt-6 flex w-full items-center justify-center gap-2.5 rounded-full bg-[#ffb454] px-6 py-4 text-sm font-semibold text-[#1d1a16] transition-all duration-300 hover:shadow-[0_8px_35px_rgba(255,180,84,0.12)] disabled:cursor-not-allowed disabled:bg-white/[0.07] disabled:text-zinc-600 disabled:shadow-none"
              >
                {submitting ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-[#1d1a16]/25 border-t-[#1d1a16]" />
                    Submitting review...
                  </>
                ) : (
                  <>
                    Submit review
                    <ArrowUpRight
                      size={17}
                      className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                    />
                  </>
                )}
              </motion.button>

              <p
                className={`${mono} mt-5 text-center text-[9px] uppercase tracking-[0.18em] text-zinc-700`}
              >
                CODEVOLVEX · LEARN BY BUILDING
              </p>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}