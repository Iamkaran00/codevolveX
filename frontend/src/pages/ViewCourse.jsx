import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import CourseSkeleton from "../components/common/CourseSkeleton";
import { getFullDetailsOfCourse } from "../services/operations/courseApi";
import {
  setCourseSectionData,
  setEntireCourseData,
  setCompletedLectures,
  setTotalNoOfLectures,
  setActiveLecture, 
} from "../slices/viewCourse.slice"; 

import VideoDetailsSidebar from "../components/common/VideoDetailsSidebar";
import VideoPlayer from "../components/common/VideoPlayer";
export default function ViewCourse() {
  const { courseId, sectionId, subSectionId } = useParams();
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.auth);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      const result = await getFullDetailsOfCourse(courseId, token);
      
      console.log("🔍 API RESULT:", result);  

      if (result) {
        dispatch(setCourseSectionData(result.courseDetails?.courseContent || []));
        dispatch(setEntireCourseData(result.courseDetails));
        dispatch(setCompletedLectures(result.completedVideos || []));

        let lectures = 0;
        result.courseDetails?.courseContent?.forEach((section) => {
          lectures += section.SubSection.length;
        });
        dispatch(setTotalNoOfLectures(lectures));

        // 2. USE THE URL PARAMETERS FIRST
        if (sectionId && subSectionId) {
          dispatch(setActiveLecture({ sectionId, subSectionId }));
        } 
        // If there are no URL parameters, default to the first video
        else {
          const firstSection = result.courseDetails?.courseContent?.[0];
          const firstSubSection = firstSection?.SubSection?.[0];
          if (firstSection && firstSubSection) {
            dispatch(setActiveLecture({
                sectionId: firstSection._id,
                subSectionId: firstSubSection._id,
            }));
          }
        }
      }
      setLoading(false);
    }
    load();
  }, [courseId, token, dispatch, sectionId, subSectionId]); // Added URL params to dependency array

  if (loading) return <CourseSkeleton />;

  return (
    <div className="flex h-[calc(100vh-4rem)] mt-16 bg-slate-50 font-sans overflow-hidden">
      <VideoDetailsSidebar />
      <VideoPlayer />
    </div>
  );
}