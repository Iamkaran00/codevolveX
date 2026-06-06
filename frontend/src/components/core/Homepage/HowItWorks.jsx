import React, { useEffect, useRef, useState } from "react";
import {
  HiMagnifyingGlass,
  HiWrenchScrewdriver,
  HiSparkles,
  HiAcademicCap,
  HiCommandLine,
} from "react-icons/hi2";

const STEPS = [
  {
    Icon: HiMagnifyingGlass,
    title: "Choose your learning path",
    desc: "Browse 450+ courses or follow a curated roadmap aligned to your career goal — frontend, backend, ML, or DevOps.",
  },
  {
    Icon: HiWrenchScrewdriver,
    title: "Learn by building real projects",
    desc: "Every module ends with a hands-on project. Build a portfolio that actually impresses hiring managers.",
  },
  {
    Icon: HiSparkles,
    title: "Get AI-powered feedback",
    desc: "Submit code and receive instant detailed reviews — not just what's wrong, but exactly how to fix it.",
  },
  {
    Icon: HiAcademicCap,
    title: "Earn your certificate & get hired",
    desc: "Download your verified certificate and connect with 500+ hiring partners actively recruiting from codeVolveX.",
  },
];

const BASE_LINES = [
  { n: 1,  jsx: <span className="text-zinc-500">{"// codeVolveX Core System ⚡️"}</span> },
  { n: 2,  jsx: "" },
  { n: 3,  jsx: <><span className="text-violet-400">async function</span><span className="text-cyan-400"> executeCareerPath</span>(student) {"{"}</> },
  { n: 4,  jsx: <>&nbsp;&nbsp;<span className="text-violet-400">const</span><span className="text-zinc-300"> path</span> = <span className="text-violet-400">await</span><span className="text-cyan-400"> analyzeGoals</span>(student);</> },
  { n: 5,  jsx: <>&nbsp;&nbsp;<span className="text-violet-400">const</span><span className="text-zinc-300"> portfolio</span> = <span className="text-cyan-400">buildProjects</span>(<span className="text-zinc-300">path</span>);</> },
  { n: 6,  jsx: "" },
  { n: 7,  jsx: <>&nbsp;&nbsp;<span className="text-violet-400">for</span> (<span className="text-violet-400">const</span><span className="text-zinc-300"> project</span><span className="text-violet-400"> of</span><span className="text-zinc-300"> portfolio</span>) {"{"}</> },
  { n: 8,  jsx: <>&nbsp;&nbsp;&nbsp;&nbsp;<span className="text-violet-400">await</span><span className="text-cyan-400"> deploy</span>(<span className="text-zinc-300">project</span>);</> },
  { n: 9,  jsx: <>&nbsp;&nbsp;&nbsp;&nbsp;<span className="text-cyan-400">requestAiReview</span>(<span className="text-zinc-300">project</span>);</> },
  { n: 10, jsx: <>&nbsp;&nbsp;{"}"}</> },
  { n: 11, jsx: "" },
  { n: 12, jsx: <>&nbsp;&nbsp;<span className="text-violet-400">return</span><span className="text-emerald-400"> "Hired."</span>;</> },
  { n: 13, jsx: <>{"}"}</> },
];

const EXTRA_LINES = [
  { n: 15, jsx: <span className="text-zinc-500">{"// > Initializing sequence..."}</span> },
  { n: 16, jsx: <><span className="text-zinc-300">status</span> = <span className="text-cyan-400">executeCareerPath</span>(<span className="text-emerald-400">"you"</span>)</> },
  { n: 17, jsx: <span className="text-emerald-500">{"// [OK] All tests passed. Portfolio verified."}</span> },
  { n: 18, jsx: <span className="text-violet-400">{"// [OK] Ready for interviews."}</span> },
];

