import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { TbDatabaseOff } from "react-icons/tb";
import { ArrowLeft } from "lucide-react";

import { getFullDetailsOfCourse } from "../../../../services/operations/courseApi";
import { setCourse, setEditCourse, setStep } from "../../../../slices/course.slice";
import RenderSteps from "../AddCourse/RenderSteps";

const EASE = [0.23, 1, 0.32, 1];

const display = "font-['Space_Grotesk',ui-sans-serif,system-ui,sans-serif]";
const mono = "font-['JetBrains_Mono',ui-monospace,monospace]";

const GRAIN = `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.8' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>")`;

 
function LoadingState() {
  return (
    <div className="relative overflow-hidden rounded-3xl border border-white/[0.08] bg-[#14130f] p-8 sm:p-10">
      {/* amber line sweeping while the course loads */}
      <div className="absolute inset-x-0 top-0 h-px overflow-hidden bg-white/[0.06]">
        <motion.div
          className="h-full w-1/3 bg-[#ffb454]"
          initial={{ x: "-100%" }}
          animate={{ x: "300%" }}
          transition={{ duration: 1.6, ease: "easeInOut", repeat: Infinity }}
        />
      </div>

      <p className={`text-sm text-zinc-500 ${mono}`}>Loading your course...</p>

      <div className="mt-8 animate-pulse space-y-4">
        <div className="flex gap-3">
          {[0, 1, 2].map((i) => (
            <div key={i} className="h-10 w-32 rounded-full bg-white/[0.05]" />
          ))}
        </div>
        <div className="h-12 w-full rounded-2xl bg-white/[0.04]" />
        <div className="h-12 w-full rounded-2xl bg-white/[0.04]" />
        <div className="h-32 w-full rounded-2xl bg-white/[0.04]" />
      </div>
    </div>
  );
}

function NotFoundState({ onBack }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: EASE }}
      className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-white/15 bg-white/[0.02] px-8 py-24 text-center"
    >
      <span className="flex h-16 w-16 items-center justify-center rounded-full border border-white/10">
        <TbDatabaseOff className="text-2xl text-zinc-500" />
      </span>
      <h3 className={`mt-6 text-2xl font-semibold text-[#f3ece0] ${display}`}>
        We couldn&apos;t find this course
      </h3>
      <p className="mt-2 max-w-md text-zinc-500">
        It may have been deleted, or the link is wrong. Head back to your courses and open it from there.
      </p>
      <button
        onClick={onBack}
        className="mt-8 rounded-full bg-[#ffb454] px-7 py-3 text-sm font-semibold text-[#1d1a16] transition-all duration-500 hover:bg-[#ffc272] active:scale-[0.98]"
      >
        Back to my courses
      </button>
    </motion.div>
  );
} 

export default function EditCourse() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { courseId } = useParams();
  const { course } = useSelector((state) => state.course);
  const { token } = useSelector((state) => state.auth);

  // Start in the loading state so "not found" never flashes before the fetch begins.
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!courseId || !token) {
      setLoading(false);
      return undefined;
    }

    let cancelled = false;

    const populateCourseDetails = async () => {
      setLoading(true);
      const result = await getFullDetailsOfCourse(courseId, token);
      if (cancelled) return;

      const courseData = result?.courseDetails || result?.data || result;

      if (courseData) {
        dispatch(setEditCourse(true));
        dispatch(setCourse(courseData));
        dispatch(setStep(1));
      }
      setLoading(false);
    };

    populateCourseDetails();

    return () => {
      cancelled = true;
      dispatch(setEditCourse(false));
    };
  }, [courseId, token, dispatch]);

  const goBack = () => navigate("/dashboard/my-courses");

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-[#100f0d] px-5 pb-24 pt-10 sm:px-8 lg:pt-14">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.06] mix-blend-overlay"
        style={{ backgroundImage: GRAIN }}
      />

      <div className="relative mx-auto flex w-full max-w-5xl flex-col gap-10">
        <motion.header
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.95, ease: EASE }}
        >
          <button
            onClick={goBack}
            className="group flex items-center gap-2 text-sm text-zinc-500 outline-none transition-colors duration-500 hover:text-[#ffb454] focus-visible:text-[#ffb454]"
          >
            <ArrowLeft
              size={16}
              className="transition-transform duration-500 group-hover:-translate-x-1"
            />
            My courses
          </button>

          <h1
            className={`mt-8 text-5xl font-semibold leading-[1.02] tracking-tight text-[#f3ece0] sm:text-6xl ${display}`}
          >
            Edit your <span className="text-[#ffb454]">course</span>
            <span className="text-[#ffb454]">.</span>
          </h1>

          <div className="mt-6 flex flex-col gap-3 border-b border-white/[0.07] pb-8 sm:flex-row sm:items-end sm:justify-between">
            <p className="max-w-md text-lg leading-relaxed text-zinc-400">
              Update sections and lectures, or change whether the course is published.
            </p>
            {!loading && course?.courseName && (
              <p className="flex items-center gap-2.5 text-sm text-zinc-500">
                <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#ffb454]" />
                <span className="max-w-[16rem] truncate text-zinc-300">{course.courseName}</span>
              </p>
            )}
          </div>
        </motion.header>

        <div className="w-full">
          {loading ? (
            <LoadingState />
          ) : course ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: EASE }}
              className="w-full"
            >
              <RenderSteps />
            </motion.div>
          ) : (
            <NotFoundState onBack={goBack} />
          )}
        </div>
      </div>
    </div>
  );
}