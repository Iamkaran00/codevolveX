import React from "react";
import { motion } from "framer-motion";
import {
  SiReact,
  SiNodedotjs,
  SiTensorflow,
  SiKubernetes,
} from "react-icons/si";
import { HiArrowRight } from "react-icons/hi2";

const PATHS = [
  {
    Icon: SiReact,
    color: "#0ea5e9", // Tailwind Sky 500
    bg: "bg-sky-50",
    ring: "group-hover:ring-sky-200",
    title: "Frontend Developer",
    count: "12 courses · 6 months",
  },
  {
    Icon: SiNodedotjs,
    color: "#10b981", // Tailwind Emerald 500
    bg: "bg-emerald-50",
    ring: "group-hover:ring-emerald-200",
    title: "Backend Engineer",
    count: "10 courses · 5 months",
  },
  {
    Icon: SiTensorflow,
    color: "#f97316", // Tailwind Orange 500
    bg: "bg-orange-50",
    ring: "group-hover:ring-orange-200",
    title: "ML & AI Engineer",
    count: "14 courses · 8 months",
  },
  {
    Icon: SiKubernetes,
    color: "#6366f1", // Tailwind Indigo 500
    bg: "bg-indigo-50",
    ring: "group-hover:ring-indigo-200",
    title: "Cloud & DevOps",
    count: "9 courses · 4 months",
  },
];

// Framer Motion Variants
const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.15 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  show: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 80, damping: 15 },
  },
};

export default function LearningPaths() {
  return (
    <section className="py-24 bg-white sm:py-32 font-['Inter',sans-serif]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* ── Header ───────────────────────────────── */}
        <div className="mb-16 md:text-center md:mx-auto md:max-w-2xl">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-sm font-bold tracking-widest text-indigo-600 uppercase">
              Learning Paths
            </h2>
            <p className="mt-3 text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl font-['Plus_Jakarta_Sans',sans-serif]">
              Unlock your coding potential.
            </p>
            <p className="mt-4 text-lg text-gray-500">
              Structured roadmaps by industry experts — pick your path and go
              from first line to first job.
            </p>
          </motion.div>
        </div>

        {/* ── Grid ─────────────────────────────────── */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {PATHS.map(({ Icon, color, bg, ring, title, count }, i) => (
            <motion.div
              key={i}
              variants={cardVariants}
              whileHover={{ y: -8 }}
              className="group relative flex flex-col bg-white rounded-3xl border border-gray-100 p-8 shadow-sm hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] transition-all duration-300 cursor-pointer overflow-hidden"
            >
              {/* Top Right Arrow Indicator */}
              <div className="absolute top-6 right-6 opacity-0 -translate-x-2 -translate-y-2 group-hover:opacity-100 group-hover:translate-x-0 group-hover:translate-y-0 transition-all duration-300 ease-out text-gray-400 group-hover:text-indigo-600">
                <HiArrowRight size={20} />
              </div>

              {/* Icon Container */}
              <div
                className={`mb-6 flex h-14 w-14 items-center justify-center rounded-2xl ${bg} ring-1 ring-black/5 transition-all duration-300 group-hover:ring-4 ${ring}`}
              >
                <Icon size={28} color={color} className="transition-transform duration-300 group-hover:scale-110" />
              </div>

              {/* Text Content */}
              <h3 className="mb-2 text-lg font-bold text-gray-900 font-['Plus_Jakarta_Sans',sans-serif] group-hover:text-indigo-600 transition-colors">
                {title}
              </h3>
              
              <p className="text-sm font-medium text-gray-500 mt-auto">
                {count}
              </p>
              
              {/* Bottom Subtle Gradient Line (Optional purely decorative touch) */}
              <div className="absolute bottom-0 left-0 h-1 w-0 bg-indigo-500 transition-all duration-300 group-hover:w-full opacity-0 group-hover:opacity-100" />
            </motion.div>
          ))}
        </motion.div>

      </div>
    </section>
  );
}