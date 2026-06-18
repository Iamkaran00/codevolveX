import React, { useEffect, useState, useMemo } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FiEdit2, FiSearch } from "react-icons/fi";
import { RiDeleteBin6Line } from "react-icons/ri";
import { HiOutlineStatusOnline } from "react-icons/hi";
import { TbFileCode } from "react-icons/tb";

import { fetchInstructorCourses,deleteCourse } from "../../../../services/operations/courseApi";
import { formatDate } from "../../../../services/formateDate";
import { COURSE_STATUS } from "../../../../utils/constants";
import ConfirmationModal from "../../../common/ConfirmationModal";

import SpotlightCard from "../../../common/Spotlight";
import ShinyText from "../../../common/ShinyText";
const SkeletonCard = () => (
  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 p-5 rounded-2xl border border-slate-200/50 bg-white">
    <div className="aspect-[16/10] w-[140px] rounded-xl bg-slate-100 animate-pulse shrink-0" />
    <div className="flex flex-col gap-3 flex-1 w-full">
      <div className="h-5 w-2/3 max-w-[280px] rounded-md bg-slate-100 animate-pulse" />
      <div className="h-4 w-1/2 max-w-[180px] rounded-md bg-slate-100 animate-pulse" />
    </div>
    <div className="hidden md:flex gap-12 px-6">
      <div className="h-10 w-12 rounded-md bg-slate-100 animate-pulse" />
      <div className="h-10 w-16 rounded-md bg-slate-100 animate-pulse" />
    </div>
  </div>
);

const cardVariants = {
  hidden: { opacity: 0, scale: 0.9, y: 30 },
  show: { 
    opacity: 1, scale: 1, y: 0,
    transition: { type: "spring", stiffness: 260, damping: 20, mass: 1 }
  },
  exit: { opacity: 0, scale: 0.95, transition: { duration: 0.2 } }
};

