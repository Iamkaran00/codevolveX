import React, { useEffect, useRef, useState } from "react";
import { HiArrowRight, HiWrenchScrewdriver, HiChartBar, HiGlobeAlt } from "react-icons/hi2";
import { RiMoneyDollarCircleLine } from "react-icons/ri";

const PERKS = [
  {
    Icon: RiMoneyDollarCircleLine,
    title: "Keep 70%",
    desc: "Industry-leading revenue share on every sale",
    delay: "delay-[300ms]",
  },
  {
    Icon: HiWrenchScrewdriver,
    title: "Full tools",
    desc: "Studio-quality recording guides & upload tools",
    delay: "delay-[400ms]",
  },
  {
    Icon: HiChartBar,
    title: "Analytics",
    desc: "Deep insights into student progress & drop-off",
    delay: "delay-[500ms]",
  },
  {
    Icon: HiGlobeAlt,
    title: "Global reach",
    desc: "Market to 120K+ active learners from day one",
    delay: "delay-[600ms]",
  },
];

export const InstructorCTA = () => {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setInView(true); observer.disconnect(); } },
      { threshold: 0.08 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={ref} className="px-[5%] py-20">
      <div
        className={`relative overflow-hidden rounded-3xl p-14 lg:p-16
          bg-gradient-to-br from-[#1a1a2e] to-[#2d2b4e]
          grid grid-cols-1 lg:grid-cols-2 gap-14 items-center
          transition-all duration-700
          ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-7"}`}
      >
        {/* Decorative glow blob */}
        <div className="absolute -right-20 -top-20 w-80 h-80 rounded-full bg-indigo-500/10 pointer-events-none" />
        <div className="absolute -left-10 -bottom-16 w-48 h-48 rounded-full bg-violet-500/10 pointer-events-none" />

        {/* ── Left: Headline + CTA ─────────────────── */}
        <div
          className={`relative transition-all duration-700 delay-100
            ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"}`}
        >
          <h2 className="font-['Syne'] text-3xl lg:text-[38px] font-extrabold text-white leading-tight tracking-tight mb-4">
            Share what you know.<br />
            <em className="not-italic text-indigo-300">Earn doing it.</em>
          </h2>
          <p className="text-white/55 text-[15px] leading-relaxed mb-8 max-w-md">
            Join 3,200+ expert instructors on codeVolveX. Set your price,
            own your content, and build a passive income that scales while
            you sleep.
          </p>
          <button
            className="inline-flex items-center gap-2 bg-indigo-500 hover:bg-indigo-400
              text-white font-medium text-[15px] px-7 py-3.5 rounded-xl
              transition-all duration-200 hover:-translate-y-0.5
              shadow-[0_4px_20px_rgba(99,102,241,0.35)]"
          >
            Become an Instructor <HiArrowRight size={16} />
          </button>
        </div>

        {/* ── Right: Perks grid ────────────────────── */}
        <div className="relative grid grid-cols-2 gap-6">
          {PERKS.map(({ Icon, title, desc, delay }, i) => (
            <div
              key={i}
              className={`group flex gap-3 items-start
                transition-all duration-500 ${delay}
                ${inView ? "opacity-100 translate-x-0" : "opacity-0 translate-x-5"}`}
            >
              <div
                className="w-10 h-10 rounded-xl flex-shrink-0 flex items-center justify-center
                  bg-white/8 border border-white/10 text-indigo-300
                  transition-all duration-200
                  group-hover:bg-indigo-500/25 group-hover:scale-110"
              >
                <Icon size={18} />
              </div>
              <div>
                <p className="text-white text-[13px] font-bold mb-0.5">{title}</p>
                <p className="text-white/50 text-[12.5px] leading-snug">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};