import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { HiOutlineCurrencyRupee, HiArrowRight } from "react-icons/hi2";
import { useDispatch, useSelector } from "react-redux";

import { addCourseDetails, editCourseDetails, fetchCourseCategories } from "../../../../../services/operations/courseApi";
import { setCourse, setStep } from "../../../../../slices/course.slice";
import { COURSE_STATUS } from "../../../../../utils/constants";
import Upload from "../Upload";
import ChipInput from "./ChipInput";
import RequirementsField from "./RequirementField";

/* ---------- design tokens (shared with the rest of the site) ---------- */
const display = "font-['Space_Grotesk',ui-sans-serif,system-ui,sans-serif]";

const inputStyle =
  "w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-[#f3ece0] outline-none transition-colors duration-300 placeholder:text-zinc-600 focus:border-[#ffb454]/60 disabled:opacity-50 aria-[invalid=true]:border-red-400/60 [color-scheme:dark]";

const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ffb454]/70 focus-visible:ring-offset-2 focus-visible:ring-offset-[#100f0d]";

/* label + hint + error wrapper so every field reads the same */
const Field = ({ id, label, hint, error, children }) => (
  <div className="flex flex-col gap-2">
    <label htmlFor={id} className={`text-sm font-medium text-[#f3ece0] ${display}`}>
      {label} <span aria-hidden className="text-[#ffb454]">*</span>
    </label>
    {hint && <p className="-mt-1 text-xs text-zinc-500">{hint}</p>}
    {children}
    {error && (
      <p role="alert" className="text-xs text-red-400">
        {error}
      </p>
    )}
  </div>
);

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

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      className="w-full space-y-7 rounded-3xl border border-white/[0.07] bg-white/[0.02] p-6 sm:p-8"
    >
      <Field id="courseTitle" label="Course title" error={errors.courseTitle && "Enter a course title."}>
        <input
          id="courseTitle"
          placeholder="e.g. React Auth Mastery"
          aria-invalid={!!errors.courseTitle}
          {...register("courseTitle", { required: true })}
          className={inputStyle}
        />
      </Field>

      <Field
        id="courseShortDesc"
        label="Short description"
        hint="One or two sentences students see in the catalogue."
        error={errors.courseShortDesc && "Enter a short description."}
      >
        <textarea
          id="courseShortDesc"
          placeholder="What is this course about?"
          aria-invalid={!!errors.courseShortDesc}
          {...register("courseShortDesc", { required: true })}
          className={`${inputStyle} min-h-[120px] resize-none`}
        />
      </Field>

      <div className="grid gap-7 sm:grid-cols-2">
        <Field
          id="coursePrice"
          label="Price"
          error={errors.coursePrice && "Enter a valid price. Use 0 for a free course."}
        >
          <div className="relative w-full">
            <HiOutlineCurrencyRupee className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-xl text-zinc-500" />
            <input
              id="coursePrice"
              placeholder="e.g. 999"
              aria-invalid={!!errors.coursePrice}
              {...register("coursePrice", {
                required: true,
                valueAsNumber: true,
                pattern: { value: /^(0|[1-9]\d*)(\.\d+)?$/ },
              })}
              className={`${inputStyle} !pl-11`}
            />
          </div>
        </Field>

        <Field id="courseCategory" label="Category" error={errors.courseCategory && "Choose a category."}>
          <select
            {...register("courseCategory", { required: true })}
            defaultValue=""
            id="courseCategory"
            aria-invalid={!!errors.courseCategory}
            className={inputStyle}
          >
            <option value="" disabled>
              Choose a category
            </option>
            {!loading &&
              courseCategories?.map((category, idx) => (
                <option key={idx} value={category?._id}>
                  {category?.name}
                </option>
              ))}
          </select>
        </Field>
      </div>

      <ChipInput
        label="Tags"
        name="courseTags"
        placeholder="Type a keyword and press Enter"
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

      <Field
        id="courseBenefits"
        label="What students will learn"
        error={errors.courseBenefits && "Describe what students will learn."}
      >
        <textarea
          id="courseBenefits"
          placeholder="List the skills or outcomes students will walk away with."
          aria-invalid={!!errors.courseBenefits}
          {...register("courseBenefits", { required: true })}
          className={`${inputStyle} min-h-[110px] resize-none`}
        />
      </Field>

      <RequirementsField
        name="courseRequirements"
        label="Requirements/Instructions"
        register={register}
        setValue={setValue}
        errors={errors}
        getValues={getValues}
      />

      <div className="flex flex-col-reverse items-stretch justify-end gap-3 border-t border-white/[0.07] pt-6 sm:flex-row sm:items-center">
        {editCourse && (
          <button
            type="button"
            onClick={() => dispatch(setStep(2))}
            disabled={loading}
            className={`cursor-pointer rounded-full px-6 py-3 text-sm text-zinc-300 transition-colors duration-300 hover:text-[#ffb454] disabled:opacity-50 ${focusRing}`}
          >
            Continue without saving
          </button>
        )}

        <button
          type="submit"
          disabled={loading}
          className={`group flex cursor-pointer items-center justify-center gap-2 rounded-full bg-[#ffb454] px-7 py-3 text-sm font-semibold text-[#1d1a16] transition-all duration-500 hover:bg-[#ffc272] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60 ${focusRing}`}
        >
          {!editCourse ? "Next" : "Save changes"}
          <HiArrowRight className="h-4 w-4 transition-transform duration-500 group-hover:translate-x-1" />
        </button>
      </div>
    </form>
  );
}