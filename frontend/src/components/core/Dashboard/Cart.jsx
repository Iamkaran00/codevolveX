import React from "react"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import { AnimatePresence, motion, useReducedMotion } from "framer-motion"
import { BookOpen, ShoppingCart, Trash2, ArrowRight, ShieldCheck } from "lucide-react"
import { toast } from "react-toastify"

import { removeFromCart, resetCart } from "../../../slices/cart.slice"
import { buyCourse } from "../../../services/operations/paymentAPI"

const EASE = [0.23, 1, 0.32, 1]

const display = "font-['Space_Grotesk',ui-sans-serif,system-ui,sans-serif]"
const mono = "font-['JetBrains_Mono',ui-monospace,monospace]"

const GRAIN = `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.8' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>")`

const FOCUS = "outline-none focus-visible:ring-1 focus-visible:ring-[#ffb454]/70"

const inr = (n) => `₹${Number(n ?? 0).toLocaleString("en-IN")}`

/* ------------------------------------------------------------------ */
/*  Order summary, laid out like a receipt                             */
/* ------------------------------------------------------------------ */

const Receipt = ({ cart, total, totalItems, onCheckout }) => (
  <div className="relative w-full shrink-0 lg:sticky lg:top-24 lg:w-[340px]">
    <div className="overflow-hidden rounded-3xl border border-white/[0.08] bg-[#14130f]">
      <div className="px-7 pb-6 pt-7">
        <p className={`text-xs text-zinc-500 ${mono}`}>Order summary</p>

        <ul className="mt-5 flex flex-col gap-3">
          {cart.map((course) => (
            <li key={course._id} className="flex items-baseline justify-between gap-4">
              <span className="truncate text-sm text-zinc-400">{course?.courseName}</span>
              <span className={`shrink-0 text-sm tabular-nums text-zinc-300 ${mono}`}>
                {inr(course?.price)}
              </span>
            </li>
          ))}
        </ul>
      </div>

      {/* torn edge: dashed rule with two notches cut into the card */}
      <div className="relative h-0">
        <span aria-hidden className="absolute -left-3 top-1/2 h-6 w-6 -translate-y-1/2 rounded-full border border-white/[0.08] bg-[#100f0d]" />
        <span aria-hidden className="absolute -right-3 top-1/2 h-6 w-6 -translate-y-1/2 rounded-full border border-white/[0.08] bg-[#100f0d]" />
        <div className="mx-6 border-t border-dashed border-white/15" />
      </div>

      <div className="px-7 pb-7 pt-6">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className={`text-xs text-zinc-500 ${mono}`}>
              Total, {totalItems} {totalItems === 1 ? "course" : "courses"}
            </p>
            <p className={`mt-2 text-4xl font-semibold tabular-nums tracking-tight text-[#f3ece0] ${display}`}>
              {inr(total)}
            </p>
          </div>
        </div>

        <button
          onClick={onCheckout}
          className={`group mt-7 flex w-full cursor-pointer items-center justify-center gap-2 rounded-full bg-[#ffb454] px-8 py-4 text-sm font-semibold text-[#1d1a16] transition-all duration-500 hover:bg-[#ffc272] active:scale-[0.98] ${FOCUS}`}
        >
          Checkout
          <ArrowRight size={16} className="transition-transform duration-500 group-hover:translate-x-1" />
        </button>

        <p className="mt-4 flex items-center justify-center gap-2 text-xs text-zinc-600">
          <ShieldCheck size={13} />
          Payments are processed securely by Razorpay
        </p>
      </div>
    </div>
  </div>
)

/* ------------------------------------------------------------------ */
/*  Cart                                                               */
/* ------------------------------------------------------------------ */

