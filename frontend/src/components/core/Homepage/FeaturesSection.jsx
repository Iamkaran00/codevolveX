import React, { useEffect, useRef, useState } from "react";
import {
  HiBolt,
  HiMap,
  HiUsers,
  HiTrophy,
  HiCpuChip,
  HiDevicePhoneMobile,
} from "react-icons/hi2";

const FEATURES = [
  {
    Icon: HiBolt,
    accent: "indigo",
    title: "Project-first learning",
    desc: "Every course centers on shipping real products. Build things that go straight on your portfolio from day one.",
  },
  {
    Icon: HiMap,
    accent: "emerald",
    title: "Structured roadmaps",
    desc: "Curated paths for frontend, backend, DevOps, and ML that take you from zero to job-ready in months.",
  },
  {
    Icon: HiUsers,
    accent: "violet",
    title: "Expert mentors",
    desc: "Live Q&A, office hours, and 1-on-1 sessions with engineers from Google, Meta, and top-tier startups.",
  },
  {
    Icon: HiTrophy,
    accent: "amber",
    title: "Industry certificates",
    desc: "Verified credentials recognised by 500+ hiring partners. Add them to LinkedIn with one click.",
  },
  {
    Icon: HiCpuChip,
    accent: "rose",
    title: "AI-powered feedback",
    desc: "Instant code reviews on every submission — not just what's wrong, but exactly why and how to fix it.",
  },
  {
    Icon: HiDevicePhoneMobile,
    accent: "sky",
    title: "Learn anywhere",
    desc: "Full-featured mobile and desktop apps with offline mode. Progress syncs seamlessly across every device.",
  },
];

// Helper to map dynamic colors safely in Tailwind
const ACCENT_MAP = {
  indigo: { bg: "bg-indigo-50", text: "text-indigo-600", groupHover: "group-hover:bg-indigo-600", border: "hover:border-indigo-200" },
  emerald: { bg: "bg-emerald-50", text: "text-emerald-600", groupHover: "group-hover:bg-emerald-600", border: "hover:border-emerald-200" },
  violet: { bg: "bg-violet-50", text: "text-violet-600", groupHover: "group-hover:bg-violet-600", border: "hover:border-violet-200" },
  amber: { bg: "bg-amber-50", text: "text-amber-600", groupHover: "group-hover:bg-amber-500", border: "hover:border-amber-200" },
  rose: { bg: "bg-rose-50", text: "text-rose-600", groupHover: "group-hover:bg-rose-600", border: "hover:border-rose-200" },
  sky: { bg: "bg-sky-50", text: "text-sky-600", groupHover: "group-hover:bg-sky-600", border: "hover:border-sky-200" },
};

export const FeaturesSection = () => {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={ref}
      className="bg-white px-[5%] py-24 sm:py-32 relative overflow-hidden font-['Inter',_sans-serif]"
    >
      {/* Subtle background mesh to prevent pure white flatness */}
      <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:24px_24px] opacity-40 pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div
          className={`max-w-2xl text-left mb-16 transition-all duration-1000 ease-out
            ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
        >
          <p className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 border border-slate-200 mb-6">
            <span className="w-2 h-2 rounded-full bg-indigo-600 animate-pulse" />
            <span className="text-[11px] font-bold tracking-[0.2em] text-slate-600 uppercase">
              Why codeVolveX
            </span>
          </p>
          <h2 className="font-['Syne',_sans-serif] text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 leading-[1.15]">
            Everything you need to grow{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-500">
              as a developer.
            </span>
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 ">
          {FEATURES.map(({ Icon, accent, title, desc }, i) => {
            const colors = ACCENT_MAP[accent];
            return (
              <div
                key={i}
                style={{ transitionDelay: `${i * 100}ms` }}
                className={`group relative bg-white border border-slate-100 rounded-[1.25rem] p-8 lg:p-10
                  ${colors.border} hover:-translate-y-1.5 hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)]
                  transition-all duration-500 ease-out cursor-default
                  ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"}`}
              >
                {/* Decorative top border line that expands on hover */}
                <div className={`absolute top-0 left-8 right-8 h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent transition-all duration-500 group-hover:via-${accent}-400 group-hover:scale-x-110 opacity-0 group-hover:opacity-100`} />

                {/* Icon Container */}
                <div
                  className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-8
                    ${colors.bg} transition-all duration-500 ease-out
                    group-hover:scale-110 group-hover:-rotate-6 group-hover:shadow-md ${colors.groupHover}`}
                >
                  <Icon size={26} className={`${colors.text} transition-colors duration-500 group-hover:text-white`} />
                </div>
                
                {/* Text */}
                <h3 className="font-['Syne',_sans-serif] text-xl font-bold text-slate-900 mb-3 group-hover:text-indigo-950 transition-colors">
                  {title}
                </h3>
                <p className="text-[15px] text-slate-500 leading-relaxed font-medium">
                  {desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};