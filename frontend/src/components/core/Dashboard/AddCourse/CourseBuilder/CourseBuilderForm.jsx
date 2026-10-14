import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { IoAddCircleOutline } from "react-icons/io5";
import { MdNavigateNext, MdOutlineArrowBackIos } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";

import { createSection, updateSection } from "../../../../../services/operations/courseApi";
import { setCourse, setEditCourse, setStep } from "../../../../../slices/course.slice";
import NestedView from "./NestedView";

const display = "font-['Space_Grotesk',ui-sans-serif,system-ui,sans-serif]";
const mono = "font-['JetBrains_Mono',ui-monospace,monospace]";

const GRAIN = `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.8' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>")`;

export default function CourseBuilderForm() {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();

  const { course } = useSelector((state) => state.course);
  const { token } = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(false);
  const [editSectionName, setEditSectionName] = useState(null);
  const dispatch = useDispatch();

  const onSubmit = async (data) => {
    setLoading(true);
    let result;

    if (editSectionName) {
      result = await updateSection(
        {
          sectionName: data.sectionName,
          sectionId: editSectionName,
          courseId: course._id,
        },
        token
      );
    } else {
      result = await createSection(
        {
          sectionName: data.sectionName,
          courseId: course._id,
        },
        token
      );
    }

    if (result) {
      dispatch(setCourse(result));
      setEditSectionName(null);
      setValue("sectionName", "");
    }
    setLoading(false);
  };

  const cancelEdit = () => {
    setEditSectionName(null);
    setValue("sectionName", "");
  };

  const handleChangeEditSectionName = (sectionId, sectionName) => {
    if (editSectionName === sectionId) {
      cancelEdit();
      return;
    }
    setEditSectionName(sectionId);
    setValue("sectionName", sectionName);
  };

  const goToNext = () => {
    if (course.courseContent.length === 0) {
      toast.error("Please add at least one section");
      return;
    }
    if (course.courseContent.some((section) => section.SubSection.length === 0)) {
      toast.error("Please add at least one lecture in each section");
      return;
    }
    dispatch(setStep(3));
  };

  const goBack = () => {
    dispatch(setStep(1));
    dispatch(setEditCourse(true));
  };

  const sectionCount = course.courseContent.length;

  return (
    <div className="relative w-full overflow-hidden rounded-3xl border border-white/[0.08] bg-[#14130f] p-6 sm:p-8">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.06] mix-blend-overlay"
        style={{ backgroundImage: GRAIN }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-[#ffb454]/[0.06] blur-3xl"
      />

      <div className="relative">
        {/* header */}
        <div className="flex items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <span className="h-px w-8 bg-[#ffb454]" />
              <p className={`text-[11px] uppercase tracking-[0.25em] text-zinc-500 ${mono}`}>
                Step 02
              </p>
            </div>
            <h2
              className={`mt-4 text-2xl font-semibold tracking-tight text-[#f3ece0] sm:text-3xl ${display}`}
            >
              Course builder<span className="text-[#ffb454]">.</span>
            </h2>
          </div>
          <p className={`text-[11px] uppercase tracking-[0.2em] text-zinc-600 ${mono}`}>
            {sectionCount} {sectionCount === 1 ? "section" : "sections"}
          </p>
        </div>

        {/* form */}
        <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-5">
          <div className="flex flex-col gap-2.5">
            <label
              htmlFor="sectionName"
              className={`text-[11px] uppercase tracking-[0.2em] text-zinc-500 ${mono}`}
            >
              Section name <span className="text-[#ffb454]">*</span>
            </label>
            <input
              id="sectionName"
              disabled={loading}
              placeholder="Add a section to build your course structure"
              {...register("sectionName", { required: true })}
              className={`w-full rounded-2xl border bg-white/[0.02] px-5 py-3.5 text-sm text-[#f3ece0] outline-none transition-all duration-500 placeholder:text-zinc-600 focus:border-[#ffb454]/60 focus:bg-[#ffb454]/[0.04] disabled:cursor-not-allowed disabled:opacity-50 ${
                errors.sectionName ? "border-[#e0816f]/60" : "border-white/15"
              }`}
            />
            {errors.sectionName && (
              <span className={`text-[11px] tracking-wide text-[#e0816f] ${mono}`}>
                Section name is required to initialize a timeline segment.
              </span>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <button
              type="submit"
              disabled={loading}
              className="group inline-flex cursor-pointer items-center justify-center gap-2 rounded-full border border-[#ffb454]/50 px-6 py-3 text-sm font-medium text-[#ffb454] transition-all duration-500 hover:bg-[#ffb454] hover:text-[#1d1a16] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
            >
              <IoAddCircleOutline size={18} />
              <span>
                {loading
                  ? "Saving..."
                  : editSectionName
                  ? "Edit section name"
                  : "Create section"}
              </span>
            </button>

            {editSectionName && (
              <button
                type="button"
                onClick={cancelEdit}
                className="cursor-pointer text-sm text-zinc-500 underline underline-offset-4 transition-colors duration-500 hover:text-[#ffb454]"
              >
                Cancel edit
              </button>
            )}
          </div>
        </form>

        {/* sections */}
        {sectionCount > 0 && (
          <div className="mt-9 border-t border-white/[0.07] pt-7">
            <NestedView handleChangeEditSectionName={handleChangeEditSectionName} />
          </div>
        )}

        {/* footer */}
        <div className="mt-9 flex items-center justify-end gap-3 border-t border-white/[0.07] pt-6">
          <button
            type="button"
            onClick={goBack}
            className="group inline-flex cursor-pointer items-center justify-center gap-1.5 rounded-full border border-white/15 px-6 py-3 text-sm text-zinc-300 transition-all duration-500 hover:border-[#ffb454]/60 hover:text-[#ffb454] active:scale-[0.98]"
          >
            <MdOutlineArrowBackIos className="text-[10px] transition-transform duration-500 group-hover:-translate-x-0.5" />
            <span>Back</span>
          </button>

          <button
            type="button"
            onClick={goToNext}
            disabled={loading}
            className="group inline-flex cursor-pointer items-center justify-center gap-1.5 rounded-full bg-[#ffb454] px-7 py-3 text-sm font-semibold text-[#1d1a16] transition-all duration-500 hover:bg-[#ffc272] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
          >
            <span>Next</span>
            <MdNavigateNext className="text-lg transition-transform duration-500 group-hover:translate-x-0.5" />
          </button>
        </div>
      </div>
    </div>
  );
}