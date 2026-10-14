import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import { BookOpen } from "lucide-react";

import { getFullDetailsOfCourse } from "../services/operations/courseApi";
import {
  setCourseSectionData,
  setEntireCourseData,
  setCompletedLectures,
  setTotalNoOfLectures,
  setActiveLecture,
} from "../slices/viewCourse.slice";

import VideoDetailsSidebar from "../components/common/VideoDetailsSidebar";
import VideoPlayer from "../components/common/VideoPlayer";

const EASE = [0.23, 1, 0.32, 1];

const display = "font-['Space_Grotesk',ui-sans-serif,system-ui,sans-serif]";

const GRAIN = `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.8' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>")`;
 

const Shell = ({ children }) => (
  <div className="relative flex h-[100dvh] flex-col overflow-hidden bg-[#100f0d] pt-24">
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 z-0 opacity-[0.06] mix-blend-overlay"
      style={{ backgroundImage: GRAIN }}
    />
    <div className="relative z-10 flex min-h-0 w-full flex-1">{children}</div>
  </div>
);
 

function LoadingState() {
  return (
    <Shell>
      {/* a thin amber line sweeps across the top while the course loads */}
      <div className="absolute inset-x-0 top-0 z-20 h-px overflow-hidden bg-white/[0.06]">
        <motion.div
          className="h-full w-1/3 bg-[#ffb454]"
          initial={{ x: "-100%" }}
          animate={{ x: "300%" }}
          transition={{ duration: 1.6, ease: "easeInOut", repeat: Infinity }}
        />
      </div>

      <aside className="hidden w-80 shrink-0 animate-pulse border-r border-white/[0.07] p-6 lg:block">
        <div className="h-5 w-2/3 rounded-full bg-white/[0.06]" />
        <div className="mt-3 h-3 w-1/3 rounded-full bg-white/[0.04]" />
        <div className="mt-8 space-y-3">
          {[0, 1, 2, 3, 4].map((i) => (
            <div key={i} className="h-12 rounded-2xl bg-white/[0.04]" />
          ))}
        </div>
      </aside>

      <main className="flex-1 animate-pulse overflow-hidden p-5 sm:p-8">
        <div className="mx-auto max-w-5xl">
          <div className="aspect-video w-full rounded-3xl bg-white/[0.04]" />
          <div className="mt-8 h-7 w-1/2 rounded-full bg-white/[0.06]" />
          <div className="mt-4 h-4 w-3/4 rounded-full bg-white/[0.04]" />
        </div>
      </main>
    </Shell>
  );
}
 

function ErrorState({ onRetry }) {
  return (
    <Shell>
      <div className="flex w-full items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: EASE }}
          className="flex w-full max-w-lg flex-col items-center rounded-3xl border border-[#e0816f]/20 bg-[#e0816f]/[0.04] px-8 py-20 text-center"
        >
          <span className="flex h-16 w-16 items-center justify-center rounded-full border border-[#e0816f]/30">
            <BookOpen size={26} className="text-[#e0816f]" />
          </span>
          <h3 className={`mt-6 text-2xl font-semibold text-[#f3ece0] ${display}`}>
            This course didn&apos;t load
          </h3>
          <p className="mt-2 text-zinc-500">
            Check your connection and try again. If you just enrolled, give it a moment first.
          </p>
          <button
            onClick={onRetry}
            className="mt-8 rounded-full bg-[#ffb454] px-7 py-3 text-sm font-semibold text-[#1d1a16] transition-all duration-500 hover:bg-[#ffc272] active:scale-[0.98]"
          >
            Try again
          </button>
        </motion.div>
      </div>
    </Shell>
  );
}

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

export default function ViewCourse() {
  const { courseId, sectionId, subSectionId } = useParams();
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.auth);

  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);
  const [attempt, setAttempt] = useState(0);
  const [firstLecture, setFirstLecture] = useState(null);

  // 1. Fetch the course. Runs only when the course (or the user) changes,
  //    so switching lectures no longer re-downloads everything.
  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setFailed(false);

      const result = await getFullDetailsOfCourse(courseId, token);
      if (cancelled) return;

      if (!result) {
        setFailed(true);
        setLoading(false);
        return;
      }

      const content = result.courseDetails?.courseContent || [];

      dispatch(setCourseSectionData(content));
      dispatch(setEntireCourseData(result.courseDetails));
      dispatch(setCompletedLectures(result.completedVideo || []));

      const lectures = content.reduce((sum, s) => sum + (s.SubSection?.length ?? 0), 0);
      dispatch(setTotalNoOfLectures(lectures));

      const firstSection = content[0];
      const firstSub = firstSection?.SubSection?.[0];
      setFirstLecture(
        firstSection && firstSub
          ? { sectionId: firstSection._id, subSectionId: firstSub._id }
          : null
      );

      setLoading(false);
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [courseId, token, dispatch, attempt]);

  useEffect(() => {
    if (loading || failed) return;

    if (sectionId && subSectionId) {
      dispatch(setActiveLecture({ sectionId, subSectionId }));
    } else if (firstLecture) {
      dispatch(setActiveLecture(firstLecture));
    }
  }, [loading, failed, sectionId, subSectionId, firstLecture, dispatch]);

  if (loading) return <LoadingState />;
  if (failed) return <ErrorState onRetry={() => setAttempt((n) => n + 1)} />;

  return (
    <Shell>
      <VideoDetailsSidebar />
      <VideoPlayer />
    </Shell>
  );
}