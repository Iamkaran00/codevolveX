import React, { useRef, useState } from "react";
import { AiOutlineCaretDown } from "react-icons/ai";
import { VscDashboard, VscSignOut } from "react-icons/vsc";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

import { logout } from "../../../services/operations/authAPI";
import useOnClickOutside from "../../../hooks/useOnClickOutside";

const ProfileDropdown = () => {
  const { user } = useSelector((state) => state.profile);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  useOnClickOutside(ref, () => setOpen(false));
  if (!user) return null;
  return (
    <div className="relative" ref={ref}>
      
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="flex items-center gap-x-2 rounded-full border border-transparent p-1 transition-all duration-200 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
      >
        <img
          src={user?.image}
          alt={`profile-${user?.firstName}`}
          className="aspect-square w-9 rounded-full object-cover shadow-sm ring-1 ring-gray-200"
        />
        <AiOutlineCaretDown
          className={`text-sm text-gray-500 transition-transform duration-300 ${
            open ? "rotate-180" : "rotate-0"
          }`}
        />
      </button>

      {/* Dropdown Menu */}
      {open && (
        <div
          onClick={(e) => e.stopPropagation()}
          className="absolute right-0 top-[120%] z-[1000] mt-1 w-56 origin-top-right divide-y divide-gray-100 overflow-hidden rounded-xl border border-gray-100 bg-white shadow-xl ring-1 ring-black/5 transition-all"
        >
          {/* User Info Header */}
          <div className="px-4 py-3 bg-gray-50/50">
            <p className="text-sm font-semibold text-gray-900 truncate">
              {user?.firstName} {user?.lastName}
            </p>
            <p className="text-xs text-gray-500 truncate mt-0.5">
              {user?.email}
            </p>
          </div>

          {/* Links Section */}
          <div className="py-1">
            <Link to="/dashboard/my-profile" onClick={() => setOpen(false)}>
              <div className="flex w-full items-center gap-x-3 px-4 py-2.5 text-sm font-medium text-gray-700 transition-colors duration-200 hover:bg-blue-50 hover:text-blue-600">
                <VscDashboard className="text-lg" />
                Dashboard
              </div>
            </Link>
          </div>

        
          <div className="py-1 ">
            <button
              onClick={() => {
                dispatch(logout(navigate));
                setOpen(false);
              }}
              className="flex  cursor-pointer w-full items-center gap-x-3 px-4 py-2.5 text-sm font-medium text-black/60 transition-colors duration-200 bg-red-500/70 rounded hover:text-white"
            >
              <VscSignOut className="text-lg text-white" />
              <p className="text-white text-sm">Logout</p>
             
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileDropdown;