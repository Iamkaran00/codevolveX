import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  courseSectionData: [],
  courseEntireData: null,
  completedLectures: [],
  totalNoOfLectures: 0,
  activeSectionId: null,
  activeSubSectionId: null,
};

const viewCourseSlice = createSlice({
  name: "ViewCourse",
  initialState,
  reducers: {
    setCourseSectionData: (state, action) => {
      state.courseSectionData = action.payload;
    },
    setEntireCourseData: (state, action) => {
      state.courseEntireData = action.payload;
    },
    setCompletedLectures: (state, action) => {
      state.completedLectures = action.payload;
    },
    updateCompletedLectures: (state, action) => {
  state.completedLectures = [...state.completedLectures, action.payload]
},
removeCompletedLecture: (state, action) => {
  state.completedLectures = state.completedLectures.filter(
    (id) => id !== action.payload
  )
},
    setTotalNoOfLectures: (state, action) => {
      state.totalNoOfLectures = action.payload;
    },
    setActiveLecture: (state, action) => {
      state.activeSectionId = action.payload.sectionId;
      state.activeSubSectionId = action.payload.subSectionId;
    },
    resetViewCourse: (state) => {
      state.courseSectionData = [];
      state.courseEntireData = null;
      state.completedLectures = [];
      state.totalNoOfLectures = 0;
      state.activeSectionId = null;
      state.activeSubSectionId = null;
    },
  },
});

export const {
  setActiveLecture,
  setCourseSectionData,
  setCompletedLectures,
  setEntireCourseData,
  setTotalNoOfLectures,  
  resetViewCourse,
  updateCompletedLectures,
  removeCompletedLecture
} = viewCourseSlice.actions;  

export default viewCourseSlice.reducer;