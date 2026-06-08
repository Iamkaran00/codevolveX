import React from "react";
import { NavLink } from "react-router-dom";
import { motion } from "framer-motion";
import { SiReact, SiPython, SiKubernetes } from "react-icons/si";
import { FaAws, FaTrophy } from "react-icons/fa6";
import { HiArrowRight, HiPlay, HiStar, HiFire } from "react-icons/hi2";

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 80, damping: 15 } },
};

const BADGES = [
  {
    Icon: SiReact,
    color: "#0ea5e9",
    bg: "bg-sky-50",
    label: "React",
    sub: "18K learners",
    pos: "top-[-10%] left-[-15%]", // Tailwind responsive positioning
    delay: 0,
    dur: 6,
  },
  {
    Icon: SiPython,
    color: "#10b981",
    bg: "bg-emerald-50",
    label: "Python",
    sub: "24K learners",
    pos: "top-[15%] right-[-20%]",
    delay: 0.5,
    dur: 7,
  },
  {
    Icon: FaAws,
    color: "#f97316",
    bg: "bg-orange-50",
    label: "AWS Cloud",
    sub: "11K learners",
    pos: "bottom-[-5%] right-[-10%]",
    delay: 1,
    dur: 5,
  },
  {
    Icon: SiKubernetes,
    color: "#6366f1",
    bg: "bg-indigo-50",
    label: "Kubernetes",
    sub: "9.8K learners",
    pos: "bottom-[20%] left-[-25%]",
    delay: 1.5,
    dur: 8,
  },
];

const MODULES = [
  { label: "Hooks", state: "done" },
  { label: "Context", state: "done" },
  { label: "Auth", state: "active" },
  { label: "Redux", state: "locked" },
];

const STREAK_DAYS = ["M", "T", "W", "T", "F", "S", "S"];
const STREAK_DONE = [0, 1, 2, 3];
const STREAK_TODAY = 4;

// ─── SUB-COMPONENTS ──────────────────────────────────────────────────────────

function FloatLoop({ children, y = 14, duration = 6, delay = 0, className }) {
  return (
    <motion.div
      className={className}
      animate={{ y: [0, -y, 0] }}
      transition={{ duration, repeat: Infinity, ease: "easeInOut", delay }}
    >
      {children}
    </motion.div>
  );
}

