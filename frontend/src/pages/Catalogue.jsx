import React, { useEffect, useState, useMemo, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import ReactStars from "react-rating-stars-component";
import {
  Search, X, SlidersHorizontal, Users, BookOpen,
  ChevronDown, Sparkles, Clock, ArrowRight
} from "lucide-react";
import { getAllCourses, fetchCourseCategories, getAverageRating, getReviewsForCourse } from "../services/operations/courseApi";

const LEVEL_COLORS = {
  Beginner: "text-emerald-700 bg-emerald-50 ring-1 ring-emerald-600/10",
  Intermediate: "text-amber-700 bg-amber-50 ring-1 ring-amber-600/10",
  Advanced: "text-rose-700 bg-rose-50 ring-1 ring-rose-600/10",
};

function SkeletonCard() {
  return (
    <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden animate-pulse flex flex-col">
      <div className="w-full aspect-[16/9] bg-slate-100" />
      <div className="p-7 space-y-4">
        <div className="h-5 bg-slate-100 rounded-full w-1/3" />
        <div className="h-7 bg-slate-100 rounded-full w-full mt-3" />
        <div className="h-7 bg-slate-100 rounded-full w-2/3" />
        <div className="h-5 bg-slate-100 rounded-full w-1/2 mt-6" />
        <div className="flex justify-between items-end pt-6 mt-6 border-t border-slate-100">
          <div className="h-8 bg-slate-100 rounded-full w-1/4" />
          <div className="h-10 bg-slate-100 rounded-full w-10" />
        </div>
      </div>
    </div>
  );
}

function CourseCard({ course, onClick }) {
  const [reviews, setReviews] = useState([]);
  const [average, setAverage] = useState(0);
  const [loading, setLoading] = useState(true);

  const instructorName = course.instructor
    ? `${course.instructor.firstName ?? ""} ${course.instructor.lastName ?? ""}`.trim()
    : "Expert Instructor";
  const enrolled = course.studentsEnrolled?.length ?? 0;
  const category = course.category?.name ?? "Course";
  const level = course.level ?? "";

  useEffect(() => {
    async function load() {
      setLoading(true);
      const [avg, list] = await Promise.all([
        getAverageRating(course._id),
        getReviewsForCourse(course._id),
      ]);
      setAverage(avg || 0);
      setReviews(list || []);
      setLoading(false);
    }
    load();
  }, [course._id]);

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
      onClick={() => onClick(course._id)}
      className="group bg-white rounded-3xl border border-slate-200 cursor-pointer overflow-hidden flex flex-col hover:-translate-y-1.5 hover:shadow-[0_20px_40px_-15px_rgba(79,70,229,0.15)] hover:border-indigo-200 transition-all duration-400"
    >
      <div className="relative w-full aspect-[16/9] overflow-hidden bg-slate-50 shrink-0">
        {course.thumbnail ? (
          <img src={course.thumbnail} alt={course.courseName} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out" />
        ) : (
          <div className="absolute inset-0 w-full h-full flex items-center justify-center bg-slate-100"><BookOpen size={48} className="text-slate-300" /></div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        <div className="absolute top-4 left-4 flex flex-wrap gap-2">
          <span className="bg-white/95 backdrop-blur-sm text-slate-800 text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-full shadow-sm">{category}</span>
          {level && (
            <span className={`text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-full backdrop-blur-sm shadow-sm ${LEVEL_COLORS[level] ?? "text-slate-700 bg-white/95"}`}>
              {level}
            </span>
          )}
        </div>
      </div>

      <div className="flex flex-col flex-grow p-7">
        <h3 className="text-xl font-bold text-slate-900 line-clamp-2 leading-tight group-hover:text-indigo-600 transition-colors duration-300">{course.courseName}</h3>
        <p className="text-base text-slate-500 mt-2">Instructed by <span className="font-semibold text-slate-700">{instructorName}</span></p>

        {!loading && (
            <div className="mt-4 flex items-center gap-2">
                <ReactStars count={5} value={average} size={16} edit={false} activeColor="#fbbf24" isHalf={true} />
                <span className="text-sm font-medium text-slate-500">({reviews.length.toLocaleString()} reviews)</span>
            </div>
        )}

        <div className="flex items-center gap-4 mt-5 text-sm text-slate-600 font-medium">
          <span className="flex items-center gap-2"><Users size={16} className="text-slate-400" /> {enrolled.toLocaleString()} students</span>
          {course.duration && (
            <>
              <span className="w-1.5 h-1.5 rounded-full bg-slate-300" />
              <span className="flex items-center gap-2"><Clock size={16} className="text-slate-400" /> {course.duration}</span>
            </>
          )}
        </div>

        <div className="mt-auto pt-6 flex items-end justify-between border-t border-slate-100">
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Price</p>
            {course.price === 0 ? (
              <span className="text-emerald-600 font-black text-2xl tracking-tight">Free</span>
            ) : (
              <span className="text-slate-900 font-black text-2xl tracking-tight">₹{course.price.toLocaleString("en-IN")}</span>
            )}
          </div>
          <div className="flex items-center justify-center w-12 h-12 rounded-full bg-slate-50 text-slate-400 group-hover:bg-indigo-600 group-hover:text-white transition-colors duration-300">
            <ArrowRight size={20} />
          </div>
        </div>
      </div>
    </motion.article>
  );
}

function EmptyState({ onReset }) {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col items-center justify-center py-24 text-center col-span-full">
      <div className="w-24 h-24 rounded-full bg-slate-100 flex items-center justify-center mb-6"><Search size={36} className="text-slate-400" /></div>
      <h3 className="text-3xl font-bold text-slate-900">No courses found</h3>
      <p className="text-slate-500 mt-3 text-lg max-w-md">We couldn't find anything matching your criteria. Try adjusting your search or category filters.</p>
      <button onClick={onReset} className="mt-8 px-8 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white text-base font-bold rounded-xl transition-colors shadow-lg shadow-indigo-200">Clear all filters</button>
    </motion.div>
  );
}

const SORT_OPTIONS = [
  { value: "popular", label: "Most Popular" },
  { value: "newest", label: "Newest First" },
  { value: "price-low", label: "Price: Low to High" },
  { value: "price-high", label: "Price: High to Low" },
  { value: "rating", label: "Highest Rated" },
];

function SortDropdown({ value, onChange }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const label = SORT_OPTIONS.find((o) => o.value === value)?.label ?? "Sort";

  useEffect(() => {
    function handler(e) { if (ref.current && !ref.current.contains(e.target)) setOpen(false); }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={ref} className="relative shrink-0 z-50">
      <button onClick={() => setOpen((v) => !v)} className="flex items-center justify-between w-full sm:w-auto gap-3 bg-white hover:bg-slate-50 border border-slate-200 transition-colors rounded-xl px-5 py-3.5 text-base font-bold text-slate-700 outline-none whitespace-nowrap shadow-sm">
        <div className="flex items-center gap-2"><SlidersHorizontal size={18} className="text-slate-400" /> {label}</div>
        <ChevronDown size={18} className={`text-slate-400 transition-transform duration-300 ${open ? "rotate-180" : ""}`} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div initial={{ opacity: 0, y: 8, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 8, scale: 0.95 }} transition={{ duration: 0.2, ease: "easeOut" }} className="absolute right-0 top-full mt-2 w-full sm:w-56 bg-white rounded-2xl border border-slate-100 shadow-2xl overflow-hidden z-50">
            <div className="p-2 flex flex-col gap-1">
              {SORT_OPTIONS.map((opt) => (
                <button key={opt.value} onClick={() => { onChange(opt.value); setOpen(false); }} className={`w-full text-left px-4 py-3 text-sm font-bold transition-all rounded-xl ${value === opt.value ? "bg-indigo-50 text-indigo-700" : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"}`}>{opt.label}</button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function Catalogue() {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [categories, setCategories] = useState([]);
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
    async function load() {
      setLoading(true);
      setError(false);
      try {
        const [coursesData, categoriesData] = await Promise.all([getAllCourses(), fetchCourseCategories()]);
        setCourses(coursesData ?? []);
        setCategories(categoriesData ?? []);
      } catch (err) {
        setError(true);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const filteredCourses = useMemo(() => {
    const q = debouncedSearch.toLowerCase();
    return courses
      .filter((c) => {
        const matchSearch = !q || c.courseName?.toLowerCase().includes(q) || c.instructor?.firstName?.toLowerCase().includes(q) || c.instructor?.lastName?.toLowerCase().includes(q);
        const matchCat = activeCategory === "All" || c.category?.name === activeCategory;
        return matchSearch && matchCat;
      })
      .sort((a, b) => {
        if (sortBy === "price-low") return (a.price ?? 0) - (b.price ?? 0);
        if (sortBy === "price-high") return (b.price ?? 0) - (a.price ?? 0);
        if (sortBy === "newest") return new Date(b.createdAt ?? 0).getTime() - new Date(a.createdAt ?? 0).getTime();
        return (b.studentsEnrolled?.length ?? 0) - (a.studentsEnrolled?.length ?? 0);
      });
  }, [courses, debouncedSearch, activeCategory, sortBy]);

  const allCategoryNames = ["All", ...categories.map((c) => c.name)];
  const hasActiveFilter = search !== "" || activeCategory !== "All";

  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-32 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16 text-center lg:text-left">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="inline-flex items-center gap-2 bg-indigo-100 text-indigo-700 text-sm font-bold px-4 py-2 rounded-full mb-6 shadow-sm"><Sparkles size={16} /> Premium Learning Catalog</motion.div>
        <motion.h1 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight">Discover your next skill.</motion.h1>
      </div>

      <div className="sticky top-16 md:top-20 z-30 bg-slate-50/90 backdrop-blur-xl border-y border-slate-200 shadow-sm mb-12">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-4 lg:items-center">
            <div className="relative w-full lg:max-w-sm shrink-0 group">
              <Search size={20} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors pointer-events-none" />
              <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search courses..." className="w-full bg-white border border-slate-200 rounded-full pl-12 pr-10 py-3.5 text-base text-slate-900 font-medium placeholder:text-slate-400 outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-500/10 transition-all shadow-sm" />
              {search && (<button onClick={() => setSearch("")} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 bg-slate-100 rounded-full p-1 transition-colors"><X size={14} /></button>)}
            </div>
            <div className="flex-1 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              <div className="flex items-center gap-2 pb-1">
                {allCategoryNames.map((cat) => {
                  const isActive = activeCategory === cat;
                  return (
                    <button key={cat} onClick={() => setActiveCategory(cat)} className={`shrink-0 px-6 py-3 rounded-full text-sm font-bold whitespace-nowrap transition-all duration-200 border ${isActive ? "bg-slate-900 text-white border-slate-900 shadow-md" : "bg-white text-slate-600 border-slate-200 hover:border-slate-300 hover:text-slate-900"}`}>{cat}</button>
                  );
                })}
              </div>
            </div>
            <SortDropdown value={sortBy} onChange={setSortBy} />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {!loading && !error && (
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
            <h2 className="text-xl font-bold text-slate-900">Showing {filteredCourses.length} {filteredCourses.length === 1 ? "course" : "courses"}</h2>
            {hasActiveFilter && (<button onClick={() => { setSearch(""); setActiveCategory("All"); setSortBy("popular"); }} className="text-sm font-bold text-slate-500 hover:text-slate-900 transition-colors flex items-center gap-2"><X size={18} /> Clear all filters</button>)}
          </div>
        )}
        {error && (
            <div className="flex flex-col items-center justify-center py-24 text-center bg-white rounded-3xl border border-rose-100 shadow-sm">
                <div className="w-16 h-16 rounded-full bg-rose-50 flex items-center justify-center mb-6"><BookOpen size={28} className="text-rose-500" /></div>
                <h3 className="text-2xl font-bold text-slate-900">Connection Error</h3>
            </div>
        )}
        {loading && <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 xl:gap-10">{Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}</div>}
        {!loading && !error && filteredCourses.length === 0 && <EmptyState onReset={() => { setSearch(""); setActiveCategory("All"); setSortBy("popular"); }} />}
        {!loading && !error && filteredCourses.length > 0 && (
          <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 xl:gap-10">
            <AnimatePresence mode="popLayout">
              {filteredCourses.map((course) => <CourseCard key={course._id} course={course} onClick={(id) => navigate(`/catalogue/${id}`)} />)}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </div>
  );
}