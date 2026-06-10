import { ACCOUNT_TYPE } from "../utils/constants";

export const sidebarLinks = [
 // for students
  {
    id: 1,
    name: "Enrolled Courses",
    path: "/dashboard/enrolled-courses",
    type: ACCOUNT_TYPE.STUDENT,
    icon: "VscMortarBoard",
  },
  {
    id: 2,
    name: "Purchase History",
    path: "/dashboard/purchase-history",
    type: ACCOUNT_TYPE.STUDENT,
    icon: "VscCircleFilled",
  },
  {
    id: 3,
    name: "Your Cart",
    path: "/dashboard/mycart",
    type: ACCOUNT_TYPE.STUDENT,
    icon: "VscHistory",
  },
  // for instructors ->
  {
    id: 4,
    name: "Dashboard",
    path: "/dashboard/instructor",
    type: ACCOUNT_TYPE.INSTRUCTOR,
    icon: "VscDashboard",
  },
  {
    id: 5,
    name: "My Courses",
    path: "/dashboard/my-courses",
    type: ACCOUNT_TYPE.INSTRUCTOR,
    icon: "VscVm",
  },
  {
    id: 6,
    name: "Add Course",
    path: "/dashboard/add-course",
    type: ACCOUNT_TYPE.INSTRUCTOR,
    icon: "VscAdd",
  },
];