export default function MyCourses() {
  const { token } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [confirmationModal, setConfirmationModal] = useState(null);
  
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");

  useEffect(() => {
    const fetchCourses = async () => {
      setLoading(true);
      const result = await fetchInstructorCourses(token);
      if (result) setCourses(result);
      setLoading(false);
    };
    if (token) fetchCourses();
  }, [token]);

  const handleDelete = async (courseId) => {
    setLoading(true);
    await deleteCourse({ courseId }, token);
    const result = await fetchInstructorCourses(token);
    if (result) setCourses(result);
    setConfirmationModal(null);
    setLoading(false);
  };

  const filteredCourses = useMemo(() => {
    return courses.filter((course) => {
      const searchStr = searchQuery.toLowerCase().trim();
      const matchesSearch = course.courseName.toLowerCase().includes(searchStr) || 
                            course.courseDescription.toLowerCase().includes(searchStr);
      const matchesStatus = filterStatus === "All" || course.status === filterStatus;
      return matchesSearch && matchesStatus;
    });
  }, [courses, searchQuery, filterStatus]);

  return (
    <div className="w-full min-h-screen bg-[#FAFAFC] pb-16 pt-6 font-sans">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full flex flex-col gap-8">
        
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between border-b border-slate-200/80 pb-6">
          <div>
            <p className="text-4xl font-bold  ">
              <ShinyText text="Catalogue" disabled={false} speed={3} className="!text-indigo-600" />
            </p>
            <p className="text-2xl  text-slate-500 font-medium ">
              Create, manage, and deploy your educational tracks.
            </p>
          </div>
          
          <button
            onClick={() => navigate("/dashboard/add-course")}
            className="group relative inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-6 py-3 text-sm font-bold text-white transition-all duration-300 hover:bg-slate-800 hover:shadow-[0_8px_20px_-6px_rgba(0,0,0,0.3)] active:scale-[0.97] shrink-0 overflow-hidden"
          >
            <span className="relative z-10">Deploy New Track</span>
            <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent transition-transform duration-700 ease-in-out group-hover:translate-x-full" />
          </button>
        </div>

         
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between z-10">
          <div className="relative group flex-1 max-w-lg">
            <input
              type="text"
              placeholder="Search by title or keyword..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-full border border-black-200/80 bg-white py-3 pl-12 pr-4 text-sm font-medium text-slate-900 shadow-[0_2px_8px_-4px_rgba(0,0,0,0.05)] outline-none transition-all placeholder:text-slate-400 focus:border-slate-400 focus:ring-4 focus:ring-slate-100"
            />
            <FiSearch className="absolute right-4 top-1/2 -translate-y-1/2 text-black/60  text-lg transition-colors group-focus-within:text-slate-900" />

          </div>

          <div className="flex items-center p-1 rounded-full bg-black border border-slate-200/30 shrink-0">
            {["All", COURSE_STATUS.PUBLISHED, COURSE_STATUS.DRAFT].map((status) => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`px-6 py-2 text-xs font-bold rounded-full transition-all duration-300 whitespace-nowrap
                  ${filterStatus === status 
                    ? "bg-white text-black shadow-[0_2px_8px_-2px_rgba(0,0,0,0.08)]" 
                    : "text-white "
                  }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-5 relative w-full">
          <div className="hidden md:flex items-center px-6 pb-2 text-[10px] font-extrabold uppercase tracking-widest text-slate-400 select-none">
            <div className="flex-1">Track Data</div>
            <div className="w-[100px] text-center">Enrollment</div>
            <div className="w-[100px] text-center">Value</div>
            <div className="w-[120px] text-center">Status</div>
            <div className="w-[100px]" />
          </div>
          {loading ? (
            [1, 2, 3].map((i) => <SkeletonCard key={i} />)
          ) : filteredCourses.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 px-6 text-center rounded-3xl border border-dashed border-slate-300 bg-transparent">
              <div className="h-14 w-14 rounded-2xl bg-white flex items-center justify-center mb-6 shadow-sm border border-slate-200">
                <TbFileCode className="text-2xl text-slate-400" />
              </div>
              <p className="text-xl font-bold text-slate-900 tracking-tight">No tracks found</p>
              <p className="text-sm font-medium text-slate-500 mt-2 max-w-sm leading-relaxed">
                {searchQuery ? "Try adjusting your search filters to find what you're looking for." : "Your workspace is pristine. Initialize your first educational track to begin."}
              </p>
            </div>
          ) : (
            <AnimatePresence mode="popLayout">
              {filteredCourses.map((course) => (
                <motion.div
                  layout
                  variants={cardVariants}
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true, amount: 0.15 }} 
                  exit="exit"
                  key={course._id}
                  className="group relative"
                >
                  <SpotlightCard 
                    className="rounded-2xl bg-white border border-slate-200/60 shadow-[0_2px_8px_-4px_rgba(0,0,0,0.05)] transition-transform duration-300 hover:-translate-y-1" 
                    spotlightColor="rgba(99, 102, 241, 0.12)"
                  >
                    <div className="flex flex-col md:flex-row items-start md:items-center gap-6 p-5 w-full h-full relative z-10">
                      
                      
                      <div className="flex items-start sm:items-center gap-5 flex-1 w-full md:w-auto">
                        <div className="relative shrink-0 overflow-hidden rounded-xl border border-slate-100/50 bg-slate-50">
                          <img
                            src={course.thumbnail}
                            alt="Thumbnail"
                            className="aspect-[16/10] w-[140px] object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                          />
                          <div className="absolute inset-0 ring-1 ring-inset ring-black/5 rounded-xl" />
                        </div>
                        
                        <div className="flex flex-col justify-center min-w-0 py-1">
                          <h3 className="text-[17px] font-bold text-slate-900 tracking-tight truncate">
                            {course.courseName}
                          </h3>
                          <p className="text-sm font-medium text-slate-500 line-clamp-1 mt-1 leading-relaxed pr-4">
                            {course.courseDescription}
                          </p>
                          <p className="text-[11px] font-bold text-slate-400 mt-3 uppercase tracking-widest flex items-center gap-1.5">
                            <span className="h-1 w-1 rounded-full bg-slate-300" />
                            Built {formatDate(course.createdAt)}
                          </p>
                        </div>
                      </div>

                      <div className="hidden md:flex flex-col items-center justify-center w-[100px]">
                        <span className="text-[10px] font-bold uppercase text-slate-400 mb-1 tracking-widest">students</span>
                        <span className="text-base font-bold text-slate-800">{course.studentsEnrolled?.length || 0}</span>
                      </div>
                      
                      <div className="hidden md:flex flex-col items-center justify-center w-[100px]">
                        <span className="text-[10px] font-bold uppercase text-slate-400 mb-1 tracking-widest">Price</span>
                        <span className="text-base font-bold text-slate-800">₹{course.price}</span>
                      </div>

                      <div className="hidden md:flex items-center justify-center w-[120px]">
                        {course.status === COURSE_STATUS.DRAFT ? (
                          <span className="inline-flex items-center justify-center rounded-lg bg-slate-100 px-3.5 py-1.5 text-xs font-bold text-slate-600 border border-slate-200">
                            Draft
                          </span>
                        ) : (
                          <span className="inline-flex items-center justify-center rounded-lg bg-indigo-50 px-3.5 py-1.5 text-xs font-bold text-indigo-700 border border-indigo-100/60">
                            <HiOutlineStatusOnline className="mr-1.5 text-sm" />
                            Published
                          </span>
                        )}
                      </div>

                      <div className="flex items-center justify-end w-full md:w-[100px] gap-3 mt-4 md:mt-0 opacity-100 md:opacity-0 transition-opacity duration-300 group-hover:opacity-100 relative z-20">
                        <button
                          onClick={() => navigate(`/dashboard/edit-course/${course._id}`)}
                          className="flex h-10 w-10 items-center cursor-pointer justify-center rounded-xl bg-white text-slate-400 border border-slate-200 shadow-sm transition-all duration-200 hover:text-slate-900 hover:border-slate-300 hover:shadow-md active:scale-95"
                          title="Edit Track"
                        >
                          <FiEdit2 size={16} />
                        </button>

                        <button
                          onClick={() => { return( setConfirmationModal({
                            text1: "Delete this educational track?",
                            text2: "This action is destructive and irreversible. All associated data will be wiped.",
                            btn1Text: "Delete",
                            btn2Text: "Cancel",
                            btn1Handler: () => handleDelete(course._id),
                            btn2Handler: () => setConfirmationModal(null),
                          })
                        )
                         
                        
                        }}
                          className="flex h-10 cursor-pointer w-10 items-center justify-center rounded-xl bg-white text-slate-400 border border-slate-200 shadow-sm transition-all duration-200 hover:text-red-600 hover:border-red-200 hover:bg-red-50 hover:shadow-md active:scale-95"
                          title="Delete Track"
                        >
                          <RiDeleteBin6Line size={16} />
                        </button>
                      </div>

                    </div>
                  </SpotlightCard>
                </motion.div>
              ))}
            </AnimatePresence>
          )}
        </div>
      </div>

      {confirmationModal && <ConfirmationModal modalData={confirmationModal} />}
    </div>
  );
}