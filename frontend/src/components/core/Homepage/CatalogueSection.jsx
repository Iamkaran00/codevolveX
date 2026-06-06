import React, { useState, useEffect, useRef } from "react";
import {
  SiReact,
  SiPython,
  SiDocker,
  SiPytorch,
  SiTypescript,
} from "react-icons/si";
import { HiStar, HiArrowRight } from "react-icons/hi2";
import { FaCss3 } from "react-icons/fa6";

const COURSES = [
  {
    cat: "frontend",
    Icon: SiReact,
    iconColor: "#38bdf8", // Sky 400
    thumbGradient: "from-sky-50 to-indigo-50",
    tagBg: "bg-indigo-50 text-indigo-700 ring-1 ring-indigo-600/10",
    tag: "Frontend",
    title: "React & TypeScript: Production Patterns",
    instructor: "Priya Sharma",
    rating: "4.9",
    reviews: "3.2k",
    price: "₹1,299",
    original: "₹3,499",
    bestseller: true,
  },
  {
    cat: "data",
    Icon: SiPython,
    iconColor: "#4ade80", // Green 400
    thumbGradient: "from-green-50 to-emerald-50",
    tagBg: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-600/10",
    tag: "Data Science",
    title: "Python for Machine Learning & AI",
    instructor: "Arjun Mehta",
    rating: "4.8",
    reviews: "5.1k",
    price: "₹1,499",
    original: "₹3,999",
    bestseller: false,
  },
  {
    cat: "backend",
    Icon: SiTypescript,
    iconColor: "#60a5fa", // Blue 400
    thumbGradient: "from-blue-50 to-cyan-50",
    tagBg: "bg-blue-50 text-blue-700 ring-1 ring-blue-600/10",
    tag: "Backend",
    title: "System Design for Senior Engineers",
    instructor: "Rohit Das",
    rating: "4.9",
    reviews: "2.8k",
    price: "₹1,799",
    original: "₹4,499",
    bestseller: true,
  },
  {
    cat: "frontend",
    Icon: FaCss3,
    iconColor: "#f472b6", // Pink 400
    thumbGradient: "from-pink-50 to-rose-50",
    tagBg: "bg-pink-50 text-pink-700 ring-1 ring-pink-600/10",
    tag: "Frontend",
    title: "Advanced CSS: Animations & Design Systems",
    instructor: "Sneha Patel",
    rating: "4.7",
    reviews: "1.5k",
    price: "₹999",
    original: "₹2,999",
    bestseller: false,
  },
  {
    cat: "backend",
    Icon: SiDocker,
    iconColor: "#38bdf8", // Sky 400
    thumbGradient: "from-sky-50 to-blue-50",
    tagBg: "bg-sky-50 text-sky-700 ring-1 ring-sky-600/10",
    tag: "Backend",
    title: "Docker, Kubernetes & Cloud DevOps",
    instructor: "Vikram Singh",
    rating: "4.8",
    reviews: "1.9k",
    price: "₹1,399",
    original: "₹3,799",
    bestseller: false,
  },
  {
    cat: "data",
    Icon: SiPytorch,
    iconColor: "#fb923c", // Orange 400
    thumbGradient: "from-orange-50 to-red-50",
    tagBg: "bg-orange-50 text-orange-700 ring-1 ring-orange-600/10",
    tag: "Data Science",
    title: "Deep Learning with PyTorch from Scratch",
    instructor: "Nisha Rao",
    rating: "4.9",
    reviews: "2.2k",
    price: "₹1,699",
    original: "₹4,299",
    bestseller: false,
  },
];

const TABS = [
  { key: "all", label: "All Courses" },
  { key: "frontend", label: "Frontend" },
  { key: "backend", label: "Backend" },
  { key: "data", label: "Data Science" },
];