const Cart = () => {
  const { total, totalItems, cart } = useSelector((state) => state.cart)
  const { token } = useSelector((state) => state.auth)
  const { user } = useSelector((state) => state.profile)

  const dispatch = useDispatch()
  const navigate = useNavigate()
  const reduce = useReducedMotion()

  const handleBuyCourse = () => {
    if (!token) {
      toast.error("Login First")
      navigate("/login")
      return
    }
    const courses = cart.map((course) => course._id)
    buyCourse(token, courses, user, navigate, dispatch)
  }

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-[#100f0d] px-5 py-10 sm:px-8 lg:py-14">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.06] mix-blend-overlay"
        style={{ backgroundImage: GRAIN }}
      />

      <div className="relative mx-auto max-w-6xl">
        {/* heading */}
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.95, ease: EASE }}
          className="mb-12 flex flex-col justify-between gap-5 sm:flex-row sm:items-end"
        >
          <div>
            <div className="flex items-center gap-3">
              <span className="h-px w-8 bg-[#ffb454]" />
              <p className="text-sm text-zinc-500">Ready when you are</p>
            </div>
            <h1
              className={`mt-5 text-5xl font-semibold leading-[1.02] tracking-tight text-[#f3ece0] sm:text-6xl ${display}`}
            >
              Your cart
            </h1>
          </div>
          <p className="text-lg text-zinc-400">
            {totalItems} {totalItems === 1 ? "course" : "courses"} waiting
          </p>
        </motion.div>

        {total > 0 ? (
          <div className="flex flex-col-reverse items-start gap-8 lg:flex-row lg:gap-10">
            {/* items */}
            <div className="flex w-full flex-col gap-4 lg:flex-1">
              <AnimatePresence mode="popLayout" initial={false}>
                {cart.map((course) => (
                  <motion.article
                    key={course._id}
                    layout={!reduce}
                    initial={reduce ? false : { opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={reduce ? { opacity: 0 } : { opacity: 0, x: -24, scale: 0.97 }}
                    transition={{ duration: 0.6, ease: EASE }}
                    className="group flex flex-col gap-5 rounded-3xl border border-white/[0.08] bg-[#14130f] p-4 transition-colors duration-500 hover:border-[#ffb454]/30 sm:flex-row sm:items-center"
                  >
                    <div className="relative aspect-[16/10] w-full shrink-0 overflow-hidden rounded-2xl bg-white/5 sm:aspect-auto sm:h-[104px] sm:w-[168px]">
                      {course?.thumbnail ? (
                        <img
                          src={course.thumbnail}
                          alt=""
                          className="h-full w-full object-cover opacity-80 saturate-[0.7] transition-all duration-[1200ms] ease-out group-hover:scale-[1.05] group-hover:opacity-100 group-hover:saturate-100"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center">
                          <BookOpen size={28} className="text-zinc-700" />
                        </div>
                      )}
                    </div>

                    <div className="min-w-0 flex-1 sm:py-1">
                      <span className="inline-block rounded-full border border-white/15 px-3 py-1 text-xs text-zinc-400">
                        {course?.category?.name || "Course"}
                      </span>
                      <h3
                        className={`mt-3 line-clamp-2 text-lg font-semibold leading-snug tracking-tight text-[#f3ece0] ${display}`}
                      >
                        {course?.courseName}
                      </h3>
                      <p className="mt-1 text-xs text-zinc-600">
                        {course?.ratingAndReviews?.length
                          ? `${course.ratingAndReviews.length.toLocaleString("en-IN")} ${
                              course.ratingAndReviews.length === 1 ? "review" : "reviews"
                            }`
                          : "No reviews yet"}
                      </p>
                    </div>

                    <div className="flex shrink-0 items-center justify-between gap-5 border-t border-white/[0.07] pt-4 sm:flex-col sm:items-end sm:justify-center sm:border-none sm:pt-0 sm:pr-3">
                      <p className={`text-2xl font-semibold tabular-nums text-[#f3ece0] ${display}`}>
                        {inr(course?.price)}
                      </p>
                      <button
                        onClick={() => dispatch(removeFromCart(course._id))}
                        aria-label={`Remove ${course?.courseName} from cart`}
                        className={`group/remove flex cursor-pointer items-center gap-2 rounded-full border border-white/15 px-4 py-2 text-xs text-zinc-400 transition-all duration-500 hover:border-[#e0816f]/50 hover:bg-[#e0816f]/[0.06] hover:text-[#e0816f] active:scale-[0.97] ${FOCUS}`}
                      >
                        <Trash2 size={13} />
                        Remove
                      </button>
                    </div>
                  </motion.article>
                ))}
              </AnimatePresence>

              <button
                onClick={() => dispatch(resetCart())}
                className={`mt-2 w-fit cursor-pointer rounded-full px-2 py-1 text-sm text-zinc-600 transition-colors duration-500 hover:text-[#e0816f] ${FOCUS}`}
              >
                Remove all courses
              </button>
            </div>

            <Receipt
              cart={cart}
              total={total}
              totalItems={totalItems}
              onCheckout={handleBuyCourse}
            />
          </div>
        ) : (
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: EASE }}
            className="flex flex-col items-center justify-center rounded-3xl border border-white/[0.08] bg-white/[0.02] px-8 py-24 text-center"
          >
            <span className="flex h-16 w-16 items-center justify-center rounded-full border border-white/10">
              <ShoppingCart size={26} className="text-zinc-500" />
            </span>
            <h3 className={`mt-6 text-2xl font-semibold text-[#f3ece0] ${display}`}>
              Your cart is empty
            </h3>
            <p className="mt-2 max-w-sm text-zinc-500">
              Browse the catalogue and add a course to get started.
            </p>
            <button
              onClick={() => navigate("/catalogue")}
              className={`group mt-8 flex cursor-pointer items-center gap-2 rounded-full bg-[#ffb454] px-8 py-4 text-sm font-semibold text-[#1d1a16] transition-all duration-500 hover:bg-[#ffc272] active:scale-[0.98] ${FOCUS}`}
            >
              Explore catalogue
              <ArrowRight size={16} className="transition-transform duration-500 group-hover:translate-x-1" />
            </button>
          </motion.div>
        )}
      </div>
    </div>
  )
}

export default Cart