import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { TbDatabaseOff } from "react-icons/tb";

import { getFullDetailsOfCourse } from "../../../../services/operations/courseApi";
import { setCourse, setEditCourse, setStep } from "../../../../slices/course.slice";
import RenderSteps from "../AddCourse/RenderSteps";
import ShinyText from "../../../common/ShinyText";
export default function EditCourse() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { courseId } = useParams();
  const { course } = useSelector((state) => state.course);
  const [loading, setLoading] = useState(false);
  const { token } = useSelector((state) => state.auth);

  useEffect(() => {
    const populateCourseDetails = async () => {
      setLoading(true);
      const result = await getFullDetailsOfCourse(courseId, token);
      
      const courseData = result?.courseDetails || result?.data || result;

      if (courseData) {
        dispatch(setEditCourse(true));
        dispatch(setCourse(courseData));
        dispatch(setStep(1));
      }
      setLoading(false);
    };

    if (courseId && token) {
      populateCourseDetails();
    }
    
    return () => {
        dispatch(setEditCourse(false));
    }
  }, [courseId, token, dispatch]);

  return (
    <div className="w-full min-h-screen bg-[#FAFAFC] pb-16 pt-6 font-sans">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 w-full flex flex-col gap-8">
        
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between border-b border-slate-200/80 pb-6">
          <div>
            <h1 className="text-4xl font-bold tracking-tight text-slate-900">
              <ShinyText text="Edit Track" disabled={false} speed={3} className="!text-indigo-600" />
            </h1>
            <p className="mt-2 text-sm text-slate-500 font-medium max-w-lg leading-relaxed">
              Modify active modules, update existing lecture timelines, or alter publish states smoothly.
            </p>
          </div>
        </div>

        <div className="w-full">
          {loading ? (
            <div className="flex flex-col min-h-[400px] items-center justify-center rounded-3xl border border-slate-200/60 bg-white shadow-[0_4px_24px_-8px_rgba(0,0,0,0.05)]">
              <div className="relative flex h-14 w-14 items-center justify-center">
                <div className="absolute inset-0 rounded-full border-4 border-slate-100"></div>
                <div className="absolute inset-0 rounded-full border-4 border-indigo-600 border-t-transparent animate-spin"></div>
              </div>
              <p className="mt-4 text-sm font-bold tracking-widest text-slate-400 uppercase">
                Mounting Workspace...
              </p>
            </div>
          ) : course ? (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="w-full"
            >
              <RenderSteps />
            </motion.div>
          ) : (
            <motion.div 
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center justify-center min-h-[400px] rounded-3xl border border-dashed border-slate-300 bg-transparent p-8 text-center"
            >
              <div className="h-16 w-16 rounded-2xl bg-white flex items-center justify-center mb-6 shadow-sm border border-slate-200">
                <TbDatabaseOff className="text-3xl text-slate-400" />
              </div>
              <p className="text-xl font-bold text-slate-900 tracking-tight">Track Not Found</p>
              <p className="text-sm font-medium text-slate-500 mt-2 max-w-sm leading-relaxed">
                The targeted curriculum setup record couldn't be mounted. It may have been deleted or the URL is incorrect.
              </p>
              <button 
                onClick={() => navigate("/dashboard/my-courses")}
                className="mt-8 text-sm font-bold text-indigo-600 hover:text-indigo-700 hover:underline underline-offset-4 transition-all"
              >
                Return to Catalogue
              </button>
            </motion.div>
          )}
        </div>

      </div>
    </div>
  );
}