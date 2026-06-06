import React, { useEffect, useRef, useState } from "react";
import {
  SiOpenai,
  SiNextdotjs,
  SiEthereum,
  SiKalilinux,
  SiDocker,
  SiApachekafka,
  SiPytorch,
  SiGraphql,
  SiTensorflow,
} from "react-icons/si";
import { FaRobot, FaVrCardboard, FaCloudArrowUp } from "react-icons/fa6";
import { HiSparkles } from "react-icons/hi2";

const TRENDING_TOPICS = [
  { Icon: SiOpenai, color: "#10a37f", bg: "bg-emerald-50", ring: "group-hover:ring-emerald-500/30", name: "Generative AI", count: "18 Masterclasses" },
  { Icon: SiNextdotjs, color: "#000000", bg: "bg-gray-100", ring: "group-hover:ring-gray-500/30", name: "Next.js & React 19", count: "24 Courses" },
  { Icon: FaCloudArrowUp, color: "#0ea5e9", bg: "bg-sky-50", ring: "group-hover:ring-sky-500/30", name: "Cloud Native", count: "31 Courses" },
  { Icon: FaRobot, color: "#f97316", bg: "bg-orange-50", ring: "group-hover:ring-orange-500/30", name: "Agentic Systems", count: "9 Courses" },
  { Icon: SiEthereum, color: "#6366f1", bg: "bg-indigo-50", ring: "group-hover:ring-indigo-500/30", name: "Web3 & Blockchain", count: "14 Courses" },
  { Icon: SiKalilinux, color: "#3b82f6", bg: "bg-blue-50", ring: "group-hover:ring-blue-500/30", name: "Cybersecurity", count: "22 Courses" },
  { Icon: SiPytorch, color: "#ee4c2c", bg: "bg-red-50", ring: "group-hover:ring-red-500/30", name: "Deep Learning", count: "17 Courses" },
  { Icon: SiApachekafka, color: "#14b8a6", bg: "bg-teal-50", ring: "group-hover:ring-teal-500/30", name: "Data Engineering", count: "26 Courses" },
  { Icon: FaVrCardboard, color: "#d946ef", bg: "bg-fuchsia-50", ring: "group-hover:ring-fuchsia-500/30", name: "Spatial Computing", count: "8 Courses" },
  { Icon: SiGraphql, color: "#e10098", bg: "bg-pink-50", ring: "group-hover:ring-pink-500/30", name: "Modern APIs", count: "19 Courses" },
];

export default function TrendingCategories() {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);

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

  return (
    <section ref={ref} className="py-24 bg-white sm:py-32 border-t border-gray-100">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-600 text-xs font-bold uppercase tracking-widest mb-4">
            <HiSparkles className="h-4 w-4" />
            Future-Proof Your Career
          </div>
          
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Master the most in-demand tech.
          </h2>
          
          <p className="mt-4 text-lg text-gray-500 font-medium">
            Stay ahead of the curve with cutting-edge curriculum curated by top industry engineers and researchers.
          </p>
        </div>

        {/* Grid Section */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {TRENDING_TOPICS.map(({ Icon, color, bg, ring, name, count }, i) => (
            <div
              key={name}
              className={`transition-all duration-700 ease-out ${
                inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
              }`}
              style={{ transitionDelay: `${i * 75}ms` }}
            >
              <div className="group flex flex-col items-center justify-center bg-white rounded-3xl border border-gray-100 px-4 py-8 text-center transition-all duration-300 ease-out cursor-pointer hover:border-indigo-100 hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:-translate-y-1">
                <div className={`mb-4 flex h-16 w-16 items-center justify-center rounded-2xl ${bg} ring-1 ring-black/5 transition-all duration-300 group-hover:ring-4 ${ring}`}>
                  <Icon 
                    size={32} 
                    color={color} 
                    className="transition-transform duration-300 ease-out group-hover:scale-110 group-hover:-rotate-3 drop-shadow-sm" 
                  />
                </div>
                <h3 className="mb-1.5 text-[15px] font-bold text-gray-900 leading-tight group-hover:text-indigo-600 transition-colors">
                  {name}
                </h3>
                <p className="text-[12px] font-semibold text-gray-400">
                  {count}
                </p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}