export const CatalogueSection = () => {
  const [active, setActive] = useState("all");
  const [inView, setInView] = useState(false);
  const ref = useRef(null);

  // Trigger entrance animation on scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  const filtered = active === "all" ? COURSES : COURSES.filter((c) => c.cat === active);

  return (
    <section ref={ref} className="py-24 bg-white sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 bg-white">
        
        {/* ── Header ───────────────────────────────── */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
          <div className="max-w-2xl">
            <h2 className="text-sm font-bold leading-7 text-indigo-600 uppercase tracking-widest">
              Course Catalogue
            </h2>
            <p className="mt-2 text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl lg:text-5xl">
              Build skills that matter.
            </p>
          </div>

          <div className="flex items-center gap-5 flex-wrap">
            {/* Filter Tabs */}
            <div className="flex flex-wrap gap-1 p-1 bg-black rounded-2xl border border-gray-200/50 shadow-inner">
              {TABS.map((t) => (
                <button
                  key={t.key}
                  onClick={() => setActive(t.key)}
                  className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ease-out outline-none focus-visible:ring-2 focus-visible:ring-indigo-500
                    ${
                      active === t.key
                        ? "bg-white/70 text-white-900 shadow-sm"
                        : "text-gray-500 hover:text-gray-900 hover:bg-gray-200/50"
                    }`}
                >
                  {t.label}
                </button>
              ))}
            </div>

            {/* Desktop View All Button */}
            <button className="hidden sm:flex items-center gap-1.5 text-sm font-semibold text-gray-500 hover:text-indigo-600 transition-colors group">
              View all 450+
              <HiArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </button>
          </div>
        </div>

        {/* ── Grid ─────────────────────────────────── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filtered.map((course, i) => (
            <div
              key={`${active}-${course.title}`} // Forces re-animation when category changes
              className={`transition-all duration-700 ease-out ${
                inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
              }`}
              style={{ transitionDelay: `${i * 100}ms` }}
            >
              {/* CARD: Handles instant hover animations */}
              <div className="group flex flex-col h-full bg-white rounded-3xl border border-gray-200/75 overflow-hidden hover:border-indigo-200 hover:-translate-y-1.5 hover:shadow-[0_12px_40px_rgb(0,0,0,0.08)] transition-all duration-300 ease-out cursor-pointer">
                
                {/* Thumbnail */}
                <div className={`relative h-48 w-full flex items-center justify-center bg-gradient-to-br ${course.thumbGradient} overflow-hidden`}>
                  <course.Icon
                    size={64}
                    color={course.iconColor}
                    className="transition-transform duration-500 ease-out group-hover:scale-110 group-hover:-rotate-6 drop-shadow-sm"
                  />
                  {course.bestseller && (
                    <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm text-gray-900 text-xs font-bold px-3 py-1.5 rounded-full shadow-sm ring-1 ring-gray-900/5">
                      Bestseller
                    </div>
                  )}
                </div>

                {/* Body */}
                <div className="p-7 flex-1 flex flex-col">
                  <div className="flex items-center justify-between mb-4">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider ${course.tagBg}`}>
                      {course.tag}
                    </span>
                    
                    <div className="flex items-center gap-1">
                      <HiStar className="h-4 w-4 text-amber-400" />
                      <span className="text-sm font-bold text-gray-700">{course.rating}</span>
                      <span className="text-xs text-gray-400 font-medium">({course.reviews})</span>
                    </div>
                  </div>

                  <h3 className="text-lg font-bold text-gray-900 leading-snug mb-2 group-hover:text-indigo-600 transition-colors">
                    {course.title}
                  </h3>

                  <p className="text-sm font-medium text-gray-500 mb-8">
                    by {course.instructor}
                  </p>

                  {/* Footer (Pushed to bottom) */}
                  <div className="mt-auto flex items-end justify-between border-t border-gray-100 pt-5">
                    <div className="flex flex-col">
                      <span className="text-sm text-gray-400 line-through decoration-gray-300 font-medium mb-0.5">
                        {course.original}
                      </span>
                      <span className="text-2xl font-black text-gray-900 leading-none">
                        {course.price}
                      </span>
                    </div>

                    <button className="bg-gray-900 text-white text-sm font-semibold px-6 py-2.5 rounded-xl border border-transparent hover:bg-indigo-600 hover:shadow-md hover:shadow-indigo-500/20 transition-all duration-200">
                      Enroll
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-12 sm:hidden flex justify-center">
            <button className="flex items-center justify-center gap-2 w-full text-sm font-semibold text-indigo-600 bg-indigo-50 px-6 py-4 rounded-2xl hover:bg-indigo-100 transition-colors">
              View all 450+ courses
              <HiArrowRight className="h-4 w-4" />
            </button>
        </div>

      </div>
    </section>
  );
};