import React, { useEffect, useState } from "react";
import { VscAdd } from "react-icons/vsc";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import { fetchInstructorCourses } from "../../../../services/operations/courseDetailsAPI";
import CoursesTable from "./CoursesTable";

export default function MyCourses() {
  const { token } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCourses = async () => {
      setLoading(true);
      const result = await fetchInstructorCourses(token);
      if (result) {
        setCourses(result);
      }
      setLoading(false);
    };
    if (token) {
      fetchCourses();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="w-full min-h-screen bg-gray-50/10">
      
      {/* 1. SECTION COMPONENT HEADER PANEL */}
      <div className="mb-8 flex flex-col gap-y-4 sm:flex-row sm:items-center sm:justify-between border-b border-slate-200 pb-5">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
            My Courses
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Manage your published catalog paths, drafts, and track learning content structures.
          </p>
        </div>

        {/* Clean, Native White & Indigo Action Button Element */}
        <button
          onClick={() => navigate("/dashboard/add-course")}
          className="inline-flex items-center justify-center gap-x-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-bold text-white shadow-sm shadow-indigo-100 transition-all hover:bg-indigo-700 active:scale-[0.98] self-start sm:self-auto"
        >
          <VscAdd className="text-base font-bold" />
          <span>Add Course</span>
        </button>
      </div>

      {/* 2. DYNAMIC CONTENT WORKSPACE ENGINE */}
      {loading ? (
        <div className="flex h-[300px] items-center justify-center rounded-2xl border border-slate-200 bg-white shadow-md">
          <div className="h-9 w-9 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent" />
        </div>
      ) : (
        <div className="w-full">
          <CoursesTable courses={courses} setCourses={setCourses} />
        </div>
      )}
    </div>
  );
}