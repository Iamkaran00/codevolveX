import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { HiOutlineCurrencyRupee } from "react-icons/hi2";
import { MdNavigateNext } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";

import { addCourseDetails, editCourseDetails, fetchCourseCategories } from "../../../../../services/operations/courseApi";
import { setCourse, setStep } from "../../../../../slices/course.slice";
import { COURSE_STATUS } from "../../../../../utils/constants";
import Upload from "../Upload";
import ChipInput from "./ChipInput";
import RequirementsField from "./RequirementField";

export default function CourseInformationForm() {
  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    formState: { errors },
  } = useForm();

  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.auth);
  const { course, editCourse } = useSelector((state) => state.course);
  const [loading, setLoading] = useState(false);
  const [courseCategories, setCourseCategories] = useState([]);

  useEffect(() => {
    const getCategories = async () => {
      setLoading(true);
      const categories = await fetchCourseCategories();
      if (categories?.length > 0) {
        setCourseCategories(categories);
      }
      setLoading(false);
    };
    
    if (editCourse && course) {
      setValue("courseTitle", course.courseName || "");
      setValue("courseShortDesc", course.courseDescription || "");
      setValue("coursePrice", course.price || "");
      setValue("courseTags", course.tag || []);
      setValue("courseBenefits", course.whatYouWillLearn || "");
      
      const categoryId = course.category?._id ? course.category._id : course.category;
      setValue("courseCategory", categoryId || "");
      
      setValue("courseRequirements", course.instructions || []);
      setValue("courseImage", course.thumbnail || null);
    }
    getCategories();
  }, [editCourse, course, setValue]);

  const isFormUpdated = () => {
    const currentValues = getValues();
    
    if (currentValues.courseTitle !== course?.courseName) return true;
    if (currentValues.courseShortDesc !== course?.courseDescription) return true;
    if (currentValues.coursePrice !== course?.price) return true;
    if (currentValues.courseTags?.toString() !== course?.tag?.toString()) return true;
    if (currentValues.courseBenefits !== course?.whatYouWillLearn) return true;
    
    const originalCategoryId = course?.category?._id ? course.category._id : course?.category;
    if (currentValues.courseCategory !== originalCategoryId) return true;
    
    if (currentValues.courseRequirements?.toString() !== course?.instructions?.toString()) return true;
    if (currentValues.courseImage !== course?.thumbnail) return true;
    
    return false;
  };

  const onSubmit = async (data) => {
     
    if (editCourse) {
      if (isFormUpdated()) {
        const formData = new FormData();
        formData.append("courseId", course._id);
        
        if (data.courseTitle !== course.courseName) {
          formData.append("courseName", data.courseTitle);
        }
        if (data.courseShortDesc !== course.courseDescription) {
          formData.append("courseDescription", data.courseShortDesc);
        }
        if (data.coursePrice !== course.price) {
          formData.append("price", data.coursePrice);
        }
        if (data.courseTags?.toString() !== course.tag?.toString()) {
          formData.append("tag", JSON.stringify(data.courseTags));
        }
        if (data.courseBenefits !== course.whatYouWillLearn) {
          formData.append("whatYouWillLearn", data.courseBenefits);
        }
        
        const originalCategoryId = course.category?._id ? course.category._id : course.category;
        if (data.courseCategory !== originalCategoryId) {
          formData.append("category", data.courseCategory);
        }
        if (data.courseRequirements?.toString() !== course.instructions?.toString()) {
          formData.append("instructions", JSON.stringify(data.courseRequirements));
        }
        if (data.courseImage !== course.thumbnail) {
          formData.append("thumbnailImage", data.courseImage);
        }
        
        setLoading(true);
        console.log("Dispatching API call to editCourseDetails...");
        const result = await editCourseDetails(formData, token);
        setLoading(false);
        
        if (result) {
          dispatch(setStep(2));
          dispatch(setCourse(result));
        }
      } else {
        toast.error("No changes made to the form");
      }
      return;
    }
 
    const formData = new FormData();
    formData.append("courseName", data.courseTitle);
    formData.append("courseDescription", data.courseShortDesc);
    formData.append("price", data.coursePrice);
    formData.append("tag", JSON.stringify(data.courseTags));
    formData.append("whatYouWillLearn", data.courseBenefits);
    formData.append("category", data.courseCategory);
    formData.append("status", COURSE_STATUS.DRAFT);
    formData.append("instructions", JSON.stringify(data.courseRequirements));
    formData.append("thumbnailImage", data.courseImage);
    
    setLoading(true);
    const result = await addCourseDetails(formData, token);
    if (result) {
      dispatch(setStep(2));
      dispatch(setCourse(result));
    }
    setLoading(false);
  };

  const inputStyle = 
    "w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-800 placeholder:text-slate-300 outline-none transition-all focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50/60 disabled:bg-slate-50";

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-6 rounded-2xl border w-full border-slate-200 bg-white p-6 shadow-md"
    >
      <div className="flex flex-col gap-2">
        <label className="text-xs font-bold uppercase tracking-wider text-slate-500" htmlFor="courseTitle">
          Course Title <sup className="text-red-500">*</sup>
        </label>
        <input
          id="courseTitle"
          placeholder="Enter Course Title"
          {...register("courseTitle", { required: true })}
          className={inputStyle}
        />
        {errors.courseTitle && (
          <span className="text-xs font-semibold text-red-500 mt-0.5">
            Course title is required.
          </span>
        )}
      </div>

      {/* Course Short Description Field */}
      <div className="flex flex-col gap-2">
        <label className="text-xs font-bold uppercase tracking-wider text-slate-500" htmlFor="courseShortDesc">
          Course Short Description <sup className="text-red-500">*</sup>
        </label>
        <textarea
          id="courseShortDesc"
          placeholder="Enter detailed introductory description summary..."
          {...register("courseShortDesc", { required: true })}
          className={`${inputStyle} resize-none min-h-[120px]`}
        />
        {errors.courseShortDesc && (
          <span className="text-xs font-semibold text-red-500 mt-0.5">
            Course description is required.
          </span>
        )}
      </div>

      {/* Course Price Input Layer */}
      <div className="flex flex-col gap-2">
        <label className="text-xs font-bold uppercase tracking-wider text-slate-500" htmlFor="coursePrice">
          Course Price <sup className="text-red-500">*</sup>
        </label>
        <div className="relative w-full">
          <input
            id="coursePrice"
            placeholder="Enter Course Price (INR)"
            {...register("coursePrice", {
              required: true,
              valueAsNumber: true,
              pattern: { value: /^(0|[1-9]\d*)(\.\d+)?$/ },
            })}
            className={`${inputStyle} !pl-11`}
          />
          <HiOutlineCurrencyRupee className="absolute left-4 top-1/2 -translate-y-1/2 text-xl text-slate-400" />
        </div>
        {errors.coursePrice && (
          <span className="text-xs font-semibold text-red-500 mt-0.5">
            A valid numerical course price is required.
          </span>
        )}
      </div>

      {/* Course Category Dropdown Selection */}
      <div className="flex flex-col gap-2">
        <label className="text-xs font-bold uppercase tracking-wider text-slate-500" htmlFor="courseCategory">
          Course Category <sup className="text-red-500">*</sup>
        </label>
        <select
          {...register("courseCategory", { required: true })}
          defaultValue=""
          id="courseCategory"
          className={inputStyle}
        >
          <option value="" disabled>Choose a Category</option>
          {!loading &&
            courseCategories?.map((category, idx) => (
              <option key={idx} value={category?._id}>
                {category?.name}
              </option>
            ))}
        </select>
        {errors.courseCategory && (
          <span className="text-xs font-semibold text-red-500 mt-0.5">
            Please map this content onto a category module.
          </span>
        )}
      </div>

      <ChipInput
        label="Tags"
        name="courseTags"
        placeholder="Enter search keywords and press Enter"
        register={register}
        errors={errors}
        setValue={setValue}
        getValues={getValues}
      />

      <Upload
        name="courseImage"
        label="Course Thumbnail"
        register={register}
        setValue={setValue}
        errors={errors}
        editData={editCourse ? course?.thumbnail : null}
      />

      {/* Benefits Textarea Layer */}
      <div className="flex flex-col gap-2">
        <label className="text-xs font-bold uppercase tracking-wider text-slate-500" htmlFor="courseBenefits">
          Benefits of the course <sup className="text-red-500">*</sup>
        </label>
        <textarea
          id="courseBenefits"
          placeholder="What core values or outcomes will the user learn from this tract?"
          {...register("courseBenefits", { required: true })}
          className={`${inputStyle} resize-none min-h-[110px]`}
        />
        {errors.courseBenefits && (
          <span className="text-xs font-semibold text-red-500 mt-0.5">
            Benefits definition array fields are required.
          </span>
        )}
      </div>

      <RequirementsField
        name="courseRequirements"
        label="Requirements/Instructions"
        register={register}
        setValue={setValue}
        errors={errors}
        getValues={getValues}
      />

      {/* Wizard Form Controls Action Bar Footer */}
      <div className="flex justify-end items-center gap-x-3 border-t border-slate-100 pt-5 mt-4">
        {editCourse && (
          <button
            type="button"
            onClick={() => dispatch(setStep(2))}
            disabled={loading}
            className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-xs font-bold text-slate-600 transition-all hover:bg-slate-50 active:scale-[0.98]"
          >
            Continue Without Saving
          </button>
        )}
        
        <button
          type="submit"
          disabled={loading}
          className="inline-flex items-center cursor-pointer justify-center gap-1.5 rounded-xl bg-indigo-600 px-6 py-2.5 text-xs font-bold text-white shadow-sm shadow-indigo-100 transition-all hover:bg-indigo-700 active:scale-[0.98]"
        >
          <span>{!editCourse ? "Next" : "Save Changes"}</span>
          <MdNavigateNext className="text-base" />
        </button>
      </div>
    </form>
  );
}