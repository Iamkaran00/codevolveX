import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { IoAddCircleOutline } from "react-icons/io5";
import { MdNavigateNext, MdOutlineArrowBackIos } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";

import { createSection, updateSection } from "../../../../../services/operations/courseApi";
import { setCourse, setEditCourse, setStep } from "../../../../../slices/course.slice";
import NestedView from "./NestedView";

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

  return (
    <div className="w-full rounded-2xl border border-slate-200 bg-white p-6 shadow-md">
      <h2 className="text-xl font-bold text-slate-900 tracking-tight mb-6">
        Course Builder
      </h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div className="flex flex-col gap-2">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-400" htmlFor="sectionName">
            Section Name <sup className="text-red-500">*</sup>
          </label>
          <input
            id="sectionName"
            disabled={loading}
            placeholder="Add a section to build your course structure"
            {...register("sectionName", { required: true })}
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-800 placeholder:text-slate-300 outline-none transition-all focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50/60 disabled:bg-slate-50 disabled:cursor-not-allowed"
          />
          {errors.sectionName && (
            <span className="text-xs font-semibold tracking-wide text-red-500 mt-0.5">
              Section name is required to initialize a timeline segment.
            </span>
          )}
        </div>

        <div className="flex items-center gap-x-4">
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-indigo-200 bg-indigo-50/40 px-5 py-2.5 text-xs font-bold text-indigo-600 transition-all hover:bg-indigo-600 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]"
          >
            <IoAddCircleOutline size={16} />
            <span>{editSectionName ? "Edit Section Name" : "Create Section"}</span>
          </button>

          {editSectionName && (
            <button
              type="button"
              onClick={cancelEdit}
              className="text-xs font-bold text-slate-400 hover:text-slate-600 underline underline-offset-4"
            >
              Cancel Edit
            </button>
          )}
        </div>
      </form>

      {course.courseContent.length > 0 && (
        <div className="mt-8 border-t border-slate-100 pt-6">
          <NestedView handleChangeEditSectionName={handleChangeEditSectionName} />
        </div>
      )}

      <div className="mt-8 flex justify-end items-center gap-x-3 border-t border-slate-100 pt-5">
        <button
          type="button"
          onClick={goBack}
          className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-xs font-bold text-slate-600 transition-all hover:bg-slate-50 hover:text-slate-900 active:scale-[0.98]"
        >
          <MdOutlineArrowBackIos className="text-[10px]" />
          <span>Back</span>
        </button>

        <button
          type="button"
          onClick={goToNext}
          disabled={loading}
          className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-indigo-600 px-5 py-2.5 text-xs font-bold text-white shadow-sm shadow-indigo-100 transition-all hover:bg-indigo-700 active:scale-[0.98]"
        >
          <span>Next</span>
          <MdNavigateNext className="text-base" />
        </button>
      </div>
    </div>
  );
}