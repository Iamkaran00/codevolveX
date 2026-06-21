import React, { useRef, useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { motion, useScroll, useTransform } from "framer-motion"
import ContactUsForm from "../components/common/ContactUsform"
import {Footer} from "../components/common/Footer"
import founderimage from '../assets/FounderImage.jpg'
const statsData = [
  { count: "5K+", label: "Active Learners" },
  { count: "10+", label: "Industry Mentors" },
  { count: "200+", label: "Interactive Modules" },
  { count: "50+", label: "Verifiable Certifications" },
]

const featuresData = [
  {
    index: "01",
    title: "AI Skill Gap Analysis",
    description: "Upload your resume and target job. We automatically curate the exact modules you need to bridge your knowledge gap.",
    wide: true,
  },
  {
    index: "02",
    title: "Interactive Mock Interviews",
    description: "Practice live with our AI interviewer. Write code in real-time while receiving dynamic hints.",
    wide: false,
  },
  {
    index: "03",
    title: "Human-Validated Credentials",
    description: "Your final capstone isn't graded by a script. Industry experts review your code before you earn your credential.",
    wide: false,
  },
  {
    index: "04",
    title: "Dynamic Auto-Quizzing",
    description: "Stop memorising static answers. Our engine generates unique debugging and system-design questions based on your progress.",
    wide: true,
  },
]

const reveal = {
  hidden: { opacity: 0, y: 30 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: i * 0.1 },
  }),
}

function AnimatedCounter({ value, suffix }) {
  const [display, setDisplay] = useState(0)
  const raw = parseInt(value)

  useEffect(() => {
    let start = 0
    const step = raw / 60
    const timer = setInterval(() => {
      start += step
      if (start >= raw) { setDisplay(raw); clearInterval(timer) }
      else setDisplay(Math.floor(start))
    }, 16)
    return () => clearInterval(timer)
  }, [raw])

  return <>{display}{suffix}</>
}

const marqueeItems = [
  "System Design", "WebSockets", "Distributed Systems", "LeetCode Patterns",
  "Database Optimisation", "Cloud Architecture", "API Engineering", "ML Pipelines",
]

function Marquee() {
  const items = [...marqueeItems, ...marqueeItems]
  return (
    <div className="overflow-hidden border-y border-slate-200 bg-white py-5">
      <motion.div
        className="flex gap-12 whitespace-nowrap"
        animate={{ x: ["0%", "-50%"] }}
        transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
      >
        {items.map((item, i) => (
          <span key={i} className="flex items-center gap-12 text-sm font-bold tracking-widest uppercase text-slate-400">
            {item}
            <span className="w-2 h-2 rounded-full bg-indigo-500/30 inline-block"></span>
          </span>
        ))}
      </motion.div>
    </div>
  )
}

