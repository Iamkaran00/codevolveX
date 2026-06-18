import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { RxCross2 } from "react-icons/rx";
import { useDispatch, useSelector } from "react-redux";

import { createSubSection, updateSubSection } from "../../../../../services/operations/courseApi";
import { setCourse } from "../../../../../slices/course.slice";
import Upload from "../Upload";

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

  const inputStyle = 
    "w-full rounded-xl border border-slate-200/70 bg-slate-50 px-4 py-3.5 text-sm font-semibold text-slate-900 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.03)] outline-none transition-all duration-200 placeholder:text-slate-400 focus:border-indigo-500 focus:bg-white focus:ring-[3px] focus:ring-indigo-500/15 disabled:bg-slate-100 disabled:text-slate-400 disabled:cursor-not-allowed";
  
  const labelStyle = "text-[11px] font-extrabold uppercase tracking-widest text-slate-500 mb-2 block";

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-slate-900/30 backdrop-blur-md p-4 sm:p-6 animate-fadeIn font-sans">
      
      {/* Modal Card Base: Added max-h-[95vh] and flex-col for internal scrolling */}
      <div className="w-full max-w-[700px] flex flex-col max-h-[95vh] rounded-3xl border border-slate-200/60 bg-white shadow-[0_8px_30px_rgb(0,0,0,0.08)] animate-scaleUp overflow-hidden">
        
        {/* Modal Header: Shrink-0 keeps it pinned to the top */}
        <div className="flex items-center justify-between border-b border-slate-200/80 bg-slate-50/50 px-8 py-5 shrink-0">
          <p className="text-xl font-black text-slate-900 tracking-tight">
            {view && "Viewing"} {add && "Adding New"} {edit && "Editing"} Lecture
          </p>
          <button 
            onClick={() => (!loading ? setModalData(null) : {})}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:text-slate-900 hover:bg-slate-200/80 transition-all active:scale-95"
          >
            <RxCross2 className="text-xl" />
          </button>
        </div>
        
        {/* Modal Form: overflow-y-auto allows tall content to scroll inside safely */}
        <form onSubmit={handleSubmit(onSubmit)} className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar">
          
          {/* Lecture Video Upload */}
          <div className="rounded-2xl bg-slate-50/50 p-2 sm:p-6 border border-slate-100">
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
          
          {/* Lecture Title Input */}
          <div className="flex flex-col">
            <label className={labelStyle} htmlFor="lectureTitle">
              Lecture Title {!view && <sup className="text-red-500 text-sm top-[-0.2em]">*</sup>}
            </label>
            <input
              disabled={view || loading}
              id="lectureTitle"
              placeholder="e.g., Introduction to Component State"
              {...register("lectureTitle", { required: true })}
              className={inputStyle}
            />
            {errors.lectureTitle && (
              <span className="text-xs font-semibold tracking-wide text-red-500 mt-1.5">
                Lecture title is required
              </span>
            )}
          </div>
          
          <div className="flex flex-col">
            <label className={labelStyle} htmlFor="lectureDesc">
              Lecture Description {!view && <sup className="text-red-500 text-sm top-[-0.2em]">*</sup>}
            </label>
            <textarea
              disabled={view || loading}
              id="lectureDesc"
              placeholder="Provide a brief overview of what this video covers..."
              {...register("lectureDesc", { required: true })}
              className={`${inputStyle} resize-none min-h-[140px] leading-relaxed`}
            />
            {errors.lectureDesc && (
              <span className="text-xs font-semibold tracking-wide text-red-500 mt-1.5">
                Lecture Description is required
              </span>
            )}
          </div>
          
          {!view && (
            <div className="flex items-center justify-end border-t border-slate-100 pt-6 mt-4">
              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center justify-center rounded-xl bg-slate-900 px-8 py-3.5 text-sm font-bold text-white shadow-[0_4px_14px_0_rgba(0,0,0,0.1)] transition-all duration-300 hover:bg-slate-800 hover:shadow-[0_6px_20px_rgba(0,0,0,0.15)] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Processing..." : edit ? "Save Changes" : "Create Lecture"}
              </button>
            </div>
          )}
        </form>

      </div>
    </div>
  );
}