function ScreenContent() {
  return (
    <div className="h-full w-full flex flex-col p-4 bg-gray-950 text-white relative overflow-hidden">
      {/* Background glow in screen */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/20 blur-2xl rounded-full" />
      
      {/* Topbar */}
      <div className="flex items-center justify-between mb-4 z-10">
        <div className="flex gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-red-500" />
          <div className="w-2.5 h-2.5 rounded-full bg-amber-500" />
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
        </div>
        <div className="flex gap-2">
          <span className="text-[9px] font-mono px-2 py-1 bg-indigo-500/20 text-indigo-300 rounded">Course</span>
          <span className="text-[9px] font-mono px-2 py-1 bg-white/5 text-gray-400 rounded">Projects</span>
        </div>
      </div>

      {/* Code / Video Area */}
      <div className="relative h-24 bg-gradient-to-br from-indigo-900/50 to-slate-900 rounded-lg border border-white/10 flex-shrink-0 mb-4 flex flex-col justify-end p-3 z-10">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-8 h-8 rounded-full bg-white/10 backdrop-blur border border-white/20 flex items-center justify-center pl-0.5">
            <HiPlay className="text-white/80 w-4 h-4" />
          </div>
        </div>
        <div className="font-mono text-[9px] leading-relaxed text-gray-300 z-10">
          <p className="text-2xl">codevolveX</p>
          <p><span className="text-pink-400">const</span> <span className="text-blue-300">useAuth</span> = () <span className="text-pink-400">=&gt;</span> {"{"}</p>
          <p className="pl-2"><span className="text-pink-400">const</span> [user] = <span className="text-emerald-300">useState</span>(null)</p>
          <p className="pl-2 text-gray-500">// JWT refresh logic</p>
        </div>
      </div>

      {/* Progress */}
      <div className="bg-white/5 border border-white/10 rounded-lg p-3 z-10">
        <div className="flex justify-between items-center mb-2">
          <span className="text-[10px] font-bold text-gray-200">React Auth Mastery</span>
          <span className="text-[10px] font-mono text-indigo-400">72%</span>
        </div>
        <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden mb-3">
          <motion.div 
            initial={{ width: 0 }} 
            animate={{ width: "72%" }} 
            transition={{ duration: 1.5, delay: 0.5 }}
            className="h-full bg-gradient-to-r from-indigo-500 to-cyan-400" 
          />
        </div>
        <div className="grid grid-cols-2 gap-2">
          {MODULES.map(({ label, state }) => (
            <div key={label} className="flex items-center gap-1.5 bg-white/5 p-1.5 rounded">
              <div className={`w-1.5 h-1.5 rounded-full ${state === 'done' ? 'bg-emerald-400' : state === 'active' ? 'bg-indigo-400 animate-pulse' : 'bg-white/20'}`} />
              <span className={`text-[8px] font-bold ${state === 'done' ? 'text-emerald-400' : state === 'active' ? 'text-indigo-300' : 'text-gray-500'}`}>{label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}


export default function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gray-50 px-4 py-20 sm:px-6 lg:px-8 lg:py-32">
      
      {/* Background Gradients */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-[20%] right-[10%] w-[600px] h-[600px] bg-indigo-500/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] bg-sky-500/10 rounded-full blur-[100px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-8 items-center">
        
         <motion.div

          variants={containerVariants}

          initial="hidden"

          animate="show"

          className="max-w-2xl"

        >


          <motion.div variants={itemVariants} className="inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-indigo-50/50 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-indigo-600 mb-6 backdrop-blur-sm">

            <span className="relative flex h-2 w-2">

              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>

              <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-600"></span>

            </span>

            Trusted by 120,000+ developers

          </motion.div>




          <motion.h1 variants={itemVariants} className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-gray-900 leading-[1.1]">

            Master the skills

            <br />

            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-sky-500">

              industry demands.

            </span>

          </motion.h1>



          {/* Paragraph */}

          <motion.p variants={itemVariants} className="mt-6 text-lg sm:text-xl leading-8 text-gray-500 max-w-lg font-medium">

            Hands-on courses built by industry experts. Learn at your pace, ship real projects, and land the role you want — starting today.

          </motion.p>




          <motion.div variants={itemVariants} className="mt-10 flex flex-col sm:flex-row gap-4">

            <NavLink to="/catalogue">

              <button className="flex w-full sm:w-auto items-center justify-center gap-2 rounded-2xl bg-gray-900 px-8 py-4 text-sm font-bold text-white transition-all hover:bg-indigo-600 hover:shadow-lg hover:shadow-indigo-500/25 hover:-translate-y-0.5 active:scale-95">

                Explore Courses

                <HiArrowRight className="h-4 w-4" />

              </button>

            </NavLink>



            <button className="flex w-full sm:w-auto items-center justify-center gap-2 rounded-2xl border border-gray-200 bg-white px-8 py-4 text-sm font-bold transition-all hover:border-gray-900 hover:bg-gray-50 active:scale-95">

              <HiPlay className="h-5 w-5 text-indigo-600" />

          <span className="text-indigo-600">Watch Demo</span>    

            </button>

          </motion.div>



          {/* Stats Bar */}

          <motion.div variants={itemVariants} className="mt-14 flex items-center gap-8 border-t border-gray-100 pt-8">

            {[

              ["120K+", "Learners"],

              ["450+", "Courses"],

              ["4.9★", "Rating"],

            ].map(([num, label], i) => (

              <div key={i} className="flex flex-col">

                <span className="text-2xl font-black text-gray-900">{num}</span>

                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider mt-1">{label}</span>

              </div>

            ))}

          </motion.div>

        </motion.div>
<div className="relative w-full h-[500px] lg:h-[600px] flex items-center justify-center [perspective:1200px]">
          
          {/* Main 3D Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.9, type: "spring" }}
            className="relative z-10 w-full max-w-sm"
          >
            {/* The Laptop Animation Wrapper */}
            <motion.div
              animate={{ y: [0, -15, 0], rotateY: [-8, -12, -8], rotateX: [12, 8, 12] }}
              transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
              className="relative [transform-style:preserve-3d]"
            >
              
              {/* Laptop Screen */}
              <div className="relative w-full aspect-[16/11] bg-gray-900 rounded-t-2xl border-[4px] border-gray-800 shadow-2xl overflow-hidden [transform-style:preserve-3d]">
                {/* Webcam Notch */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-16 h-3 bg-gray-800 rounded-b-md z-20 flex justify-center items-center">
                  <div className="w-1 h-1 rounded-full bg-blue-900/50" />
                </div>
                <ScreenContent />
              </div>

              {/* Laptop Base (Hinge + Keyboard Deck) */}
              <div className="relative w-[110%] -ml-[5%] h-5 bg-gradient-to-b from-gray-300 to-gray-400 rounded-b-xl shadow-[0_20px_40px_rgba(0,0,0,0.4)] flex justify-center [transform:translateZ(10px)] border-t border-gray-200">
                <div className="w-20 h-1.5 bg-gray-400/50 rounded-b-md mt-0.5" />
              </div>

               
              <FloatLoop y={10} duration={5} delay={0.2} className="absolute -bottom-15 -left-12 sm:-left-20 z-50">
                <div className="bg-gradient-to-br from-indigo-950 to-indigo-900 border border-indigo-500/30 shadow-xl shadow-indigo-900/20 rounded-2xl p-4 text-white w-36">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-3xl font-black">14</span>
                    <HiFire className="text-orange-500 w-6 h-6" />
                  </div>
                  <p className="text-[10px] text-indigo-200 font-bold uppercase tracking-wider mb-3">Day Streak</p>
                  <div className="flex gap-1 justify-between">
                    {STREAK_DAYS.map((d, i) => (
                      <div key={i} className={`w-4 h-4 flex items-center justify-center rounded text-[8px] font-bold ${
                        i === STREAK_TODAY ? 'bg-indigo-500 text-white shadow-[0_0_8px_theme(colors.indigo.500)]' : 
                        STREAK_DONE.includes(i) ? 'bg-indigo-500/30 text-indigo-200' : 'bg-white/5 text-white/30'
                      }`}>
                        {d}
                      </div>
                    ))}
                  </div>
                </div>
              </FloatLoop>

              
              <FloatLoop y={12} duration={6} delay={1} className="absolute -top-8 -right-8 sm:-right-16 z-30">
                <div className="bg-white/95 backdrop-blur-md border border-gray-100 shadow-2xl shadow-gray-200/50 rounded-2xl p-3 flex items-center gap-3 w-56">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-inner flex-shrink-0">
                    <FaTrophy className="text-white w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-gray-900">Certificate Earned!</h4>
                    <p className="text-[10px] text-gray-500 mt-0.5">Priya completed React</p>
                    <div className="flex text-amber-400 text-[10px] mt-1 gap-0.5">
                      <HiStar /><HiStar /><HiStar /><HiStar /><HiStar />
                    </div>
                  </div>
                </div>
              </FloatLoop>

            </motion.div>

            {BADGES.map((badge, i) => (
              <FloatLoop key={i} y={15} duration={badge.dur} delay={badge.delay} className={`absolute ${badge.pos} z-0 hidden sm:block`}>
                <motion.div 
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1 + i * 0.2, type: 'spring' }}
                  className="bg-white border border-gray-100 shadow-xl rounded-2xl p-2.5 pr-4 flex items-center gap-3"
                >
                  <div className={`w-10 h-10 rounded-xl ${badge.bg} flex items-center justify-center`}>
                    <badge.Icon className="w-5 h-5" style={{ color: badge.color }} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-900">{badge.label}</p>
                    <p className="text-[10px] font-medium text-gray-500">{badge.sub}</p>
                  </div>
                </motion.div>
              </FloatLoop>
            ))}

          </motion.div>
        </div>

      </div>
    </section>
  );
}