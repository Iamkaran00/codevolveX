import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  Search,
  X,
  SlidersHorizontal,
  Users,
  BookOpen,
  ChevronDown,
  Clock,
  ArrowUpRight,
  Check,
  Star,
} from "lucide-react";
import {
  getAllCourses,
  fetchCourseCategories,
  getAverageRating,
  getReviewsForCourse,
} from "../services/operations/courseApi";

const EASE = [0.23, 1, 0.32, 1];

const display = "font-['Space_Grotesk',ui-sans-serif,system-ui,sans-serif]";
const mono = "font-['JetBrains_Mono',ui-monospace,monospace]";

const GRAIN = `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.8' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>")`;

const LEVEL_STYLES = {
  Beginner: "border-[#a8c48f]/40 text-[#a8c48f]",
  Intermediate: "border-[#ffb454]/40 text-[#ffb454]",
  Advanced: "border-[#e0816f]/40 text-[#e0816f]",
};

const SORT_OPTIONS = [
  { value: "popular", label: "Most Popular" },
  { value: "newest", label: "Newest First" },
  { value: "price-low", label: "Price: Low to High" },
  { value: "price-high", label: "Price: High to Low" },
  { value: "rating", label: "Highest Rated" },
];

const idOf = (v) => (typeof v === "string" ? v : v?._id ?? String(v));

 

const Stars = ({ value = 0 }) => (
  <div className="flex items-center gap-0.5" aria-label={`${value.toFixed(1)} out of 5`}>
    {[0, 1, 2, 3, 4].map((i) => {
      const fill = Math.max(0, Math.min(1, value - i));
      return (
        <span key={i} className="relative inline-block h-[14px] w-[14px]">
          <Star size={14} className="absolute inset-0 fill-transparent text-zinc-700" />
          <span className="absolute inset-0 overflow-hidden" style={{ width: `${fill * 100}%` }}>
            <Star size={14} className="fill-[#ffb454] text-[#ffb454]" />
          </span>
        </span>
      );
    })}
  </div>
);

function SkeletonCard() {
  return (
    <div className="flex animate-pulse flex-col overflow-hidden rounded-3xl border border-white/[0.06] bg-white/[0.03]">
      <div className="aspect-[16/10] w-full bg-white/[0.04]" />
      <div className="space-y-4 p-6">
        <div className="h-3 w-1/3 rounded-full bg-white/[0.06]" />
        <div className="h-6 w-full rounded-full bg-white/[0.06]" />
        <div className="h-6 w-2/3 rounded-full bg-white/[0.06]" />
        <div className="h-4 w-1/2 rounded-full bg-white/[0.06]" />
        <div className="mt-6 flex items-end justify-between pt-6">
          <div className="h-8 w-1/4 rounded-full bg-white/[0.06]" />
          <div className="h-11 w-11 rounded-full bg-white/[0.06]" />
        </div>
      </div>
    </div>
  );
}

