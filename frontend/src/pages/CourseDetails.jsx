import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, useScroll, useSpring } from "framer-motion";
import { useSelector } from "react-redux";
import { ArrowLeft, BookOpen } from "lucide-react";
import { fetchCourseDetails } from "../services/operations/courseApi";

import CourseDetailsCard from "../components/core/CourseDetails/CourseDetailsCard";
import CourseWhatYouLearn from "../components/core/CourseDetails/CourseWhatYouLearn";
import CourseRequirements from "../components/core/CourseDetails/CourseRequirement";
import CourseHero from "../components/core/CourseDetails/CourseHero";
import CourseInstructor from "../components/core/CourseDetails/CourseInstructor";
import CourseAccordion from "../components/core/CourseDetails/CourseAccordion";
import CourseFAQ from "../components/core/CourseDetails/CourseFaq";
import CourseReviews from "../components/common/CourseReview";

const EASE = [0.23, 1, 0.32, 1];

const display = "font-['Space_Grotesk',ui-sans-serif,system-ui,sans-serif]";
const mono = "font-['JetBrains_Mono',ui-monospace,monospace]";

const GRAIN = `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.8' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>")`;

const Grain = () => (
  <div
    aria-hidden
    className="pointer-events-none absolute inset-0 opacity-[0.06] mix-blend-overlay"
    style={{ backgroundImage: GRAIN }}
  />
);

function SkeletonDetail() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[#100f0d] pb-32 pt-32 lg:pt-36">
      <Grain />
      <div className="relative mx-auto max-w-7xl animate-pulse px-5 sm:px-8">
        <div className="mb-10 h-4 w-36 rounded-full bg-white/[0.06]" />
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-3 lg:gap-14">
          <div className="space-y-6 lg:col-span-2">
            <div className="h-12 w-3/4 rounded-full bg-white/[0.06]" />
            <div className="h-12 w-1/2 rounded-full bg-white/[0.06]" />
            <div className="mt-4 h-4 w-full rounded-full bg-white/[0.04]" />
            <div className="h-4 w-5/6 rounded-full bg-white/[0.04]" />
            <div className="h-4 w-4/6 rounded-full bg-white/[0.04]" />
          </div>
          <div className="lg:col-span-1">
            <div className="overflow-hidden rounded-3xl border border-white/[0.06] bg-white/[0.03]">
              <div className="aspect-video w-full bg-white/[0.04]" />
              <div className="space-y-4 p-6">
                <div className="h-10 w-1/3 rounded-full bg-white/[0.06]" />
                <div className="h-14 w-full rounded-full bg-white/[0.06]" />
                <div className="h-14 w-full rounded-full bg-white/[0.06]" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// each section fades up as it scrolls into view
const Reveal = ({ children }) => (
  <motion.div
    initial={{ opacity: 0, y: 26 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-60px" }}
    transition={{ duration: 0.95, ease: EASE }}
  >
    {children}
  </motion.div>
);

export default function CourseDetails() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.profile);

  const [courseData, setCourseData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 28, mass: 0.3 });

  useEffect(() => {
    async function load() {
      setLoading(true);
      setError(false);
      try {
        const result = await fetchCourseDetails(courseId);
        if (result?.success) {
          setCourseData(result.data);
        } else {
          setError(true);
        }
      } catch {
        setError(true);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [courseId]);

  if (loading) return <SkeletonDetail />;

  if (error || !courseData) {
    return (
      <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#100f0d] px-5 pb-32 pt-32">
        <Grain />
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: EASE }}
          className="relative flex max-w-md flex-col items-center rounded-3xl border border-[#e0816f]/20 bg-[#e0816f]/[0.04] px-10 py-20 text-center"
        >
          <span className="flex h-16 w-16 items-center justify-center rounded-full border border-[#e0816f]/30">
            <BookOpen size={26} className="text-[#e0816f]" />
          </span>
          <h3 className={`mt-6 text-2xl font-semibold text-[#f3ece0] ${display}`}>
            Course not found
          </h3>
          <p className="mt-2 text-zinc-500">
            We couldn't load this course. Please try again.
          </p>
          <button
            onClick={() => navigate("/catalogue")}
            className="mt-8 rounded-full bg-[#ffb454] px-8 py-3.5 text-sm font-semibold text-[#1d1a16] transition-all duration-500 hover:bg-[#ffc272] active:scale-[0.98]"
          >
            Back to Catalogue
          </button>
        </motion.div>
      </div>
    );
  }

  const { courseDetails, totalDuration } = courseData;

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#100f0d] pb-32 pt-32 lg:pt-36">
      <Grain />

      {/* reading progress */}
      <motion.div
        aria-hidden
        style={{ scaleX: progress }}
        className="fixed left-0 top-0 z-[60] h-[2px] w-full origin-left bg-[#ffb454]"
      />

      <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
        <motion.button
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, ease: EASE }}
          onClick={() => navigate("/catalogue")}
          className="group mb-10 flex cursor-pointer items-center gap-3 text-sm text-zinc-500 transition-colors duration-500 hover:text-[#ffb454]"
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-full border border-white/15 transition-all duration-500 group-hover:-translate-x-1 group-hover:border-[#ffb454]/60">
            <ArrowLeft size={14} />
          </span>
          <span className={`text-[11px] uppercase tracking-[0.25em] ${mono}`}>
            Back to catalogue
          </span>
        </motion.button>

        <div className="grid grid-cols-1 gap-10 lg:grid-cols-3 lg:gap-14">
          <div className="space-y-10 lg:col-span-2">
            <Reveal>
              <CourseHero course={courseDetails} totalDuration={totalDuration} />
            </Reveal>
            <Reveal>
              <CourseWhatYouLearn course={courseDetails} />
            </Reveal>
            <Reveal>
              <CourseAccordion course={courseDetails} />
            </Reveal>
            <Reveal>
              <CourseInstructor course={courseDetails} />
            </Reveal>
            <Reveal>
              <CourseRequirements course={courseDetails} />
            </Reveal>
            <Reveal>
              <CourseReviews courseId={courseDetails._id} />
            </Reveal>
            <Reveal>
              <CourseFAQ />
            </Reveal>
          </div>

          <motion.div
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.95, delay: 0.15, ease: EASE }}
            className="lg:col-span-1"
          >
            <div className="lg:sticky lg:top-28">
              <CourseDetailsCard
                course={courseDetails}
                totalDuration={totalDuration}
                user={user}
              />
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}