export const HowItWorks = () => {
  const ref = useRef(null);
  const [extraVisible, setExtraVisible] = useState([]);
  const [activeStep, setActiveStep] = useState(0);
  const [inView, setInView] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setInView(true);
          observer.disconnect();
          EXTRA_LINES.forEach((_, i) => {
            setTimeout(() => setExtraVisible((prev) => [...prev, i]), 2000 + i * 800);
          });
        }
      },
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (isHovered) return;
    const t = setInterval(() => setActiveStep((s) => (s + 1) % STEPS.length), 3000);
    return () => clearInterval(t);
  }, [isHovered]);

  return (
    <section
      ref={ref}
      className={`relative w-full bg-[#050505] font-['Inter',_sans-serif] px-[5%] py-24 overflow-hidden
        transition-all duration-1000 ease-out 
        ${inView ? "opacity-100" : "opacity-0"}`}
    >
      {/* Background ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-violet-900/20 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center relative z-10">
        
        {/* ── Left: Steps Dashboard ─────────────────────────────── */}
        <div
          className={`transition-all duration-700 delay-200
            ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.03] border border-white/[0.08] mb-8">
            <HiSparkles className="text-cyan-400" size={14} />
            <span className="text-[11px] font-semibold tracking-widest text-zinc-300 uppercase">
              The Framework
            </span>
          </div>
          
          <h2 className="text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-[1.1] mb-12">
            Master the stack.<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-violet-500">
              Ship the code. Get hired.
            </span>
          </h2>

          <div 
            className="flex flex-col gap-1"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            {STEPS.map(({ Icon, title, desc }, i) => {
              const isActive = activeStep === i;
              return (
                <div
                  key={i}
                  onClick={() => setActiveStep(i)}
                  className={`relative flex gap-5 p-5 rounded-2xl cursor-pointer transition-all duration-500 ease-out border
                    ${isActive 
                      ? "bg-white/[0.04] border-white/[0.1] shadow-2xl" 
                      : "bg-transparent border-transparent hover:bg-white/[0.02]"}`}
                >
                  {/* Active Indicator Line */}
                  <div className={`absolute left-0 top-1/4 bottom-1/4 w-[3px] rounded-r-md transition-all duration-500
                    ${isActive ? "bg-cyan-400 scale-y-100" : "bg-transparent scale-y-0"}`} 
                  />

                  {/* Icon */}
                  <div className={`flex items-center justify-center w-12 h-12 rounded-xl border transition-all duration-500 shrink-0
                    ${isActive
                      ? "bg-cyan-500/10 border-cyan-500/30 text-cyan-400 shadow-[0_0_20px_rgba(34,211,238,0.2)]"
                      : "bg-white/[0.02] border-white/[0.05] text-zinc-500"}`}
                  >
                    <Icon size={22} />
                  </div>

                  {/* Text */}
                  <div className="flex flex-col justify-center">
                    <h3 className={`text-base font-semibold mb-1.5 transition-colors duration-300
                      ${isActive ? "text-white" : "text-zinc-400"}`}>
                      {title}
                    </h3>
                    <p className={`text-sm leading-relaxed transition-all duration-300
                      ${isActive ? "text-zinc-300" : "text-zinc-600"}`}>
                      {desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── Right: Integrated Terminal ───────────────────────── */}
        <div
          className={`transition-all duration-1000 delay-300
            ${inView ? "opacity-100 translate-x-0" : "opacity-0 translate-x-12"}`}
        >
          <div className="bg-[#0c0c0c] rounded-2xl overflow-hidden border border-white/[0.08] shadow-[0_0_50px_rgba(0,0,0,0.5)] ring-1 ring-white/[0.02]">
            
            {/* Minimalist Header */}
            <div className="bg-[#111111] px-5 py-4 flex items-center justify-between border-b border-white/[0.05]">
              <div className="flex items-center gap-3">
                <HiCommandLine className="text-zinc-500" size={18} />
                <span className="font-mono text-xs font-medium text-zinc-400 tracking-wider">
                  runtime@codevolvex: ~
                </span>
              </div>
              <div className="flex gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-zinc-700/50" />
                <span className="w-2.5 h-2.5 rounded-full bg-zinc-700/50" />
                <span className="w-2.5 h-2.5 rounded-full bg-zinc-700/50" />
              </div>
            </div>

            {/* Code body */}
            <div className="px-6 py-8 font-mono text-[13px] sm:text-[14px] leading-[1.8] text-zinc-300 overflow-y-auto max-h-[450px]
              scrollbar-thin scrollbar-track-transparent scrollbar-thumb-white/[0.1]">
              
              {BASE_LINES.map((line, i) => (
                <div key={i} className="flex gap-6 group hover:bg-white/[0.02] px-2 -mx-2 rounded transition-colors">
                  <span className="text-zinc-600 text-xs w-6 text-right select-none flex-shrink-0 pt-[3px]">
                    {line.n}
                  </span>
                  <span>{line.jsx}</span>
                  {i === BASE_LINES.length - 1 && extraVisible.length === 0 && (
                    <span className="inline-block w-2 h-4 bg-cyan-400 animate-[blink_1s_step-end_infinite] align-middle ml-1 mt-1 opacity-80" />
                  )}
                </div>
              ))}

              <div className="h-4" /> {/* Spacer */}

              {EXTRA_LINES.map((line, i) =>
                extraVisible.includes(i) ? (
                  <div
                    key={`ex${i}`}
                    className="flex gap-6 px-2 -mx-2 rounded animate-[fadeInLine_0.4s_ease_forwards]"
                  >
                    <span className="text-zinc-600 text-xs w-6 text-right select-none flex-shrink-0 pt-[3px]">
                      {line.n}
                    </span>
                    <span>{line.jsx}</span>
                  </div>
                ) : null
              )}
            </div>
          </div>
        </div>

      </div>

      <style>{`
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }
        @keyframes fadeInLine { 
          from { opacity:0; transform:translateY(8px) } 
          to { opacity:1; transform:translateY(0) } 
        }
      `}</style>
    </section>
  );
};