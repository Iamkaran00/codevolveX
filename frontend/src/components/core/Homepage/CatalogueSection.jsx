import React, { useState, useEffect, useMemo } from "react";
import { HiStar, HiArrowRight } from "react-icons/hi2";
import { getAllCourses, getAverageRating } from '../../../services/operations/courseApi';
import { useNavigate } from "react-router-dom";

export const CatalogueSection = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [ratings, setRatings] = useState({}); 
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      const coursesData = await getAllCourses();
      setCourses(coursesData ?? []);
      
      if (coursesData) {
        const ratingMap = {};
      await Promise.all(
  coursesData.map(async (course) => {
    try {
      const avg = await getAverageRating(course._id);
      ratingMap[course._id] = typeof avg === "number" && !isNaN(avg) ? avg : 0;
    } catch (err) {
      console.error("Rating fetch failed for", course._id, err);
      ratingMap[course._id] = 0;
    }
  })
);
        setRatings(ratingMap);
      }
      setLoading(false);
    }
    load();
  }, []);

  const displayedCourses = useMemo(() => {
      return [...courses]
        .sort((a, b) => (b.studentsEnrolled?.length ?? 0) - (a.studentsEnrolled?.length ?? 0))
        .slice(0, 6);
  }, [courses]);

  return (
    <section className="py-24 bg-white sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-12">
          <div>
            <h2 className="text-sm font-bold text-indigo-600 uppercase tracking-widest">
              Popular Courses
            </h2>
            <p className="mt-2 text-3xl font-extrabold text-slate-900">
              Build Skills That Matter
            </p>
          </div>
          <button 
            onClick={() => navigate('/catalogue')}
            className="flex items-center gap-2 text-sm font-bold text-indigo-600 hover:text-indigo-700 transition-colors group"
          >
            See all courses 
            <HiArrowRight className="transition-transform group-hover:translate-x-1" />
          </button>
        </div>
 
        {loading ? (
          <div className="text-center py-20 text-slate-500">Loading...</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {displayedCourses.map((course) => (
              <div
                key={course._id}
                onClick={() => navigate(`/catalogue/${course._id}`)}
                className="group flex flex-col h-full bg-white rounded-3xl border border-slate-200 overflow-hidden hover:border-indigo-200 hover:shadow-[0_20px_40px_-15px_rgba(79,70,229,0.15)] transition-all cursor-pointer"
              >
                <div className="aspect-[16/9] w-full bg-slate-100 overflow-hidden">
                  <img src={course.thumbnail} alt={course.courseName} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
                
                <div className="p-7 flex-1 flex flex-col">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-[11px] font-bold uppercase bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full">
                      {course.category?.name || "Course"}
                    </span>
                    <div className="flex items-center gap-1">
                      <HiStar className="text-amber-400" size={16} />
                      <span className="text-sm font-bold text-slate-700">
                        {ratings[course._id]?.toFixed(1) || "0.0"}
                      </span>
                    </div>
                  </div>
                  
                  <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-indigo-600 transition-colors">
                    {course.courseName}
                  </h3>
                  <p className="text-sm text-slate-500 mb-8">
                    by {course.instructor?.firstName} {course.instructor?.lastName}
                  </p>
                  
                  <div className="mt-auto flex justify-between items-end border-t border-slate-100 pt-6">
                    <span className="text-2xl font-black text-slate-900">
                      ₹{course.price.toLocaleString("en-IN")}
                    </span>
                    <button className="bg-slate-900 text-white px-6 py-2.5 rounded-xl font-bold hover:bg-indigo-600 transition-colors">
                      Enroll
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};