function CourseCard({ course, owned, stats, onClick }) {
  const instructor =
    course.instructor
      ? `${course.instructor.firstName ?? ""} ${course.instructor.lastName ?? ""}`.trim()
      : "";
  const instructorName = instructor || "Expert Instructor";
  const enrolled = course.studentsEnrolled?.length ?? 0;
  const category = course.category?.name ?? "Course";
  const level = course.level ?? "";

  const handleKey = (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onClick(course._id);
    }
  };

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.7, ease: EASE }}
      role="link"
      tabIndex={0}
      onClick={() => onClick(course._id)}
      onKeyDown={handleKey}
      className={`group flex cursor-pointer flex-col overflow-hidden rounded-3xl border bg-[#14130f] outline-none transition-all duration-500 hover:-translate-y-1 focus-visible:border-[#ffb454] ${
        owned
          ? "border-[#ffb454]/30 hover:border-[#ffb454]/60"
          : "border-white/[0.08] hover:border-[#ffb454]/40"
      }`}
    >
      <div className="relative aspect-[16/10] w-full shrink-0 overflow-hidden bg-white/5">
        {course.thumbnail ? (
          <img
            src={course.thumbnail}
            alt={course.courseName}
            className="h-full w-full object-cover opacity-80 saturate-[0.7] transition-all duration-[1200ms] ease-out group-hover:scale-[1.05] group-hover:opacity-100 group-hover:saturate-100"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <BookOpen size={44} className="text-zinc-700" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#14130f] via-transparent to-transparent" />

        <div className="absolute left-4 top-4 flex flex-wrap gap-2">
          <span
            className={`rounded-full border border-white/15 bg-[#100f0d]/70 px-3 py-1 text-[10px] uppercase tracking-[0.2em] text-zinc-300 backdrop-blur-sm ${mono}`}
          >
            {category}
          </span>
          {level && (
            <span
              className={`rounded-full border bg-[#100f0d]/70 px-3 py-1 text-[10px] uppercase tracking-[0.2em] backdrop-blur-sm ${mono} ${
                LEVEL_STYLES[level] ?? "border-white/15 text-zinc-300"
              }`}
            >
              {level}
            </span>
          )}
        </div>

        {owned && (
          <span
            className={`absolute right-4 top-4 flex items-center gap-1.5 rounded-full bg-[#ffb454] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#1d1a16] ${mono}`}
          >
            <Check size={11} strokeWidth={3} /> Enrolled
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-6">
        <h3
          className={`line-clamp-2 min-h-[2.75em] text-xl font-semibold leading-snug tracking-tight text-[#f3ece0] transition-colors duration-500 group-hover:text-[#ffb454] ${display}`}
        >
          {course.courseName}
        </h3>
        <p className="mt-1.5 truncate text-sm text-zinc-500">by {instructorName}</p>

        <div className="mt-4 flex h-5 items-center gap-2.5">
          {stats ? (
            stats.count > 0 ? (
              <>
                <Stars value={stats.avg} />
                <span className="text-sm tabular-nums text-zinc-300">{stats.avg.toFixed(1)}</span>
                <span className="text-xs text-zinc-600">({stats.count.toLocaleString("en-IN")})</span>
              </>
            ) : (
              <span className={`text-[11px] uppercase tracking-widest text-zinc-500 ${mono}`}>
                New
              </span>
            )
          ) : (
            <span className="h-3 w-32 animate-pulse rounded-full bg-white/[0.06]" />
          )}
        </div>

        <div className="mt-4 flex items-center gap-4 text-xs text-zinc-500">
          <span className="flex items-center gap-1.5">
            <Users size={14} className="text-zinc-600" />
            {enrolled.toLocaleString("en-IN")} learners
          </span>
          {course.duration && (
            <span className="flex items-center gap-1.5">
              <Clock size={14} className="text-zinc-600" />
              {course.duration}
            </span>
          )}
        </div>

        <div className="mt-auto flex items-end justify-between gap-4 border-t border-white/[0.07] pt-6">
          {owned ? (
            <div>
              <p className={`flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] text-[#ffb454] ${mono}`}>
                <span className="h-1.5 w-1.5 rounded-full bg-[#ffb454]" />
                In your library
              </p>
              <p className={`mt-1.5 text-xl font-semibold text-[#f3ece0] ${display}`}>
                Continue learning
              </p>
            </div>
          ) : (
            <div>
              <p className={`text-[10px] uppercase tracking-[0.2em] text-zinc-600 ${mono}`}>
                Price
              </p>
              <p className={`mt-1 text-2xl font-semibold text-[#f3ece0] ${display}`}>
                {course.price
                  ? `₹${Number(course.price).toLocaleString("en-IN")}`
                  : "Free"}
              </p>
            </div>
          )}

          <span
            className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full border transition-all duration-500 group-hover:border-[#ffb454] group-hover:bg-[#ffb454] group-hover:text-[#1d1a16] ${
              owned
                ? "border-[#ffb454] bg-[#ffb454] text-[#1d1a16]"
                : "border-white/15 text-zinc-400"
            }`}
          >
            <ArrowUpRight size={18} />
          </span>
        </div>
      </div>
    </motion.article>
  );
}

function EmptyState({ onReset }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: EASE }}
      className="col-span-full flex flex-col items-center justify-center rounded-3xl border border-white/[0.08] bg-white/[0.02] px-8 py-24 text-center"
    >
      <span className="flex h-16 w-16 items-center justify-center rounded-full border border-white/10">
        <Search size={26} className="text-zinc-500" />
      </span>
      <h3 className={`mt-6 text-2xl font-semibold text-[#f3ece0] ${display}`}>
        No courses found
      </h3>
      <p className="mt-2 max-w-md text-zinc-500">
        Nothing matches that search. Try different words or another category.
      </p>
      <button
        onClick={onReset}
        className="mt-8 rounded-full bg-[#ffb454] px-7 py-3 text-sm font-semibold text-[#1d1a16] transition-all duration-500 hover:bg-[#ffc272]"
      >
        Clear all filters
      </button>
    </motion.div>
  );
}

function SortDropdown({ value, onChange }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const label = SORT_OPTIONS.find((o) => o.value === value)?.label ?? "Sort";

  useEffect(() => {
    function handler(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    function onKey(e) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", handler);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", handler);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  return (
    <div ref={ref} className="relative z-50 shrink-0">
      <button
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className={`flex w-full cursor-pointer items-center justify-between gap-3 whitespace-nowrap rounded-full border px-5 py-3 text-sm outline-none transition-all duration-500 sm:w-auto ${
          open
            ? "border-[#ffb454]/60 bg-[#ffb454]/10 text-[#ffb454]"
            : "border-white/15 text-zinc-300 hover:border-[#ffb454]/40"
        }`}
      >
        <span className="flex items-center gap-2">
          <SlidersHorizontal size={16} className={open ? "text-[#ffb454]" : "text-zinc-500"} />
          {label}
        </span>
        <ChevronDown
          size={16}
          className={`transition-transform duration-500 ${open ? "rotate-180" : ""}`}
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            role="listbox"
            initial={{ opacity: 0, y: -8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.97 }}
            transition={{ duration: 0.3, ease: EASE }}
            className="absolute right-0 top-full z-50 mt-2 w-full origin-top-right overflow-hidden rounded-2xl border border-white/[0.09] bg-[#14130f] p-2 shadow-[0_24px_60px_-20px_rgba(0,0,0,0.8)] sm:w-60"
          >
            {SORT_OPTIONS.map((opt) => {
              const active = value === opt.value;
              return (
                <button
                  key={opt.value}
                  role="option"
                  aria-selected={active}
                  onClick={() => {
                    onChange(opt.value);
                    setOpen(false);
                  }}
                  className={`flex w-full cursor-pointer items-center justify-between rounded-xl px-4 py-2.5 text-left text-sm transition-all duration-300 ${
                    active
                      ? "bg-[#ffb454]/10 text-[#ffb454]"
                      : "text-zinc-400 hover:bg-white/[0.04] hover:text-[#f3ece0]"
                  }`}
                >
                  {opt.label}
                  {active && <Check size={14} />}
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

 

export default function Catalogue() {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.profile);

  const [courses, setCourses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [stats, setStats] = useState({}); // courseId -> { avg, count }
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [sortBy, setSortBy] = useState("popular");

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(t);
  }, [search]);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      setError(false);
      try {
        const [coursesData, categoriesData] = await Promise.all([
          getAllCourses(),
          fetchCourseCategories(),
        ]);
        if (cancelled) return;
        const list = coursesData ?? [];
        setCourses(list);
        setCategories(categoriesData ?? []);
        setLoading(false);

        // ratings load in the background so the grid shows immediately
        const map = {};
        await Promise.all(
          list.map(async (course) => {
            try {
              const [avg, reviews] = await Promise.all([
                getAverageRating(course._id),
                getReviewsForCourse(course._id),
              ]);
              map[course._id] = {
                avg: typeof avg === "number" && !isNaN(avg) ? avg : 0,
                count: (reviews ?? []).length,
              };
            } catch (err) {
              map[course._id] = { avg: 0, count: 0 };
            }
          })
        );
        if (!cancelled) setStats(map);
      } catch (err) {
        if (!cancelled) {
          setError(true);
          setLoading(false);
        }
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  // courses this student already owns
  const enrolledIds = useMemo(() => {
    const set = new Set();
    if (user?.accountType === "Student") {
      (user?.courses ?? []).forEach((c) => set.add(String(idOf(c))));
    }
    return set;
  }, [user]);

  const isOwned = (course) =>
    enrolledIds.has(String(course._id)) ||
    (!!user?._id &&
      user?.accountType === "Student" &&
      (course.studentsEnrolled ?? []).some(
        (s) => String(idOf(s)) === String(user._id)
      ));

  const filteredCourses = useMemo(() => {
    const q = debouncedSearch.toLowerCase();
    return courses
      .filter((c) => {
        const matchSearch =
          !q ||
          c.courseName?.toLowerCase().includes(q) ||
          c.instructor?.firstName?.toLowerCase().includes(q) ||
          c.instructor?.lastName?.toLowerCase().includes(q);
        const matchCat = activeCategory === "All" || c.category?.name === activeCategory;
        return matchSearch && matchCat;
      })
      .sort((a, b) => {
        if (sortBy === "price-low") return (a.price ?? 0) - (b.price ?? 0);
        if (sortBy === "price-high") return (b.price ?? 0) - (a.price ?? 0);
        if (sortBy === "newest")
          return new Date(b.createdAt ?? 0).getTime() - new Date(a.createdAt ?? 0).getTime();
        if (sortBy === "rating")
          return (stats[b._id]?.avg ?? 0) - (stats[a._id]?.avg ?? 0);
        return (b.studentsEnrolled?.length ?? 0) - (a.studentsEnrolled?.length ?? 0);
      });
  }, [courses, debouncedSearch, activeCategory, sortBy, stats]);

  const allCategoryNames = ["All", ...categories.map((c) => c.name)];
  const hasActiveFilter = search !== "" || activeCategory !== "All";
  const reset = () => {
    setSearch("");
    setActiveCategory("All");
    setSortBy("popular");
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#100f0d] pb-32 pt-32 lg:pt-40">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.06] mix-blend-overlay"
        style={{ backgroundImage: GRAIN }}
      />
 
      <div className="relative mx-auto mb-14 max-w-7xl px-5 sm:px-8">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.95, ease: EASE }}
          className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end"
        >
          <div>
            <div className="flex items-center gap-3">
              <span className="h-px w-8 bg-[#ffb454]" />
              <p className={`text-[11px] uppercase tracking-[0.25em] text-zinc-500 ${mono}`}>
                Catalogue
              </p>
            </div>
            <h1
              className={`mt-6 text-5xl font-semibold leading-[1.02] tracking-tight text-[#f3ece0] sm:text-6xl lg:text-[5.25rem] ${display}`}
            >
              Discover your
              <br />
              next <span className="text-[#ffb454]">skill</span>
              <span className="text-[#ffb454]">.</span>
            </h1>
          </div>
          <p className="max-w-md text-lg leading-relaxed text-zinc-400">
            Hands-on courses from working instructors. Search, filter by topic,
            and pick up where you left off.
          </p>
        </motion.div>
      </div>

      
      <div className="sticky top-16 z-30 mb-12 border-y border-white/[0.07] bg-[#100f0d]/85 backdrop-blur-xl md:top-20">
        <div className="mx-auto max-w-7xl px-5 py-4 sm:px-8">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
            <div className="group relative w-full shrink-0 lg:max-w-sm">
              <Search
                size={18}
                className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 transition-colors duration-300 group-focus-within:text-[#ffb454]"
              />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search courses..."
                className="w-full rounded-full border border-white/15 bg-white/[0.02] py-3 pl-12 pr-11 text-sm text-[#f3ece0] outline-none transition-all duration-500 placeholder:text-zinc-600 focus:border-[#ffb454]/60 focus:bg-[#ffb454]/[0.04]"
              />
              
            </div>

            <div className="flex-1 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              <div className="flex items-center gap-2 py-0.5">
                {allCategoryNames.map((cat) => {
                  const active = activeCategory === cat;
                  return (
                    <button
                      key={cat}
                      onClick={() => setActiveCategory(cat)}
                      className={`shrink-0 whitespace-nowrap rounded-full border px-5 py-2.5 text-sm transition-all duration-500 ${
                        active
                          ? "border-[#ffb454] bg-[#ffb454] font-semibold text-[#1d1a16]"
                          : "border-white/15 text-zinc-400 hover:border-[#ffb454]/40 hover:text-[#ffb454]"
                      }`}
                    >
                      {cat}
                    </button>
                  );
                })}
              </div>
            </div>

            <SortDropdown value={sortBy} onChange={setSortBy} />
          </div>
        </div>
      </div>

      {/* body */}
      <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
        {!loading && !error && (
          <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <p className={`text-[11px] uppercase tracking-[0.25em] text-zinc-500 ${mono}`}>
              Showing {filteredCourses.length}{" "}
              {filteredCourses.length === 1 ? "course" : "courses"}
            </p>
            {hasActiveFilter && (
              <button
                onClick={reset}
                className="group flex items-center gap-2 self-start text-sm text-zinc-500 transition-colors duration-500 hover:text-[#ffb454] sm:self-auto"
              >
                <X size={16} /> Clear all filters
              </button>
            )}
          </div>
        )}

        {error && (
          <div className="flex flex-col items-center justify-center rounded-3xl border border-[#e0816f]/20 bg-[#e0816f]/[0.04] px-8 py-24 text-center">
            <span className="flex h-16 w-16 items-center justify-center rounded-full border border-[#e0816f]/30">
              <BookOpen size={26} className="text-[#e0816f]" />
            </span>
            <h3 className={`mt-6 text-2xl font-semibold text-[#f3ece0] ${display}`}>
              Connection error
            </h3>
            <p className="mt-2 text-zinc-500">We couldn't load the courses. Please try again.</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-8 rounded-full border border-white/15 px-7 py-3 text-sm text-zinc-300 transition-all duration-500 hover:border-[#ffb454]/60 hover:text-[#ffb454]"
            >
              Reload
            </button>
          </div>
        )}

        {loading && (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        )}

        {!loading && !error && filteredCourses.length === 0 && (
          <div className="grid grid-cols-1">
            <EmptyState onReset={reset} />
          </div>
        )}

        {!loading && !error && filteredCourses.length > 0 && (
          <motion.div
            layout
            className="grid auto-rows-fr grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3"
          >
            <AnimatePresence mode="popLayout">
              {filteredCourses.map((course) => (
                <CourseCard
                  key={course._id}
                  course={course}
                  owned={isOwned(course)}
                  stats={stats[course._id]}
                  onClick={(id) => navigate(`/catalogue/${id}`)}
                />
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </div>
  );
}