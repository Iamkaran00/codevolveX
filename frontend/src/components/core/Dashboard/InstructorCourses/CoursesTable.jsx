import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { DataGrid } from "@mui/x-data-grid";
import { FiEdit2 } from "react-icons/fi";
import { HiClock } from "react-icons/hi";
import { FaCheck } from "react-icons/fa";
import { RiDeleteBin6Line } from "react-icons/ri";

import { formatDate } from "../../../../services/formateDate";
import { deleteCourse,fetchInstructorCourses } from "../../../../services/operations/courseApi";
import { COURSE_STATUS } from "../../../../utils/constants";
import ConfirmationModal from "../../../common/ConfirmationModal";

export default function CoursesTable({ courses, setCourses }) {
  const navigate = useNavigate();
  const { token } = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(false);
  const [confirmationModal, setConfirmationModal] = useState(null);

  const handleCourseDelete = async (courseId) => {
    setLoading(true);
    await deleteCourse({ courseId: courseId }, token);
    const result = await fetchInstructorCourses(token);
    if (result) {
      setCourses(result);
    }
    setConfirmationModal(null);
    setLoading(false);
  };

  // --- MUI DATAGRID COLUMN DEFINITIONS ---
  const columns = [
    {
      field: "courseInfo",
      headerName: "Courses",
      flex: 2,
      minWidth: 380,
      renderCell: (params) => {
        const course = params.row;
        return (
          <div className="flex items-center gap-x-4 py-2 w-full h-full">
            <img
              src={course?.thumbnail}
              alt={course?.courseName}
              className="h-[64px] w-[110px] rounded-xl object-cover border border-slate-100 shadow-sm shrink-0"
            />
            <div className="flex flex-col justify-center truncate">
              <p className="text-sm font-bold text-slate-900 truncate">
                {course.courseName}
              </p>
              <p className="text-xs font-medium text-slate-400 line-clamp-1 mt-0.5 max-w-[240px]">
                {course.courseDescription}
              </p>
              <p className="text-[10px] text-slate-400 font-semibold mt-1">
                Created: {formatDate(course.createdAt)}
              </p>
            </div>
          </div>
        );
      },
    },
    {
      field: "status",
      headerName: "Status",
      flex: 0.8,
      minWidth: 130,
      renderCell: (params) => {
        const status = params.value;
        return (
          <div className="flex items-center h-full">
            {status === COURSE_STATUS.DRAFT ? (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-2.5 py-1 text-xs font-bold text-slate-600 border border-slate-200">
                <HiClock className="text-sm" />
                Drafted
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-700 border border-emerald-200">
                <FaCheck className="text-[10px]" />
                Published
              </span>
            )}
          </div>
        );
      },
    },
    {
      field: "price",
      headerName: "Price",
      flex: 0.6,
      minWidth: 100,
      renderCell: (params) => (
        <span className="text-sm font-bold text-slate-900 h-full flex items-center">
          ₹{params.value}
        </span>
      ),
    },
    {
      field: "actions",
      headerName: "Actions",
      flex: 0.6,
      minWidth: 100,
      sortable: false,
      renderCell: (params) => {
        const course = params.row;
        return (
          <div className="flex items-center gap-x-2 h-full">
            <button
              disabled={loading}
              onClick={() => navigate(`/dashboard/edit-course/${course._id}`)}
              title="Edit"
              className="p-1.5 rounded-lg border border-slate-200 bg-white text-slate-600 transition-all hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-200"
            >
              <FiEdit2 size={15} />
            </button>
            <button
              disabled={loading}
              onClick={() => {
                setConfirmationModal({
                  text1: "Do you want to delete this course?",
                  text2: "All the data related to this course will be permanently deleted.",
                  btn1Text: !loading ? "Delete" : "Loading...",
                  btn2Text: "Cancel",
                  btn1Handler: !loading ? () => handleCourseDelete(course._id) : () => {},
                  btn2Handler: !loading ? () => setConfirmationModal(null) : () => {},
                });
              }}
              title="Delete"
              className="p-1.5 rounded-lg border border-red-100 bg-red-50/60 text-red-600 transition-all hover:bg-red-100"
            >
              <RiDeleteBin6Line size={15} />
            </button>
          </div>
        );
      },
    },
  ];

  // Map courses array into rows matching DataGrid structural node properties
  const rows = courses?.map((course) => ({
    id: course._id, // DataGrid explicitly requires a unique primitive ID field field
    ...course,
  })) || [];

  return (
    <div className="w-full bg-white rounded-2xl border border-slate-200 shadow-md overflow-hidden p-1">
      <DataGrid
        rows={rows}
        columns={columns}
        rowHeight={90}
        loading={loading}
        initialState={{
          pagination: { paginationModel: { pageSize: 5 } },
        }}
        pageSizeOptions={[5, 10, 20]}
        disableSelectionOnClick
        autoHeight
        sx={{
          border: "none",
          fontFamily: "inherit",
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: "#f8fafc", // slate-50 styling
            borderBottom: "1px solid #e2e8f0",
            color: "#64748b", // slate-500 text
            fontWeight: "700",
            textTransform: "uppercase",
            fontSize: "11px",
            letterSpacing: "0.05em",
          },
          "& .MuiDataGrid-row": {
            borderBottom: "1px solid #f1f5f9",
            "&:hover": {
              backgroundColor: "#f8fafc/60",
            },
          },
          "& .MuiDataGrid-cell": {
            borderBottom: "none",
            display: "flex",
            alignItems: "center",
            outline: "none !important",
          },
          "& .MuiTablePagination-root": {
            color: "#64748b",
            fontSize: "12px",
          },
        }}
      />

      {confirmationModal && <ConfirmationModal modalData={confirmationModal} />}
    </div>
  );
}