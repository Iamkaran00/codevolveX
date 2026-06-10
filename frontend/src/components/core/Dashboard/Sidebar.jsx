import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { VscSignOut, VscSettingsGear, VscAccount } from "react-icons/vsc";

import { sidebarLinks } from "../../../data/DashboardLink";
import { logout } from "../../../services/operations/authAPI";
import SidebarLink from "./SidebarLink";
import ConfirmationModal from "../../common/ConfirmationModal";

const Sidebar = () => {
  const { user, loading: profileLoading } = useSelector((state) => state.profile);
  const { loading: authLoading } = useSelector((state) => state.auth);
  
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [confirmationModal, setConfirmationModal] = useState(null);

  if (authLoading || profileLoading) return null;

  return (
    <>
      {/* Sidebar Shell: Clean white background with a sharp slate border for separation */}
      <div className="flex h-[calc(100vh-3.5rem)] min-w-[240px] flex-col border-r border-slate-200 bg-white py-6 justify-between">
        
        <div className="flex flex-col w-full">
           
          {user && (
            <div className="mx-4 mb-6 rounded-xl border border-slate-100 bg-slate-50/50 p-4 shadow-sm">
              <div className="flex items-center gap-x-3">
                <img 
                  src={user?.image} 
                  alt="profile" 
                  className="h-9 w-9 rounded-full object-cover border border-slate-200 shadow-sm"
                />
                <div className="flex flex-col truncate">
                  <p className="text-sm font-semibold text-slate-800 truncate">
                    {user?.firstName} {user?.lastName}
                  </p>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-600 mt-0.5">
                    {user?.accountType} Portal
                  </span>
                </div>
              </div>
            </div>
          )}
 
          <div className="flex flex-col gap-y-1 w-full">
            <p className="px-6 mb-2 text-[10px] font-bold uppercase tracking-widest text-slate-400">
              Navigation
            </p>
            {sidebarLinks.map((link) => {
              // Strictly filters out links meant for the other account type
              if (link.type && user?.accountType !== link.type) return null;
              return <SidebarLink key={link.id} link={link} iconName={link.icon} />;
            })}
          </div>
        </div>

        <div className="flex flex-col w-full">
          <div className="mx-6 my-4 h-[1px] bg-slate-100"></div>
          
          <p className="px-6 mb-2 text-[10px] font-bold uppercase tracking-widest text-slate-400">
            Options
          </p>

          <div className="flex flex-col gap-y-1 w-full">
             
            
             
            <button
              onClick={() =>
                setConfirmationModal({
                  text1: "Are you sure?",
                  text2: "You will be logged out of your Account.",
                  btn1Text: "Logout",
                  btn2Text: "Cancel",
                  btn1Handler: () => dispatch(logout(navigate)),
                  btn2Handler: () => setConfirmationModal(null),
                })
              }
              className="flex items-center cursor-pointer gap-x-3 px-6 py-2.5 text-sm font-medium text-slate-500 transition-all hover:text-red-600 hover:bg-red-50/50 group"
            >
              <VscSignOut className="text-lg text-slate-400 group-hover:text-red-500 transition-colors" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>

      {confirmationModal && <ConfirmationModal modalData={confirmationModal} />}
    </>
  );
};

export default Sidebar;