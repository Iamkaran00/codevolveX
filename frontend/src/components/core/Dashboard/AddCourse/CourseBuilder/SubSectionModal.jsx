import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { motion } from "framer-motion";
import { RxCross2 } from "react-icons/rx";
import { useDispatch, useSelector } from "react-redux";

import { createSubSection, updateSubSection } from "../../../../../services/operations/courseApi";
import { setCourse } from "../../../../../slices/course.slice";
import Upload from "../Upload";

const EASE = [0.23, 1, 0.32, 1];

const display = "font-['Space_Grotesk',ui-sans-serif,system-ui,sans-serif]";
const mono = "font-['JetBrains_Mono',ui-monospace,monospace]";

const GRAIN = `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.8' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>")`;

export default function SubSectionModal({
  modalData,
  setModalData,
  add = false,
  view = false,
  edit = false,
}) {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    getValues,
  } = useForm();

  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const { token } = useSelector((state) => state.auth);
  const { course } = useSelector((state) => state.course);

  useEffect(() => {
    if (view || edit) {
      setValue("lectureTitle", modalData.title);
      setValue("lectureDesc", modalData.description);
      setValue("lectureVideo", modalData.videoUrl);
    }
  }, [view, edit, modalData, setValue]);

  // Escape closes the modal (unless a request is running)
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape" && !loading) setModalData(null);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [loading, setModalData]);

  const isFormUpdated = () => {
    const currentValues = getValues();
    if (
      currentValues.lectureTitle !== modalData.title ||
      currentValues.lectureDesc !== modalData.description ||
      currentValues.lectureVideo !== modalData.videoUrl
    ) {
      return true;
    }
    return false;
  };

  const handleEditSubsection = async () => {
    const currentValues = getValues();
    const formData = new FormData();

    formData.append("sectionId", modalData.sectionId);
    formData.append("subSectionId", modalData._id);

    if (currentValues.lectureTitle !== modalData.title) {
      formData.append("title", currentValues.lectureTitle);
    }
    if (currentValues.lectureDesc !== modalData.description) {
      formData.append("description", currentValues.lectureDesc);
    }
    if (currentValues.lectureVideo !== modalData.videoUrl) {
      formData.append("videoFile", currentValues.lectureVideo);
    }

    setLoading(true);
    const result = await updateSubSection(formData, token);
    if (result) {
      const updatedCourseContent = course.courseContent.map((section) =>
        section._id === modalData.sectionId ? result : section
      );
      const updatedCourse = { ...course, courseContent: updatedCourseContent };
      dispatch(setCourse(updatedCourse));
      toast.success("Lecture updated successfully");
    }
    setModalData(null);
    setLoading(false);
  };

  const onSubmit = async (data) => {
    if (view) return;

    if (edit) {
      if (!isFormUpdated()) {
        toast.error("No changes made to the form");
      } else {
        handleEditSubsection();
      }
      return;
    }

    const formData = new FormData();
    formData.append("sectionId", modalData);
    formData.append("title", data.lectureTitle);
    formData.append("description", data.lectureDesc);
    formData.append("videoFile", data.lectureVideo);

    setLoading(true);
    const result = await createSubSection(formData, token);
    if (result) {
      const updatedCourseContent = course.courseContent.map((section) =>
        section._id === modalData ? result : section
      );
      const updatedCourse = { ...course, courseContent: updatedCourseContent };
      dispatch(setCourse(updatedCourse));
      toast.success("Lecture added successfully");
    }
    setModalData(null);
    setLoading(false);
  };

  const inputStyle = (hasError) =>
    `w-full rounded-2xl border bg-white/[0.02] px-5 py-3.5 text-sm text-[#f3ece0] outline-none transition-all duration-500 placeholder:text-zinc-600 focus:border-[#ffb454]/60 focus:bg-[#ffb454]/[0.04] disabled:cursor-not-allowed disabled:opacity-60 ${
      hasError ? "border-[#e0816f]/60" : "border-white/15"
    }`;

  const labelStyle = `mb-2.5 block text-[11px] uppercase tracking-[0.2em] text-zinc-500 ${mono}`;

  const mode = view ? "Viewing" : add ? "Adding new" : "Editing";

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="fixed inset-0 z-[1000] flex items-center justify-center bg-[#100f0d]/70 p-4 backdrop-blur-md sm:p-6"
    >
      <motion.div
        role="dialog"
        aria-modal="true"
        initial={{ opacity: 0, y: 24, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: EASE }}
        className="relative flex max-h-[95vh] w-full max-w-[700px] flex-col overflow-hidden rounded-3xl border border-white/[0.09] bg-[#14130f] shadow-[0_30px_80px_-20px_rgba(0,0,0,0.9)]"
      >
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.06] mix-blend-overlay"
          style={{ backgroundImage: GRAIN }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-[#ffb454]/[0.07] blur-3xl"
        />

        {/* header */}
        <div className="relative flex shrink-0 items-center justify-between border-b border-white/[0.07] px-7 py-5 sm:px-8">
          <div>
            <div className="flex items-center gap-3">
              <span className="h-px w-8 bg-[#ffb454]" />
              <p className={`text-[11px] uppercase tracking-[0.25em] text-zinc-500 ${mono}`}>
                {mode}
              </p>
            </div>
            <p
              className={`mt-2 text-2xl font-semibold tracking-tight text-[#f3ece0] ${display}`}
            >
              Lecture<span className="text-[#ffb454]">.</span>
            </p>
          </div>
          <button
            onClick={() => (!loading ? setModalData(null) : {})}
            aria-label="Close"
            className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-white/15 text-zinc-400 transition-all duration-500 hover:border-[#ffb454]/60 hover:text-[#ffb454] active:scale-95"
          >
            <RxCross2 className="text-lg" />
          </button>
        </div>

        {/* form */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="relative flex-1 space-y-7 overflow-y-auto p-7 sm:p-8"
        >
          <div className="rounded-2xl border border-white/[0.07] bg-white/[0.02] p-2 sm:p-5">
            <Upload
              name="lectureVideo"
              label="Lecture Video File"
              register={register}
              setValue={setValue}
              errors={errors}
              video={true}
              viewData={view ? modalData.videoUrl : null}
              editData={edit ? modalData.videoUrl : null}
            />
          </div>

          <div className="flex flex-col">
            <label className={labelStyle} htmlFor="lectureTitle">
              Lecture title {!view && <span className="text-[#ffb454]">*</span>}
            </label>
            <input
              disabled={view || loading}
              id="lectureTitle"
              placeholder="e.g., Introduction to Component State"
              {...register("lectureTitle", { required: true })}
              className={inputStyle(!!errors.lectureTitle)}
            />
            {errors.lectureTitle && (
              <span className={`mt-2 text-[11px] tracking-wide text-[#e0816f] ${mono}`}>
                Lecture title is required
              </span>
            )}
          </div>

          <div className="flex flex-col">
            <label className={labelStyle} htmlFor="lectureDesc">
              Lecture description {!view && <span className="text-[#ffb454]">*</span>}
            </label>
            <textarea
              disabled={view || loading}
              id="lectureDesc"
              placeholder="Provide a brief overview of what this video covers..."
              {...register("lectureDesc", { required: true })}
              className={`${inputStyle(!!errors.lectureDesc)} min-h-[140px] resize-none leading-relaxed`}
            />
            {errors.lectureDesc && (
              <span className={`mt-2 text-[11px] tracking-wide text-[#e0816f] ${mono}`}>
                Lecture Description is required
              </span>
            )}
          </div>

          {!view && (
            <div className="flex items-center justify-end border-t border-white/[0.07] pt-6">
              <button
                type="submit"
                disabled={loading}
                className="inline-flex cursor-pointer items-center justify-center rounded-full bg-[#ffb454] px-8 py-3.5 text-sm font-semibold text-[#1d1a16] transition-all duration-500 hover:bg-[#ffc272] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading ? "Processing..." : edit ? "Save changes" : "Create lecture"}
              </button>
            </div>
          )}
        </form>
      </motion.div>
    </motion.div>
  );
}