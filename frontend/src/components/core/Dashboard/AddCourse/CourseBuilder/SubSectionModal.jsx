import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { RxCross2 } from "react-icons/rx";
import { useDispatch, useSelector } from "react-redux";

import { createSubSection, updateSubSection } from "../../../../../services/operations/courseDetailsAPI";
import { setCourse } from "../../../../../slices/courseSlice";
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

  // detect whether form is updated or not
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

  // handle the editing of subsection
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
      formData.append("video", currentValues.lectureVideo);
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
    formData.append("video", data.lectureVideo);
    
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

  return (
    // Fixed screen overlay with backdrop blur for immersion
    <div className="fixed inset-0 z-[1000] !mt-0 grid h-screen w-screen place-items-center overflow-auto bg-slate-900/40 backdrop-blur-sm p-4 animate-fadeIn">
      
      {/* Modal Card Base */}
      <div className="my-10 w-full max-w-[700px] rounded-2xl border border-slate-200 bg-white shadow-2xl animate-scaleUp overflow-hidden">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/80 px-7 py-5">
          <p className="text-xl font-bold text-slate-900 tracking-tight">
            {view && "Viewing"} {add && "Adding"} {edit && "Editing"} Lecture
          </p>
          <button 
            onClick={() => (!loading ? setModalData(null) : {})}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/50 transition-all"
          >
            <RxCross2 className="text-2xl" />
          </button>
        </div>
        
        {/* Modal Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 px-7 py-8">
          
          {/* Lecture Video Upload */}
          <Upload
            name="lectureVideo"
            label="Lecture Video"
            register={register}
            setValue={setValue}
            errors={errors}
            video={true}
            viewData={view ? modalData.videoUrl : null}
            editData={edit ? modalData.videoUrl : null}
          />
          
          {/* Lecture Title Input */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500" htmlFor="lectureTitle">
              Lecture Title {!view && <sup className="text-red-500">*</sup>}
            </label>
            <input
              disabled={view || loading}
              id="lectureTitle"
              placeholder="Enter Lecture Title"
              {...register("lectureTitle", { required: true })}
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-800 placeholder:text-slate-300 outline-none transition-all focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50/60 disabled:bg-slate-50 disabled:cursor-not-allowed"
            />
            {errors.lectureTitle && (
              <span className="text-xs font-semibold tracking-wide text-red-500 mt-0.5">
                Lecture title is required
              </span>
            )}
          </div>
          
          {/* Lecture Description Textarea */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500" htmlFor="lectureDesc">
              Lecture Description {!view && <sup className="text-red-500">*</sup>}
            </label>
            <textarea
              disabled={view || loading}
              id="lectureDesc"
              placeholder="Enter Lecture Description"
              {...register("lectureDesc", { required: true })}
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-800 placeholder:text-slate-300 outline-none transition-all focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50/60 disabled:bg-slate-50 disabled:cursor-not-allowed resize-none min-h-[130px]"
            />
            {errors.lectureDesc && (
              <span className="text-xs font-semibold tracking-wide text-red-500 mt-0.5">
                Lecture Description is required
              </span>
            )}
          </div>
          
           
          {!view && (
            <div className="flex items-center justify-end border-t border-slate-100 pt-5 mt-4">
              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center justify-center rounded-xl bg-indigo-600 px-7 py-3 text-sm font-bold text-white shadow-sm shadow-indigo-100 transition-all hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]"
              >
                {loading ? "Saving..." : edit ? "Save Changes" : "Create Lecture"}
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}