import React, { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { motion, useReducedMotion } from "framer-motion";
import {
  IndianRupee,
  Users,
  BookOpen,
  Star,
  Trophy,
  Flame,
  ArrowUpRight,
} from "lucide-react";

import { getInstructorDashboardStats } from "../services/operations/courseApi";

/* ------------------------------------------------------------------ */
/*  Tokens                                                             */
/* ------------------------------------------------------------------ */

const EASE = [0.23, 1, 0.32, 1];

const display = "font-['Space_Grotesk',ui-sans-serif,system-ui,sans-serif]";
const mono = "font-['JetBrains_Mono',ui-monospace,monospace]";

const GRAIN = `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.8' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>")`;

const AMBER = "#ffb454";
const CREAM = "#f3ece0";
const PANEL = "rounded-3xl border border-white/[0.08] bg-[#14130f]";

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

const inr = (n) => `₹${Number(n || 0).toLocaleString("en-IN")}`;

// Indian-style compact numbers: 1.2k, 3.4L, 1.1Cr
const compact = (n) => {
  const v = Number(n || 0);
  if (v >= 1e7) return `${+(v / 1e7).toFixed(1)}Cr`;
  if (v >= 1e5) return `${+(v / 1e5).toFixed(1)}L`;
  if (v >= 1e3) return `${+(v / 1e3).toFixed(1)}k`;
  return String(Math.round(v));
};

const niceMax = (max) => {
  if (max <= 0) return 1;
  const mag = Math.pow(10, Math.floor(Math.log10(max)));
  const steps = [1, 2, 2.5, 5, 10];
  const step = steps.find((s) => s * mag >= max) ?? 10;
  return step * mag;
};

const greeting = () => {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
};

function useCountUp(target, reduce, duration = 1800) {
  const [val, setVal] = useState(reduce ? target : 0);
  useEffect(() => {
    if (reduce) {
      setVal(target);
      return undefined;
    }
    let raf;
    const start = performance.now();
    const tick = (now) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
      setVal(target * eased);
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, reduce, duration]);
  return val;
}

const CountUp = ({
  value,
  reduce,
  format = (n) => Math.round(n).toLocaleString("en-IN"),
}) => {
  const v = useCountUp(value, reduce);
  return <>{format(v)}</>;
};

const Stars = ({ value = 0 }) => (
  <div className="flex items-center gap-0.5" aria-label={`${value.toFixed(1)} out of 5`}>
    {[0, 1, 2, 3, 4].map((i) => {
      const fill = Math.max(0, Math.min(1, value - i));
      return (
        <span key={i} className="relative inline-block h-[12px] w-[12px]">
          <Star size={12} className="absolute inset-0 fill-transparent text-zinc-700" />
          <span className="absolute inset-0 overflow-hidden" style={{ width: `${fill * 100}%` }}>
            <Star size={12} className="fill-[#ffb454] text-[#ffb454]" />
          </span>
        </span>
      );
    })}
  </div>
);

const Thumb = ({ src, alt, className = "" }) =>
  src ? (
    <img src={src} alt={alt} className={`object-cover ${className}`} />
  ) : (
    <div className={`flex items-center justify-center bg-white/5 ${className}`}>
      <BookOpen size={16} className="text-zinc-700" />
    </div>
  );

/* ------------------------------------------------------------------ */
/*  Stat panels                                                        */
/* ------------------------------------------------------------------ */

function RevenueShare({ courses, total, reduce }) {
  const [hover, setHover] = useState(null);

  const segments = useMemo(() => {
    const sorted = [...courses]
      .filter((c) => c.revenue > 0)
      .sort((a, b) => b.revenue - a.revenue);
    const top = sorted.slice(0, 5).map((c) => ({
      id: c._id,
      name: c.courseName,
      value: c.revenue,
    }));
    const rest = sorted.slice(5).reduce((s, c) => s + c.revenue, 0);
    if (rest > 0) top.push({ id: "others", name: "Everything else", value: rest });
    return top;
  }, [courses]);

  if (!segments.length || total <= 0) return null;

  const OPACITY = [1, 0.74, 0.54, 0.4, 0.28, 0.18];
  const active = segments[hover ?? 0];
  const share = Math.round((active.value / total) * 100);

  return (
    <div className="mt-10">
      <div className="flex h-3 gap-1" onMouseLeave={() => setHover(null)}>
        {segments.map((s, i) => (
          <motion.button
            type="button"
            key={s.id}
            aria-label={`${s.name}: ${Math.round((s.value / total) * 100)}% of revenue`}
            onMouseEnter={() => setHover(i)}
            onFocus={() => setHover(i)}
            onBlur={() => setHover(null)}
            initial={reduce ? false : { scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 1.1, ease: EASE, delay: 0.5 + i * 0.08 }}
            style={{
              flexGrow: s.value,
              backgroundColor: AMBER,
              opacity: hover === null || hover === i ? OPACITY[i] : 0.12,
              transformOrigin: "left",
            }}
            className="min-w-[6px] basis-0 rounded-full outline-none transition-opacity duration-300 focus-visible:ring-2 focus-visible:ring-[#ffb454]/60"
          />
        ))}
      </div>
      <p className="mt-4 flex items-baseline gap-3 text-sm text-zinc-500">
        <span className={`tabular-nums text-[#ffb454] ${mono}`}>{share}%</span>
        <span className="truncate text-zinc-300">{active.name}</span>
        <span className={`ml-auto shrink-0 text-xs tabular-nums ${mono}`}>{inr(active.value)}</span>
      </p>
    </div>
  );
}

function BigStat({ icon: Icon, label, children, sub, className = "" }) {
  return (
    <div className={`${PANEL} relative flex flex-col justify-between overflow-hidden p-7 ${className}`}>
      <div className="flex items-center justify-between">
        <p className="text-sm text-zinc-500">{label}</p>
        <span className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 text-zinc-400">
          <Icon size={15} />
        </span>
      </div>
      <div className="mt-10">{children}</div>
      {sub && <p className="mt-3 text-sm text-zinc-500">{sub}</p>}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  The chart: an LED-meter bar graph                                  */
/* ------------------------------------------------------------------ */

const CHART_H = 300;
const SEGMENT = "repeating-linear-gradient(to top, COLOR 0 5px, transparent 5px 8px)";

function MeterChart({ courses, reduce }) {
  const [metric, setMetric] = useState("revenue");
  const [hover, setHover] = useState(null);

  const data = useMemo(
    () =>
      courses
        .filter((c) => c.revenue > 0 || c.studentsEnrolled > 0)
        .map((c) => ({
          id: c._id,
          name: c.courseName,
          short: c.courseName.length > 14 ? `${c.courseName.slice(0, 14)}…` : c.courseName,
          value: metric === "revenue" ? c.revenue : c.studentsEnrolled,
        }))
        .sort((a, b) => b.value - a.value)
        .slice(0, 8),
    [courses, metric]
  );

  if (!data.length) return null;

  const max = niceMax(Math.max(...data.map((d) => d.value), 1));
  const ticks = [0, 0.25, 0.5, 0.75, 1];
  const fmt = (v) => (metric === "revenue" ? inr(v) : `${v.toLocaleString("en-IN")} students`);
  const fmtTick = (v) => (metric === "revenue" ? `₹${compact(v)}` : compact(v));

  return (
    <div className={`${PANEL} p-6 sm:p-9`}>
      <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
        <div>
          <h2 className={`text-2xl font-semibold tracking-tight text-[#f3ece0] ${display}`}>
            What&apos;s carrying the classroom
          </h2>
          <p className="mt-1.5 text-sm text-zinc-500">
            Your top {data.length} courses, ranked by {metric === "revenue" ? "income" : "enrollment"}.
          </p>
        </div>

        <div role="tablist" className="flex shrink-0 rounded-full border border-white/10 p-1">
          {[
            ["revenue", "Revenue"],
            ["studentsEnrolled", "Students"],
          ].map(([key, label]) => (
            <button
              key={key}
              role="tab"
              aria-selected={metric === key}
              onClick={() => setMetric(key)}
              className={`rounded-full px-5 py-2 text-sm outline-none transition-all duration-500 focus-visible:ring-2 focus-visible:ring-[#ffb454]/60 ${
                metric === key
                  ? "bg-[#ffb454] font-semibold text-[#1d1a16]"
                  : "text-zinc-400 hover:text-[#ffb454]"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-10 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <div className="min-w-[560px] pl-14">
          {/* plot */}
          <div className="relative" style={{ height: CHART_H }} onMouseLeave={() => setHover(null)}>
            {ticks.map((t) => (
              <div
                key={t}
                className="absolute left-0 right-0 border-t border-dashed border-white/[0.07]"
                style={{ bottom: `${t * 100}%` }}
              >
                <span
                  className={`absolute right-full mr-4 -translate-y-1/2 text-[11px] tabular-nums text-zinc-600 ${mono}`}
                >
                  {fmtTick(max * t)}
                </span>
              </div>
            ))}

            <div className="relative flex h-full items-end gap-4">
              {data.map((d, i) => {
                const pct = (d.value / max) * 100;
                const lead = i === 0;
                const on = hover === d.id;
                const dim = hover !== null && !on;
                const color = on || lead ? AMBER : "rgba(243,236,224,0.5)";
                return (
                  <motion.div
                    layout="position"
                    key={d.id}
                    transition={{ duration: 0.8, ease: EASE }}
                    onMouseEnter={() => setHover(d.id)}
                    className="relative h-full flex-1"
                    style={{ opacity: dim ? 0.35 : 1, transition: "opacity 300ms" }}
                  >
                    {/* ghost track: the unlit part of the meter */}
                    <div
                      className="absolute inset-y-0 left-1/2 w-full max-w-[56px] -translate-x-1/2"
                      style={{ backgroundImage: SEGMENT.replace("COLOR", "rgba(255,255,255,0.045)") }}
                    />
                    {/* lit part */}
                    <motion.button
                      type="button"
                      aria-label={`${d.name}: ${fmt(d.value)}`}
                      onFocus={() => setHover(d.id)}
                      onBlur={() => setHover(null)}
                      initial={reduce ? false : { height: 0 }}
                      animate={{ height: `${pct}%` }}
                      transition={{ duration: 1.3, ease: EASE, delay: reduce ? 0 : 0.3 + i * 0.07 }}
                      className="absolute bottom-0 left-1/2 w-full max-w-[56px] -translate-x-1/2 outline-none"
                      style={{
                        backgroundImage: SEGMENT.replace("COLOR", color),
                        filter: lead || on ? "drop-shadow(0 0 14px rgba(255,180,84,0.35))" : "none",
                      }}
                    >
                      <span className="absolute left-0 right-0 top-0 h-[3px]" style={{ backgroundColor: color }} />
                    </motion.button>

                    {/* value tag */}
                    <div
                      className={`pointer-events-none absolute left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full border px-3 py-1 text-xs tabular-nums transition-opacity duration-300 ${mono} ${
                        on
                          ? "border-[#ffb454] bg-[#ffb454] font-semibold text-[#1d1a16]"
                          : "border-white/10 bg-[#100f0d] text-zinc-300"
                      }`}
                      style={{
                        bottom: `calc(${pct}% + 12px)`,
                        opacity: on || (lead && hover === null) ? 1 : 0,
                      }}
                    >
                      {metric === "revenue" ? inr(d.value) : d.value.toLocaleString("en-IN")}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* labels */}
          <div className="mt-5 flex gap-4">
            {data.map((d) => (
              <p
                key={d.id}
                className={`flex-1 truncate text-center text-xs transition-colors duration-300 ${
                  hover === d.id ? "text-[#ffb454]" : "text-zinc-500"
                }`}
                title={d.name}
              >
                {d.short}
              </p>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Standouts                                                          */
/* ------------------------------------------------------------------ */

function Standout({ icon: Icon, title, course, metric }) {
  if (!course) return null;
  return (
    <div className={`${PANEL} group relative flex flex-col overflow-hidden p-6 transition-colors duration-500 hover:border-[#ffb454]/40`}>
      <div className="flex items-center justify-between">
        <p className="text-sm text-zinc-500">{title}</p>
        <Icon size={16} className="text-[#ffb454]" />
      </div>

      <div className="relative mt-6 aspect-[16/9] overflow-hidden rounded-2xl bg-white/5">
        <Thumb
          src={course.thumbnail}
          alt={course.courseName}
          className="h-full w-full opacity-80 saturate-[0.6] transition-all duration-[1200ms] ease-out group-hover:scale-[1.05] group-hover:opacity-100 group-hover:saturate-100"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#14130f] via-transparent to-transparent" />
      </div>

      <h3 className={`mt-5 line-clamp-1 text-lg font-semibold tracking-tight text-[#f3ece0] ${display}`}>
        {course.courseName}
      </h3>
      <p className={`mt-1 text-sm tabular-nums text-[#ffb454] ${mono}`}>{metric}</p>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Ledger                                                             */
/* ------------------------------------------------------------------ */

const SORTS = [
  ["revenue", "Revenue"],
  ["studentsEnrolled", "Students"],
  ["averageRating", "Rating"],
];

function Ledger({ courses, reduce }) {
  const [sortBy, setSortBy] = useState("revenue");

  const rows = useMemo(
    () => [...courses].sort((a, b) => (b[sortBy] ?? 0) - (a[sortBy] ?? 0)),
    [courses, sortBy]
  );
  const maxRev = Math.max(...courses.map((c) => c.revenue), 1);

  return (
    <div className={`${PANEL} overflow-hidden`}>
      <div className="flex flex-col justify-between gap-4 border-b border-white/[0.07] px-6 py-5 sm:flex-row sm:items-center sm:px-8">
        <h2 className={`text-xl font-semibold tracking-tight text-[#f3ece0] ${display}`}>
          Every course, ranked
        </h2>
        <div className="flex items-center gap-2">
          <span className="mr-1 text-sm text-zinc-600">Sort by</span>
          {SORTS.map(([key, label]) => (
            <button
              key={key}
              onClick={() => setSortBy(key)}
              className={`rounded-full border px-4 py-1.5 text-sm outline-none transition-all duration-500 focus-visible:ring-2 focus-visible:ring-[#ffb454]/60 ${
                sortBy === key
                  ? "border-[#ffb454] bg-[#ffb454] font-semibold text-[#1d1a16]"
                  : "border-white/15 text-zinc-400 hover:border-[#ffb454]/40 hover:text-[#ffb454]"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <ul>
        {rows.map((course, i) => (
          <motion.li
            layout="position"
            key={course._id}
            transition={{ duration: 0.7, ease: EASE }}
            className="group relative flex items-center gap-4 border-b border-white/[0.05] px-6 py-4 transition-colors duration-500 last:border-b-0 hover:bg-white/[0.025] sm:gap-6 sm:px-8"
          >
            <span className={`w-6 shrink-0 text-xs tabular-nums text-zinc-700 ${mono}`}>
              {String(i + 1).padStart(2, "0")}
            </span>

            <Thumb
              src={course.thumbnail}
              alt={course.courseName}
              className="h-12 w-[4.5rem] shrink-0 rounded-xl border border-white/10 opacity-80 saturate-[0.7] transition-all duration-700 group-hover:opacity-100 group-hover:saturate-100"
            />

            <div className="min-w-0 flex-1">
              <p className="truncate text-[15px] text-[#f3ece0] transition-colors duration-500 group-hover:text-[#ffb454]">
                {course.courseName}
              </p>
              <div className="mt-1.5 flex items-center gap-2">
                {course.reviewCount > 0 ? (
                  <>
                    <Stars value={course.averageRating} />
                    <span className="text-xs tabular-nums text-zinc-500">
                      {course.averageRating.toFixed(1)}{" "}
                      <span className="text-zinc-700">({course.reviewCount})</span>
                    </span>
                  </>
                ) : (
                  <span className="text-xs text-zinc-600">No reviews yet</span>
                )}
              </div>
            </div>

            {/* revenue share bar */}
            <div className="hidden w-40 shrink-0 md:block">
              <div className="h-1 overflow-hidden rounded-full bg-white/[0.06]">
                <motion.div
                  initial={reduce ? false : { width: 0 }}
                  animate={{ width: `${(course.revenue / maxRev) * 100}%` }}
                  transition={{ duration: 1.1, ease: EASE, delay: 0.2 }}
                  className="h-full rounded-full bg-[#ffb454]"
                />
              </div>
            </div>

            <div className="w-24 shrink-0 text-right sm:w-28">
              <p className={`text-base font-semibold tabular-nums text-[#f3ece0] ${display}`}>
                {inr(course.revenue)}
              </p>
              <p className="mt-0.5 text-xs tabular-nums text-zinc-500">
                {course.studentsEnrolled.toLocaleString("en-IN")} students
              </p>
            </div>
          </motion.li>
        ))}
      </ul>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Dashboard body                                                     */
/* ------------------------------------------------------------------ */

function Dashboard({ stats, firstName, reduce }) {
  const courses = stats.courseStats ?? [];

  const revPerStudent = stats.totalStudents > 0 ? stats.totalRevenue / stats.totalStudents : 0;

  const avgRating = useMemo(() => {
    const rated = courses.filter((c) => c.reviewCount > 0);
    const reviews = rated.reduce((s, c) => s + c.reviewCount, 0);
    if (!reviews) return null;
    return rated.reduce((s, c) => s + c.averageRating * c.reviewCount, 0) / reviews;
  }, [courses]);

  const intro = (delay) => ({
    initial: reduce ? false : { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 1, ease: EASE, delay },
  });

  return (
    <div className="relative flex flex-col gap-6">
      {/* header */}
      <motion.header {...intro(0)} className="mb-6 flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
        <div>
          <div className="flex items-center gap-3">
            <span className="h-px w-8 bg-[#ffb454]" />
            <p className="text-sm text-zinc-500">
              {greeting()}
              {firstName ? `, ${firstName}` : ""}
            </p>
          </div>
          <h1
            className={`mt-6 text-5xl font-semibold leading-[1.02] tracking-tight text-[#f3ece0] sm:text-6xl ${display}`}
          >
            Your classroom,
            <br />
            in <span className="text-[#ffb454]">numbers</span>.
          </h1>
        </div>
        <p className={`text-xs text-zinc-600 ${mono}`}>
          Updated{" "}
          {new Date().toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
        </p>
      </motion.header>

      {/* bento */}
      <motion.div {...intro(0.15)} className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <BigStat
          icon={IndianRupee}
          label="Total revenue"
          className="lg:col-span-6"
          sub="Where it comes from:"
        >
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,180,84,0.10),transparent_60%)]"
          />
          <p
            className={`relative text-6xl font-semibold leading-none tracking-tight tabular-nums text-[#ffb454] sm:text-7xl ${display}`}
          >
            ₹<CountUp value={stats.totalRevenue} reduce={reduce} />
          </p>
        </BigStat>

        <BigStat
          icon={Users}
          label="Students"
          className="lg:col-span-3"
          sub={`${inr(Math.round(revPerStudent))} earned per student`}
        >
          <p className={`text-5xl font-semibold leading-none tracking-tight tabular-nums text-[#f3ece0] ${display}`}>
            <CountUp value={stats.totalStudents} reduce={reduce} />
          </p>
        </BigStat>

        <BigStat
          icon={BookOpen}
          label="Courses"
          className="lg:col-span-3"
          sub={avgRating ? `${avgRating.toFixed(1)} average rating` : "No reviews yet"}
        >
          <p className={`text-5xl font-semibold leading-none tracking-tight tabular-nums text-[#f3ece0] ${display}`}>
            <CountUp value={stats.totalCourses} reduce={reduce} />
          </p>
        </BigStat>
      </motion.div>

      {/* share ribbon sits visually under the hero stat */}
      <motion.div {...intro(0.25)} className={`${PANEL} -mt-2 px-7 pb-7 pt-1`}>
        <RevenueShare courses={courses} total={stats.totalRevenue} reduce={reduce} />
      </motion.div>

      <motion.div {...intro(0.35)}>
        <MeterChart courses={courses} reduce={reduce} />
      </motion.div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <Standout
          icon={Trophy}
          title="Top earner"
          course={stats.topByRevenue}
          metric={`${inr(stats.topByRevenue?.revenue)} earned`}
        />
        <Standout
          icon={Flame}
          title="Most enrolled"
          course={stats.topByEnrollment}
          metric={`${(stats.topByEnrollment?.studentsEnrolled ?? 0).toLocaleString("en-IN")} students`}
        />
        <Standout
          icon={Star}
          title="Highest rated"
          course={stats.topByRating}
          metric={
            stats.topByRating
              ? `${stats.topByRating.averageRating.toFixed(1)} from ${stats.topByRating.reviewCount} reviews`
              : "No reviews yet"
          }
        />
      </div>

      <Ledger courses={courses} reduce={reduce} />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Page shell                                                         */
/* ------------------------------------------------------------------ */

const Shell = ({ children }) => (
  <div className="relative min-h-screen w-full overflow-hidden bg-[#100f0d] px-5 pb-24 pt-10 sm:px-8 lg:px-12 lg:pt-14">
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 opacity-[0.06] mix-blend-overlay"
      style={{ backgroundImage: GRAIN }}
    />
    <div className="relative mx-auto max-w-6xl">{children}</div>
  </div>
);

export default function InstructorDashboard() {
  const { token } = useSelector((state) => state.auth);
  const { user } = useSelector((state) => state.profile);
  const reduce = useReducedMotion();

  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      const data = await getInstructorDashboardStats(token);
      if (cancelled) return;
      setStats(data);
      setLoading(false);
    }
    if (token) load();
    return () => {
      cancelled = true;
    };
  }, [token]);

  if (loading) {
    return (
      <Shell>
        <div className="animate-pulse space-y-6">
          <div className="h-32 w-2/3 rounded-3xl bg-white/[0.04]" />
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
            <div className="h-56 rounded-3xl bg-white/[0.04] lg:col-span-6" />
            <div className="h-56 rounded-3xl bg-white/[0.04] lg:col-span-3" />
            <div className="h-56 rounded-3xl bg-white/[0.04] lg:col-span-3" />
          </div>
          <div className="h-96 rounded-3xl bg-white/[0.04]" />
        </div>
      </Shell>
    );
  }

  if (!stats || stats.totalCourses === 0) {
    return (
      <Shell>
        <div className={`${PANEL} flex flex-col items-center justify-center px-8 py-28 text-center`}>
          <span className="flex h-16 w-16 items-center justify-center rounded-full border border-white/10">
            <BookOpen size={26} className="text-zinc-500" />
          </span>
          <h3 className={`mt-6 text-2xl font-semibold text-[#f3ece0] ${display}`}>
            Your numbers start with a first course
          </h3>
          <p className="mt-2 max-w-md text-zinc-500">
            Publish a course and enroll your first student. Revenue, ratings, and rankings will show up here.
          </p>
        </div>
      </Shell>
    );
  }

  return (
    <Shell>
      <Dashboard stats={stats} firstName={user?.firstName} reduce={reduce} />
    </Shell>
  );
}