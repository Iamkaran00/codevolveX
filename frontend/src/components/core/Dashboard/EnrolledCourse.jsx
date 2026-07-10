import React, { useEffect } from 'react'
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { motion } from 'framer-motion';
import CourseSkeleton from '../../common/CourseSkeleton';
import { getEnrolledCourse } from '../../../services/operations/profileApi';
import { useNavigate } from 'react-router-dom';
import EmptyState from '../../common/EmptyState';
import { ArrowRight, PlayCircle } from 'lucide-react';

const EnrolledCourse = () => {
  const { enrolledCourses, loading } = useSelector(state => state.profile);
  const { token } = useSelector(state => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (token) {
      dispatch(getEnrolledCourse(token));
    }
  }, [dispatch, token]);

  return (
    <div className="w-full bg-slate-50/60 -m-6 p-6 rounded-3xl min-h-[calc(100vh-120px)]">
      <div className="mb-8 border-b border-slate-200 pb-5">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Enrolled Courses</h1>
        <p className="mt-1 text-sm text-slate-500">Track your active learning progress and resume lectures.</p>
      </div>

      {loading ? (
        <div className="flex flex-col gap-4">
          {[1, 2, 3].map((index) => (
            <CourseSkeleton key={index} />
          ))}
        </div>
      ) : !enrolledCourses || enrolledCourses.length === 0 ? (
        <div className="flex h-[240px] flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white p-8 shadow-sm text-center">
          <p className="text-lg font-semibold text-slate-700">You haven't enrolled in any courses yet.</p>
          <p className="text-sm text-slate-400 mt-1">Explore CodevolveX catalog courses to start learning.</p>
          <button
            onClick={() => navigate("/")}
            className="mt-5 rounded-xl bg-indigo-600 px-5 py-2.5 text-xs font-semibold text-white shadow-sm shadow-indigo-100 hover:bg-indigo-700 transition-all active:scale-[0.98]"
          >
            Explore Catalog
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {enrolledCourses.map((course, i) => (
            <motion.div
              key={course._id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.05, ease: [0.23, 1, 0.32, 1] }}
              whileHover={{ y: -3 }}
              className="group flex flex-col items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:flex-row hover:border-indigo-200 hover:shadow-lg hover:shadow-indigo-100/50 transition-all duration-300"
            >
              <div className="flex w-full items-center gap-4 sm:w-auto">
                <div className="relative shrink-0 overflow-hidden rounded-xl border border-slate-100">
                  <img
                    src={course.thumbnail}
                    alt={course.courseName}
                    className="h-16 w-24 object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
                    <PlayCircle
                      size={22}
                      className="text-white opacity-0 scale-75 group-hover:opacity-100 group-hover:scale-100 transition-all duration-300"
                    />
                  </div>
                </div>

                <div className="flex flex-col truncate max-w-[200px] sm:max-w-md">
                  <h3 className="font-bold text-slate-900 line-clamp-1">{course.courseName}</h3>
                  <p className="text-xs text-slate-400 mt-0.5 line-clamp-1">
                    {course.courseDescription}
                  </p>
                </div>
              </div>

              <div className="flex w-full items-center gap-6 sm:w-auto justify-end">
                <button
                  onClick={() => navigate(`/dashboard/view-courses/${course._id}`)}
                  className="group/btn flex items-center gap-1.5 rounded-xl border cursor-pointer border-slate-200 bg-white px-4 py-2.5 text-xs font-semibold text-slate-700 hover:bg-indigo-50 hover:border-indigo-200 hover:text-indigo-700 transition-all duration-200 active:scale-[0.98]"
                >
                  Resume Learning
                  <ArrowRight
                    size={13}
                    className="transition-transform duration-200 group-hover/btn:translate-x-0.5"
                  />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}

export default EnrolledCourse