const About = () => {
  const heroRef = useRef(null)
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] })
  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "20%"])
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0])

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-indigo-500/20">
      
      <section ref={heroRef} className="relative flex flex-col justify-center pt-32 pb-20 overflow-hidden bg-slate-50">
        <div className="absolute inset-0 pointer-events-none opacity-40"
          style={{
            backgroundImage: `linear-gradient(to right, #cbd5e1 1px, transparent 1px), linear-gradient(to bottom, #cbd5e1 1px, transparent 1px)`,
            backgroundSize: "64px 64px",
            maskImage: "radial-gradient(ellipse 80% 80% at 50% 0%, black 30%, transparent 100%)"
          }}
        />

        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-indigo-500/10 blur-[100px] rounded-full pointer-events-none" />

        <motion.div style={{ y: heroY, opacity: heroOpacity }} className="relative z-10 mx-auto w-full max-w-7xl px-6 lg:px-8 mt-8 text-center">
          <motion.div initial="hidden" animate="visible" custom={0} variants={reveal} className="mb-8 flex justify-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-indigo-50/50 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-indigo-600 backdrop-blur-sm">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
              </span>
              Revolutionising Tech Education
            </span>
          </motion.div>

          <motion.h1
            initial="hidden" animate="visible" custom={1} variants={reveal}
            className="mx-auto max-w-5xl text-5xl font-extrabold tracking-tight text-slate-900 sm:text-7xl md:text-8xl"
          >
            Engineered for <br className="hidden sm:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-500">
              Real-World Execution.
            </span>
          </motion.h1>

          <motion.p
            initial="hidden" animate="visible" custom={2} variants={reveal}
            className="mx-auto mt-8 max-w-2xl text-lg font-medium leading-relaxed text-slate-500 sm:text-xl"
          >
            CodevolveX closes the gap between theoretical knowledge and production-ready engineering
            through dynamic, AI-assisted learning paths tailored to your exact career goals.
          </motion.p>

          <motion.div initial="hidden" animate="visible" custom={3} variants={reveal} className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/signup">
              <button className="rounded-full bg-indigo-600 px-8 py-4 text-sm font-bold text-white shadow-lg shadow-indigo-600/20 transition-all hover:scale-105 hover:bg-indigo-700 hover:shadow-xl hover:shadow-indigo-600/30">
                Start Building Now
              </button>
            </Link>
            <a href="#story">
              <button className="rounded-full border-2 border-slate-200 bg-white px-8 py-4 text-sm font-bold text-slate-700 transition-all hover:bg-slate-50 hover:border-slate-300">
                Read Our Story
              </button>
            </a>
          </motion.div>
        </motion.div>

        <div className="relative z-10 mx-auto mt-24 w-full max-w-6xl px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
            <motion.div
              initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.4 }}
              className="hidden md:block relative h-64 w-full rounded-3xl overflow-hidden shadow-xl shadow-slate-200"
            >
              <img
                src="https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=800&auto=format&fit=crop"
                alt="Workspace"
                className="h-full w-full object-cover"
              />
              <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md rounded-lg px-3 py-1.5 text-xs font-bold text-indigo-600 shadow-sm">
                200+ Modules
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 60 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }}
              className="relative h-80 md:h-[400px] w-full rounded-3xl overflow-hidden shadow-2xl shadow-indigo-500/20 md:scale-110 z-20 border-4 border-white"
            >
              <img
                src="https://images.unsplash.com/photo-1607799279861-4ddca868f182?q=80&w=900&auto=format&fit=crop"
                alt="Code"
                className="h-full w-full object-cover"
              />
              <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-md rounded-xl p-3 shadow-lg flex items-center justify-between border border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                  </div>
                  <span className="text-sm font-bold text-slate-800">AI Mentor Active</span>
                </div>
                <span className="text-xs font-bold text-slate-400">Processing...</span>
              </div>
            </motion.div>

            {/* Right Image */}
            <motion.div
              initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.5 }}
              className="hidden md:block relative h-64 w-full rounded-3xl overflow-hidden shadow-xl shadow-slate-200"
            >
              <img
                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=800&auto=format&fit=crop"
                alt="Team"
                className="h-full w-full object-cover"
              />
              <div className="absolute top-4 right-4 bg-slate-900/90 backdrop-blur-md rounded-lg px-3 py-1.5 text-xs font-bold text-white shadow-sm">
                5K+ Learners
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <Marquee />

      <section className="bg-white py-24 border-b border-slate-100">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {statsData.map((stat, i) => (
              <motion.div
                key={i}
                initial="hidden" whileInView="visible" custom={i} variants={reveal} viewport={{ once: true }}
                className="flex flex-col items-center justify-center p-6 text-center"
              >
                <div className="text-5xl md:text-6xl font-extrabold tracking-tighter text-slate-900 mb-2">
                  <AnimatedCounter value={parseInt(stat.count)} suffix={stat.count.replace(/[0-9]/g, "")} />
                </div>
                <div className="text-sm font-bold uppercase tracking-widest text-indigo-600">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section id="story" className="bg-slate-50 py-24 lg:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            
            <motion.div
              initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }} viewport={{ once: true }}
              className="relative"
            >
              <div className="absolute inset-0 bg-gradient-to-tr from-indigo-200 to-cyan-100 rounded-[2.5rem] transform translate-x-4 translate-y-4"></div>
              <img
                src={founderimage}
                alt="Development environment"
                className="relative z-10 w-full h-[500px] object-cover rounded-[2.5rem] shadow-2xl border-4 border-white"
              />
              
            </motion.div>

            {/* Text side */}
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} className="lg:pl-8">
              <motion.h2 custom={0} variants={reveal} className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl mb-6">
                Built by engineers,<br />
                <span className="text-indigo-600">for engineers.</span>
              </motion.h2>

              <motion.div custom={1} variants={reveal} className="space-y-6 text-lg text-slate-600 font-medium">
                <p>
                  CodevolveX was born from a relentless drive to build something fundamentally different.
                  Developed entirely by Karan Sahu, the platform's architecture was inspired by an
                  obvious disconnect in traditional computer science education.
                </p>
                <p>
                  Standard platforms teach generic concepts, but modern engineering roles demand deep
                  system execution. Developers get caught in tutorial purgatory—learning theory without
                  mastering production tools like WebSockets, optimised database schemas, or strict
                  algorithmic workflows.
                </p>
              </motion.div>

              <motion.div custom={2} variants={reveal} className="mt-10 border-l-4 border-indigo-600 bg-white p-6 rounded-r-2xl shadow-sm">
                <p className="text-lg italic font-bold text-slate-800">
                  "I envisioned a pipeline that challenges learners to transition from simply writing
                  code to architecting highly scalable applications."
                </p>
                <p className="mt-4 text-sm font-extrabold text-indigo-600 uppercase tracking-widest">— Karan Sahu, Founder</p>
              </motion.div>
            </motion.div>

          </div>
        </div>
      </section>

      <section className="bg-slate-950 py-24 sm:py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900/20 via-slate-950 to-slate-950"></div>
        <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8">
          
          <div className="mb-16 md:flex md:items-end md:justify-between">
            <div className="max-w-2xl">
              <h2 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl mb-4">
                The CodevolveX <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">Advantage</span>
              </h2>
              <p className="text-lg text-slate-400">Everything you need to land the job, engineered directly into your learning environment.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuresData.map((f, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: i * 0.1 }} viewport={{ once: true }}
                className={`relative group rounded-3xl border border-slate-800 bg-slate-900/50 p-8 backdrop-blur-sm transition-all hover:border-indigo-500/50 hover:bg-slate-800/80 ${f.wide ? 'lg:col-span-2' : ''}`}
              >
                <div className="mb-6 flex items-center justify-between">
                  <span className="rounded-full bg-indigo-500/10 px-4 py-1.5 text-xs font-black uppercase tracking-widest text-indigo-400">
                    Step {f.index}
                  </span>
                </div>
                <h3 className="text-2xl font-bold text-white mb-3">{f.title}</h3>
                <p className="text-slate-400 leading-relaxed font-medium">{f.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      
      <section className="bg-slate-100 py-24 lg:py-32 relative overflow-hidden">
        {/* Soft background glows to break up the flat gray */}
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-blue-500/10 blur-[120px] rounded-full pointer-events-none"></div>
        <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-indigo-500/10 blur-[120px] rounded-full pointer-events-none"></div>

        <div className="relative z-10 mx-auto max-w-4xl px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-extrabold text-slate-900 sm:text-5xl mb-4">
              Let's build together.
            </h2>
            <p className="text-lg text-slate-500 font-medium max-w-2xl mx-auto">
              Have an idea, want to partner, or need support? Drop a message below and our team will get back to you immediately.
            </p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} viewport={{ once: true }}
            className="rounded-[2rem] bg-white p-2 sm:p-4 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-200/60"
          >
            <ContactUsForm />
          </motion.div>
        </div>
      </section>

    </div>
  )
}

export default About