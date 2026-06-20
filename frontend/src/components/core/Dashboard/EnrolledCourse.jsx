import React, { useEffect } from 'react'
import { useSelector } from 'react-redux' ;
import { useDispatch } from 'react-redux';
import CourseSkeleton from '../../common/CourseSkeleton';
import { getEnrolledCourse } from '../../../services/operations/profileApi';
import { useNavigate } from 'react-router-dom';
import EmptyState from '../../common/EmptyState';
const EnrolledCourse = () => {
    const {enrolledCourses,loading} = useSelector(state=> state.profile);
    const {token} = useSelector(state=>state.auth);
    const dispatch = useDispatch() ;
    const navigate = useNavigate();
    useEffect(()=>{
      if(token) {
        dispatch(getEnrolledCourse(token)) ;
      }
    },[dispatch,token]) ;
  return (
    <div className="w-full">
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
      ) : 
      
      !enrolledCourses || enrolledCourses.length === 0 ? (
        <div className="flex h-[240px] flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white p-8 shadow-md text-center">
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
          {enrolledCourses.map((course) => (
            <div 
              key={course._id} 
              className="flex flex-col items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-md sm:flex-row hover:border-indigo-200 transition-all duration-200"
            >
              <div className="flex w-full items-center gap-4 sm:w-auto">
                <img 
                  src={course.thumbnail} 
                  alt={course.courseName} 
                  className="h-16 w-24 rounded-xl object-cover border border-slate-100 shadow-sm" 
                />
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
                  className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-all duration-150 active:scale-[0.98]"
                >
                  Resume Learning
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
export default EnrolledCourse