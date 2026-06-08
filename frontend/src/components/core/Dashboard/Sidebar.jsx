import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { VscSignOut, VscSettingsGear } from "react-icons/vsc";

import { sidebarLinks } from "../../../data/DashboardLink";
import { logout } from "../../../services/operations/authAPI";
import SidebarLink from "./SidebarLink";
import ConfirmationModal from "../../common/ConfirmationModal"; // Assuming you have this component

const Sidebar = () => {
  const { user, loading: profileLoading } = useSelector((state) => state.profile);
  const { loading: authLoading } = useSelector((state) => state.auth);
  
  const dispatch = useDispatch(); // Fixed typo
  const navigate = useNavigate();
  const [confirmationModal, setConfirmationModal] = useState(null);

  if (authLoading || profileLoading) return null;

  return (
    <>
      <div className="flex h-[calc(100vh-3.5rem)] min-w-[220px] flex-col border-r border-slate-200 bg-white py-10">
        
        {/* Primary Links */}
        <div className="flex flex-col gap-y-1">
          {sidebarLinks.map((link) => {
            if (link.type && user?.accountType !== link.type) return null;
            return <SidebarLink key={link.id} link={link} iconName={link.icon} />;
          })}
        </div>

        {/* Divider */}
        <div className="mx-auto mt-6 mb-6 h-[1px] w-10/12 bg-slate-200"></div>

        {/* Secondary Links (Settings & Logout) */}
        <div className="flex flex-col gap-y-1">
          <SidebarLink
            link={{ name: "Settings", path: "/dashboard/settings" }}
            iconName="VscSettingsGear"
          />
          
          {/* Fixed Button implementation */}
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
            className="flex items-center gap-x-3 px-6 py-2 text-sm font-medium text-slate-500 transition-all hover:text-slate-900"
          >
            <VscSignOut className="text-lg" />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {confirmationModal && <ConfirmationModal modalData={confirmationModal} />}
    </>
  );
};

export default Sidebar;