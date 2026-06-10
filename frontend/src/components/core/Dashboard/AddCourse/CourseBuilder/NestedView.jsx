import React, { useState } from "react";
import { AiFillCaretDown } from "react-icons/ai";
import { FaPlus } from "react-icons/fa";
import { MdEdit } from "react-icons/md";
import { RiDeleteBin6Line } from "react-icons/ri";
import { RxDropdownMenu } from "react-icons/rx";
import { useDispatch, useSelector } from "react-redux";

import { deleteSection, deleteSubSection } from "../../../../../services/operations/courseDetailsAPI";
import { setCourse } from "../../../../../slices/courseSlice";
import ConfirmationModal from "../../../../common/ConfirmationModal";
import SubSectionModal from "./SubSectionModal";

export default function NestedView({ handleChangeEditSectionName }) {
  const { course } = useSelector((state) => state.course);
  const { token } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  
  // States to keep track of mode of modal [add, view, edit]
  const [addSubSection, setAddSubsection] = useState(null);
  const [viewSubSection, setViewSubSection] = useState(null);
  const [editSubSection, setEditSubSection] = useState(null);
  // to keep track of confirmation modal
  const [confirmationModal, setConfirmationModal] = useState(null);

  const handleDeleleSection = async (sectionId) => {
    const result = await deleteSection({
      sectionId,
      courseId: course._id,
      token,
    });
    if (result) {
      dispatch(setCourse(result));
    }
    setConfirmationModal(null);
  };

  const handleDeleteSubSection = async (subSectionId, sectionId) => {
    const result = await deleteSubSection({ subSectionId, sectionId, token });
    if (result) {
      const updatedCourseContent = course.courseContent.map((section) =>
        section._id === sectionId ? result : section
      );
      const updatedCourse = { ...course, courseContent: updatedCourseContent };
      dispatch(setCourse(updatedCourse));
    }
    setConfirmationModal(null);
  };

  return (
    <>
      <div className="w-full flex flex-col gap-y-4" id="nestedViewContainer">
        {course?.courseContent?.map((section) => (
          
          /* SECTION ACCORDION WRAPPER: Clean light slate enclosure with sharp borders */
          <details 
            key={section._id} 
            open 
            className="group rounded-xl border border-slate-200 bg-slate-50/40 overflow-hidden transition-all [&_summary::-webkit-details-marker]:hidden"
          >
            {/* SECTION MAIN HEADER CONTROL BAR */}
            <summary className="flex cursor-pointer items-center justify-between bg-slate-50/80 px-5 py-3.5 select-none hover:bg-slate-100/70 transition-colors border-b border-slate-200/60">
              <div className="flex items-center gap-x-2.5">
                <RxDropdownMenu className="text-xl text-slate-400 cursor-grab active:cursor-grabbing" />
                <p className="font-bold text-sm text-slate-800">
                  {section.sectionName}
                </p>
              </div>
              
              <div className="flex items-center gap-x-2.5" onClick={(e) => e.stopPropagation()}>
                <button
                  onClick={() => handleChangeEditSectionName(section._id, section.sectionName)}
                  className="p-1 rounded-md text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-all"
                  title="Edit Section"
                >
                  <MdEdit className="text-lg" />
                </button>
                <button
                  onClick={() =>
                    setConfirmationModal({
                      text1: "Delete this Section?",
                      text2: "All the lectures in this section will be permanently wiped out.",
                      btn1Text: "Delete",
                      btn2Text: "Cancel",
                      btn1Handler: () => handleDeleleSection(section._id),
                      btn2Handler: () => setConfirmationModal(null),
                    })
                  }
                  className="p-1 rounded-md text-slate-400 hover:text-red-600 hover:bg-red-50 transition-all"
                  title="Delete Section"
                >
                  <RiDeleteBin6Line className="text-lg" />
                </button>
                <span className="text-slate-300 font-light">|</span>
                <AiFillCaretDown className="text-slate-400 transition-transform duration-200 group-open:rotate-180" />
              </div>
            </summary>

            {/* LECTURE CONTENTS SUB-VIEWPORT EXPANSION LAYER */}
            <div className="px-5 py-3 bg-white flex flex-col gap-y-2">
              {section?.subSection?.map((data) => (
                <div
                  key={data?._id}
                  onClick={() => setViewSubSection(data)}
                  className="flex cursor-pointer items-center justify-between gap-x-3 rounded-lg border border-slate-100 bg-slate-50/30 px-4 py-2.5 shadow-sm hover:border-indigo-100 hover:bg-indigo-50/10 transition-all group/lecture"
                >
                  <div className="flex items-center gap-x-2.5 truncate">
                    <RxDropdownMenu className="text-lg text-slate-300 shrink-0" />
                    <p className="text-xs font-semibold text-slate-700 truncate group-hover/lecture:text-indigo-600 transition-colors">
                      {data.title}
                    </p>
                  </div>
                  
                  <div className="flex items-center gap-x-2 shrink-0" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={() => setEditSubSection({ ...data, sectionId: section._id })}
                      className="p-1 rounded-md text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-all"
                    >
                      <MdEdit className="text-base" />
                    </button>
                    <button
                      onClick={() =>
                        setConfirmationModal({
                          text1: "Delete this Sub-Section?",
                          text2: "This specific lecture video segment will be permanently deleted.",
                          btn1Text: "Delete",
                          btn2Text: "Cancel",
                          btn1Handler: () => handleDeleteSubSection(data._id, section._id),
                          btn2Handler: () => setConfirmationModal(null),
                        })
                      }
                      className="p-1 rounded-md text-slate-400 hover:text-red-600 hover:bg-red-50 transition-all"
                    >
                      <RiDeleteBin6Line className="text-base" />
                    </button>
                  </div>
                </div>
              ))}

              {/* ADD LECTURE INTERACTIVE CONTAINER TRIGGER BUTTON */}
              <div className="mt-2 pt-1 border-t border-dashed border-slate-100">
                <button
                  onClick={() => setAddSubsection(section._id)}
                  className="inline-flex items-center gap-x-1.5 px-3 py-1.5 text-xs font-bold text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 rounded-lg transition-all active:scale-[0.97]"
                >
                  <FaPlus className="text-xs" />
                  <span>Add Lecture</span>
                </button>
              </div>
            </div>
          </details>
        ))}
      </div>

      {/* RENDER INTERNAL ACTION POPUP MODALS */}
      {addSubSection && (
        <SubSectionModal modalData={addSubSection} setModalData={setAddSubsection} add={true} />
      )}
      {viewSubSection && (
        <SubSectionModal modalData={viewSubSection} setModalData={setViewSubSection} view={true} />
      )}
      {editSubSection && (
        <SubSectionModal modalData={editSubSection} setModalData={setEditSubSection} edit={true} />
      )}

      {confirmationModal && <ConfirmationModal modalData={confirmationModal} />}
    </>
  );
}