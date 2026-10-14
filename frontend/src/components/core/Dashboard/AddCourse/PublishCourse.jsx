import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import { editCourseDetails } from "../../../../services/operations/courseApi";
import { resetCourseState, setStep } from "../../../../slices/course.slice";
import { COURSE_STATUS } from "../../../../utils/constants";

const display = "font-['Space_Grotesk',ui-sans-serif,system-ui,sans-serif]";
const mono = "font-['JetBrains_Mono',ui-monospace,monospace]";

const GRAIN = `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.8' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>")`;

export default function PublishCourse() {
  const { register, handleSubmit, setValue, getValues, watch } = useForm();

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { token } = useSelector((state) => state.auth);
  const { course } = useSelector((state) => state.course);
  const [loading, setLoading] = useState(false);

  const isPublic = !!watch("public");

  useEffect(() => {
    if (course?.status === COURSE_STATUS.PUBLISHED) {
      setValue("public", true);
    }
  }, [course, setValue]);

  const goBack = () => {
    dispatch(setStep(2));
  };

  const goToCourses = () => {
    dispatch(resetCourseState());
    navigate("/dashboard/my-courses");
  };

  const handleCoursePublish = async () => {
    // check if form has been updated or not
    if (
      (course?.status === COURSE_STATUS.PUBLISHED && getValues("public") === true) ||
      (course?.status === COURSE_STATUS.DRAFT && getValues("public") === false)
    ) {
      // form has not been updated, no need to make api call
      goToCourses();
      return;
    }

    const formData = new FormData();
    formData.append("courseId", course._id);

    const courseStatus = getValues("public")
      ? COURSE_STATUS.PUBLISHED
      : COURSE_STATUS.DRAFT;
    formData.append("status", courseStatus);

    setLoading(true);
    const result = await editCourseDetails(formData, token);
    if (result) {
      goToCourses();
    }
    setLoading(false);
  };

  const onSubmit = () => {
    handleCoursePublish();
  };

  return (
    <div className="relative w-full overflow-hidden rounded-3xl border border-white/[0.08] bg-[#14130f] p-6 sm:p-8">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.06] mix-blend-overlay"
        style={{ backgroundImage: GRAIN }}
      />
      <div
        aria-hidden
        className={`pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full blur-3xl transition-colors duration-1000 ${
          isPublic ? "bg-[#ffb454]/[0.12]" : "bg-[#ffb454]/[0.04]"
        }`}
      />

      <div className="relative">
        {/* header */}
        <div className="flex items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <span className="h-px w-8 bg-[#ffb454]" />
              <p className={`text-[11px] uppercase tracking-[0.25em] text-zinc-500 ${mono}`}>
                Step 03
              </p>
            </div>
            <h2
              className={`mt-4 text-2xl font-semibold tracking-tight text-[#f3ece0] sm:text-3xl ${display}`}
            >
              Publish settings<span className="text-[#ffb454]">.</span>
            </h2>
          </div>

          <span
            className={`flex items-center gap-2 rounded-full border px-3 py-1.5 text-[10px] uppercase tracking-[0.2em] transition-colors duration-700 ${mono} ${
              isPublic
                ? "border-[#ffb454]/50 text-[#ffb454]"
                : "border-white/10 text-zinc-500"
            }`}
          >
            <span
              className={`h-1.5 w-1.5 rounded-full ${
                isPublic ? "animate-pulse bg-[#ffb454]" : "bg-zinc-600"
              }`}
            />
            {isPublic ? "Live" : "Draft"}
          </span>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          {/* visibility toggle */}
          <label
            htmlFor="public"
            className={`group relative mb-8 mt-8 flex cursor-pointer select-none items-center justify-between gap-6 rounded-2xl border p-5 transition-all duration-700 sm:p-6 ${
              isPublic
                ? "border-[#ffb454]/40 bg-[#ffb454]/[0.04]"
                : "border-white/[0.08] bg-white/[0.02] hover:border-[#ffb454]/30"
            }`}
          >
            <div className="min-w-0">
              <p className={`text-lg font-semibold tracking-tight text-[#f3ece0] ${display}`}>
                Make this course public
              </p>
              <p className="mt-1.5 max-w-md text-sm leading-relaxed text-zinc-500">
                Once published, this course route will be instantly accessible
                across the catalog dashboard.
              </p>
            </div>

            <input
              type="checkbox"
              id="public"
              {...register("public")}
              className="peer sr-only"
            />
            <span
              aria-hidden
              className="relative h-8 w-14 shrink-0 rounded-full border border-white/15 bg-white/[0.04] transition-all duration-500 peer-checked:border-[#ffb454] peer-checked:bg-[#ffb454] peer-focus-visible:ring-2 peer-focus-visible:ring-[#ffb454]/60 peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-[#14130f] after:absolute after:left-1 after:top-1 after:h-[22px] after:w-[22px] after:rounded-full after:bg-zinc-500 after:transition-all after:duration-500 after:content-[''] peer-checked:after:translate-x-6 peer-checked:after:bg-[#1d1a16]"
            />
          </label>

          {/* actions */}
          <div className="flex items-center justify-end gap-3 border-t border-white/[0.07] pt-6">
            <button
              disabled={loading}
              type="button"
              onClick={goBack}
              className="inline-flex cursor-pointer items-center justify-center rounded-full border border-white/15 px-6 py-3 text-sm text-zinc-300 transition-all duration-500 hover:border-[#ffb454]/60 hover:text-[#ffb454] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
            >
              Back
            </button>

            <button
              type="submit"
              disabled={loading}
              className="inline-flex cursor-pointer items-center justify-center rounded-full bg-[#ffb454] px-8 py-3 text-sm font-semibold text-[#1d1a16] transition-all duration-500 hover:bg-[#ffc272] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? "Saving changes..." : "Save changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}