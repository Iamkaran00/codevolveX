import React, { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { motion, useReducedMotion } from "framer-motion";
import { HiArrowDownTray, HiCalendarDays, HiReceiptPercent } from "react-icons/hi2";

import { getPurchaseHistory } from "../services/operations/profileApi";
import { generateReceipt } from "../utils/generatePDF";

const EASE = [0.23, 1, 0.32, 1];

const display = "font-['Space_Grotesk',ui-sans-serif,system-ui,sans-serif]";
const mono = "font-['JetBrains_Mono',ui-monospace,monospace]";

const GRAIN = `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.8' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>")`;

const listV = { hidden: {}, show: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } } };
const rowV = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.85, ease: EASE } },
};

const pad = (n) => String(n).padStart(2, "0");
const rupees = (n) => `₹${Number(n ?? 0).toLocaleString("en-IN")}`;

const Grain = () => (
  <div
    aria-hidden
    className="pointer-events-none absolute inset-0 opacity-[0.06] mix-blend-overlay"
    style={{ backgroundImage: GRAIN }}
  />
);

const Skeleton = () => (
  <div className="h-44 animate-pulse rounded-3xl border border-white/[0.06] bg-white/[0.03]" />
);

const PurchaseHistory = () => {
  const { token } = useSelector((state) => state.auth);
  const { user } = useSelector((state) => state.profile);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const reduce = useReducedMotion();

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const data = await getPurchaseHistory(token);
        setOrders(data || []);
      } catch (err) {
        console.error("Failed to load purchase history", err);
        setOrders([]);
      } finally {
        setLoading(false);
      }
    }
    if (token) load();
  }, [token]);

  const totalSpent = useMemo(
    () => orders.reduce((sum, o) => sum + (Number(o.amount) || 0), 0),
    [orders]
  );

  return (
    <div className="relative w-full min-h-[calc(100vh-120px)] px-5 py-8 sm:px-8 sm:py-10 lg:px-12 lg:py-12">
      {/* header */}
      <div className="mb-10 flex flex-col justify-between gap-8 border-b border-white/[0.07] pb-8 sm:flex-row sm:items-end">
        <div>
          <div className="flex items-center gap-3">
            <span className="h-px w-8 bg-[#ffb454]" />
            <p className={`text-[11px] uppercase tracking-[0.25em] text-zinc-500 ${mono}`}>
              Dashboard · billing
            </p>
          </div>
          <h1
            className={`mt-5 text-3xl font-semibold leading-[1.05] tracking-tight text-[#f3ece0] sm:text-4xl ${display}`}
          >
            Purchase history<span className="text-[#ffb454]">.</span>
          </h1>
          <p className="mt-3 max-w-md text-sm leading-relaxed text-zinc-500">
            A record of every course you've purchased.
          </p>
        </div>

        {!loading && orders.length > 0 && (
          <dl className="flex gap-8 sm:text-right">
            <div>
              <dd
                className={`text-3xl font-semibold tabular-nums text-[#ffb454] sm:text-4xl ${display}`}
              >
                {rupees(totalSpent)}
              </dd>
              <dt className={`mt-1 text-[11px] uppercase tracking-[0.2em] text-zinc-600 ${mono}`}>
                Total spent
              </dt>
            </div>
            <div>
              <dd
                className={`text-3xl font-semibold tabular-nums text-[#f3ece0] sm:text-4xl ${display}`}
              >
                {pad(orders.length)}
              </dd>
              <dt className={`mt-1 text-[11px] uppercase tracking-[0.2em] text-zinc-600 ${mono}`}>
                {orders.length === 1 ? "Order" : "Orders"}
              </dt>
            </div>
          </dl>
        )}
      </div>

      {loading ? (
        <div className="flex flex-col gap-4" role="status" aria-label="Loading purchases">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} />
          ))}
        </div>
      ) : orders.length === 0 ? (
        <div className="relative flex min-h-[280px] flex-col items-center justify-center overflow-hidden rounded-3xl border border-dashed border-[#ffb454]/30 px-8 py-16 text-center">
          <Grain />
          <span className="relative flex h-14 w-14 items-center justify-center rounded-full border border-white/15 text-[#ffb454]">
            <HiReceiptPercent className="h-6 w-6" />
          </span>
          <h3 className={`relative mt-6 text-2xl font-semibold text-[#f3ece0] ${display}`}>
            No purchases yet
          </h3>
          <p className="relative mt-2 text-sm text-zinc-500">
            Your transaction history will appear here.
          </p>
        </div>
      ) : (
        <motion.ul
          variants={listV}
          initial={reduce ? false : "hidden"}
          animate="show"
          className="flex flex-col gap-4"
        >
          {orders.map((order, i) => (
            <motion.li
              key={order._id}
              variants={rowV}
              className="group relative overflow-hidden rounded-3xl border border-white/[0.08] bg-[#14130f] transition-all duration-500 hover:-translate-y-1 hover:border-[#ffb454]/40"
            >
              <Grain />

              <div className="relative grid sm:grid-cols-[1fr_auto]">
                {/* main */}
                <div className="p-6 sm:p-7">
                  <div className="flex items-center gap-3">
                    <span className={`text-xs text-zinc-700 ${mono}`}>{pad(i + 1)}</span>
                    <span className="h-px w-6 bg-[#ffb454]" />
                    <span
                      className={`flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] text-zinc-500 ${mono}`}
                    >
                      <HiCalendarDays className="h-3.5 w-3.5" />
                      {new Date(order.createdAt).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </span>
                  </div>

                  <ul className="mt-6 flex flex-col gap-3">
                    {order.courses?.map((course) => (
                      <li key={course._id} className="flex items-center gap-4">
                        <img
                          src={course.thumbnail}
                          alt={course.courseName}
                          className="h-11 w-16 shrink-0 rounded-xl border border-white/[0.08] object-cover opacity-80 saturate-[0.7] transition-all duration-700 group-hover:opacity-100 group-hover:saturate-100"
                        />
                        <p
                          className={`truncate text-[15px] font-medium text-[#f3ece0] ${display}`}
                        >
                          {course.courseName}
                        </p>
                      </li>
                    ))}
                  </ul>

                  <p
                    className={`mt-6 truncate border-t border-white/[0.06] pt-4 text-[11px] text-zinc-600 ${mono}`}
                  >
                    Payment ID · <span className="text-zinc-400">{order.razorpay_payment_id}</span>
                  </p>
                </div>

                {/* stub */}
                <div className="flex flex-row items-center justify-between gap-5 border-t border-dashed border-white/15 p-6 sm:min-w-[210px] sm:flex-col sm:items-end sm:justify-between sm:border-l sm:border-t-0 sm:p-7">
                  <div className="sm:text-right">
                    <p
                      className={`text-[11px] uppercase tracking-[0.2em] text-zinc-600 ${mono}`}
                    >
                      Total
                    </p>
                    <p
                      className={`mt-1 text-3xl font-semibold leading-none tracking-tight text-[#f3ece0] tabular-nums sm:text-4xl ${display}`}
                    >
                      {rupees(order.amount)}
                      <span className="text-[#ffb454]">.</span>
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => generateReceipt(order, user)}
                    className="group/btn flex shrink-0 cursor-pointer items-center gap-2 rounded-full border border-white/15 px-5 py-2.5 text-sm text-zinc-300 transition-all duration-500 hover:border-[#ffb454] hover:bg-[#ffb454] hover:text-[#1d1a16] active:scale-[0.98]"
                  >
                    <HiArrowDownTray className="h-4 w-4 transition-transform duration-500 group-hover/btn:translate-y-0.5" />
                    Receipt
                  </button>
                </div>
              </div>
            </motion.li>
          ))}
        </motion.ul>
      )}
    </div>
  );
};

export default PurchaseHistory;