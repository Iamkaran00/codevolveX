import React, { useState } from "react";
import { AiFillCaretDown } from "react-icons/ai";
import { FaPlus } from "react-icons/fa";
import { MdEdit } from "react-icons/md";
import { RiDeleteBin6Line } from "react-icons/ri";
import { RxDropdownMenu } from "react-icons/rx";
import { useDispatch, useSelector } from "react-redux";

import { deleteSection, deleteSubSection } from "../../../../../services/operations/courseApi";
import { setCourse } from "../../../../../slices/course.slice";
import ConfirmationModal from "../../../../common/ConfirmationModal";
import SubSectionModal from "./SubSectionModal";

const display = "font-['Space_Grotesk',ui-sans-serif,system-ui,sans-serif]";
const mono = "font-['JetBrains_Mono',ui-monospace,monospace]";

const iconBtn =
  "flex h-8 w-8 cursor-pointer items-center justify-center rounded-full text-zinc-500 transition-all duration-500";

export default function NestedView({ handleChangeEditSectionName }) {
  const { course } = useSelector((state) => state.course);
  const { token } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const [addSubSection, setAddSubsection] = useState(null);
  const [viewSubSection, setViewSubSection] = useState(null);
  const [editSubSection, setEditSubSection] = useState(null);
  const [confirmationModal, setConfirmationModal] = useState(null);

  const handleDeleleSection = async (sectionId) => {
    const result = await deleteSection(
      {
        sectionId,
        courseId: course._id,
      },
      token
    );
    if (result) {
      dispatch(setCourse(result));
    }
    setConfirmationModal(null);
  };

  const handleDeleteSubSection = async (subSectionId, sectionId) => {
    const result = await deleteSubSection({ subSectionId, sectionId }, token);
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
      <div className="flex w-full flex-col gap-4" id="nestedViewContainer">
        {course?.courseContent?.map((section, si) => {
          const lectures = section?.SubSection ?? [];
          return (
            <details
              key={section._id}
              open
              className="group overflow-hidden rounded-2xl border border-white/[0.08] bg-[#100f0d]/60 transition-colors duration-500 hover:border-[#ffb454]/30 [&_summary::-webkit-details-marker]:hidden"
            >
              {/* section header */}
              <summary className="flex cursor-pointer select-none items-center justify-between gap-4 px-5 py-4 transition-colors duration-500 hover:bg-white/[0.02]">
                <div className="flex min-w-0 items-center gap-4">
                  <span
                    className={`w-9 shrink-0 text-2xl font-semibold leading-none text-transparent ${display}`}
                    style={{ WebkitTextStroke: "1px rgba(243,236,220,0.35)" }}
                  >
                    {String(si + 1).padStart(2, "0")}
                  </span>
                  <div className="min-w-0">
                    <p
                      className={`truncate text-[15px] font-semibold tracking-tight text-[#f3ece0] ${display}`}
                    >
                      {section.sectionName}
                    </p>
                    <p className={`mt-0.5 text-[10px] uppercase tracking-[0.2em] text-zinc-600 ${mono}`}>
                      {lectures.length} {lectures.length === 1 ? "lecture" : "lectures"}
                    </p>
                  </div>
                </div>

                <div
                  className="flex shrink-0 items-center gap-1"
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    onClick={() =>
                      handleChangeEditSectionName(section._id, section.sectionName)
                    }
                    className={`${iconBtn} hover:bg-[#ffb454]/10 hover:text-[#ffb454]`}
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
                    className={`${iconBtn} hover:bg-[#e0816f]/10 hover:text-[#e0816f]`}
                    title="Delete Section"
                  >
                    <RiDeleteBin6Line className="text-lg" />
                  </button>
                  <span className="mx-1 h-4 w-px bg-white/10" />
                  <AiFillCaretDown className="mr-1 text-xs text-zinc-600 transition-transform duration-500 group-open:rotate-180 group-open:text-[#ffb454]" />
                </div>
              </summary>

              {/* lectures */}
              <div className="flex flex-col gap-2 border-t border-white/[0.07] px-5 py-4">
                {lectures.map((data, li) => (
                  <div
                    key={data?._id}
                    onClick={() => setViewSubSection(data)}
                    className="group/lecture flex cursor-pointer items-center justify-between gap-3 rounded-xl border border-white/[0.06] bg-white/[0.02] px-4 py-3 transition-all duration-500 hover:border-[#ffb454]/30 hover:bg-[#ffb454]/[0.03]"
                  >
                    <div className="flex min-w-0 items-center gap-3">
                      <RxDropdownMenu className="shrink-0 text-lg text-zinc-700" />
                      <span className={`shrink-0 text-[11px] text-zinc-600 ${mono}`}>
                        {si + 1}.{li + 1}
                      </span>
                      <p className="truncate text-sm text-zinc-300 transition-colors duration-500 group-hover/lecture:text-[#ffb454]">
                        {data.title}
                      </p>
                    </div>

                    <div
                      className="flex shrink-0 items-center gap-0.5"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <button
                        onClick={() =>
                          setEditSubSection({ ...data, sectionId: section._id })
                        }
                        className={`${iconBtn} h-7 w-7 hover:bg-[#ffb454]/10 hover:text-[#ffb454]`}
                        title="Edit Lecture"
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
                        className={`${iconBtn} h-7 w-7 hover:bg-[#e0816f]/10 hover:text-[#e0816f]`}
                        title="Delete Lecture"
                      >
                        <RiDeleteBin6Line className="text-base" />
                      </button>
                    </div>
                  </div>
                ))}

                <button
                  onClick={() => setAddSubsection(section._id)}
                  className="group/add mt-1 flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl border border-dashed border-white/15 px-4 py-3 text-sm text-zinc-500 transition-all duration-500 hover:border-[#ffb454]/50 hover:bg-[#ffb454]/[0.04] hover:text-[#ffb454] active:scale-[0.99]"
                >
                  <FaPlus className="text-xs transition-transform duration-500 group-hover/add:rotate-90" />
                  <span>Add lecture</span>
                </button>
              </div>
            </details>
          );
        })}
      </div>

      {/* modals */}
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