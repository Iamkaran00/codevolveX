import React from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { motion, useReducedMotion } from "framer-motion";
import {
  HiArrowRight,
  HiBolt,
  HiShoppingCart,
  HiUsers,
  HiClock,
  HiGlobeAlt,
  HiTrophy,
  HiBookOpen,
  HiStar,
} from "react-icons/hi2";
import { addToCart } from "../../../slices/cart.slice";

const EASE = [0.23, 1, 0.32, 1];

const display = "font-['Space_Grotesk',ui-sans-serif,system-ui,sans-serif]";
const mono = "font-['JetBrains_Mono',ui-monospace,monospace]";

const GRAIN = `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.8' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>")`;

const listV = { hidden: {}, show: { transition: { staggerChildren: 0.08, delayChildren: 0.35 } } };
const rowV = {
  hidden: { opacity: 0, x: -10 },
  show: { opacity: 1, x: 0, transition: { duration: 0.7, ease: EASE } },
};

export function CourseDetailsCard({ course, totalDuration, user, onEnroll }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const reduce = useReducedMotion();

  // reading cart state from redux store
  const { cart } = useSelector((state) => state.cart);

  const isCourseInCart = (cart ?? []).some((item) => item._id === course?._id);
  const rating = course.ratingAndReviews?.length
    ? course.ratingAndReviews.reduce((s, r) => s + r.rating, 0) /
      course.ratingAndReviews.length
    : 0;
  const enrolled = course.studentsEnrolled?.length ?? 0;

  const handleAddToCart = () => {
    if (isCourseInCart) {
      navigate("/dashboard/mycart");
      return;
    }
    dispatch(addToCart(course));
  };

  const facts = [
    { icon: HiUsers, label: `${enrolled.toLocaleString("en-IN")} students enrolled` },
    { icon: HiClock, label: `${totalDuration} total duration` },
    { icon: HiGlobeAlt, label: "Full lifetime access" },
    { icon: HiTrophy, label: "Certificate of completion" },
  ];

  return (
    <motion.aside
      initial={reduce ? false : { opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1, ease: EASE }}
      className="group/card sticky top-24 overflow-hidden rounded-3xl border border-white/[0.08] bg-[#14130f]"
    >
      {/* grain */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-10 opacity-[0.06] mix-blend-overlay"
        style={{ backgroundImage: GRAIN }}
      />

      {/* thumbnail */}
      <div className="relative aspect-video w-full overflow-hidden bg-white/5">
        {course.thumbnail ? (
          <img
            src={course.thumbnail}
            alt={course.courseName}
            className="absolute inset-0 h-full w-full object-cover opacity-80 saturate-[0.7] transition-all duration-[1200ms] ease-out group-hover/card:scale-[1.04] group-hover/card:opacity-100 group-hover/card:saturate-100"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <HiBookOpen size={44} className="text-zinc-700" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#14130f] via-transparent to-transparent" />

        {rating > 0 && (
          <span
            className={`absolute right-4 top-4 inline-flex items-center gap-1.5 rounded-full border border-[#ffb454]/40 bg-[#100f0d]/70 px-3 py-1 text-[11px] tracking-widest text-[#ffb454] backdrop-blur-sm ${mono}`}
          >
            <HiStar size={12} />
            <span className="tabular-nums">{rating.toFixed(1)}</span>
          </span>
        )}
      </div>

      <div className="relative z-20 space-y-7 p-6 sm:p-7">
        {/* price */}
        <div>
          <div className="flex items-center gap-3">
            <span className="h-px w-8 bg-[#ffb454]" />
            <p className={`text-[11px] uppercase tracking-[0.25em] text-zinc-500 ${mono}`}>
              Price
            </p>
          </div>
          <p
            className={`mt-4 text-5xl font-semibold leading-none tracking-tight ${display} ${
              course.price === 0 ? "text-[#ffb454]" : "text-[#f3ece0]"
            }`}
          >
            {course.price === 0 ? (
              "Free"
            ) : (
              <>
                ₹{course.price?.toLocaleString("en-IN")}
                <span className="text-[#ffb454]">.</span>
              </>
            )}
          </p>
        </div>

        {/* actions */}
        {user?.accountType === "Student" && (
          <div className="flex flex-col gap-3">
            <motion.button
              type="button"
              onClick={onEnroll}
              whileTap={{ scale: 0.98 }}
              className="group flex w-full cursor-pointer items-center justify-center gap-2 rounded-full bg-[#ffb454] px-8 py-4 text-sm font-semibold text-[#1d1a16] transition-colors duration-500 hover:bg-[#ffc272]"
            >
              <HiBolt className="h-4 w-4" />
              Enroll now
              <HiArrowRight className="h-4 w-4 transition-transform duration-500 group-hover:translate-x-1" />
            </motion.button>

            <motion.button
              type="button"
              onClick={handleAddToCart}
              whileTap={{ scale: 0.98 }}
              className="group flex w-full cursor-pointer items-center justify-center gap-2 rounded-full border border-white/15 px-8 py-4 text-sm text-zinc-300 transition-all duration-500 hover:border-[#ffb454]/60 hover:bg-[#ffb454]/10 hover:text-[#ffb454]"
            >
              {isCourseInCart ? (
                <>
                  Go to cart
                  <HiArrowRight className="h-4 w-4 transition-transform duration-500 group-hover:translate-x-1" />
                </>
              ) : (
                <>
                  <HiShoppingCart className="h-4 w-4" />
                  Add to cart
                </>
              )}
            </motion.button>
          </div>
        )}

        {/* facts */}
        <motion.ul
          variants={listV}
          initial={reduce ? false : "hidden"}
          animate="show"
          className="flex flex-col gap-4 border-t border-white/[0.07] pt-6"
        >
          {facts.map(({ icon: Icon, label }) => (
            <motion.li
              key={label}
              variants={rowV}
              className="flex items-center gap-4 text-sm text-zinc-400"
            >
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-white/10 text-[#ffb454]">
                <Icon size={15} />
              </span>
              {label}
            </motion.li>
          ))}
        </motion.ul>
      </div>
    </motion.aside>
  );
}