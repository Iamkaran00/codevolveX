import React from 'react';
import * as Icons from 'react-icons/vsc';
import { NavLink, useLocation, matchPath } from 'react-router-dom';
import { motion } from 'framer-motion';

const SidebarLink = ({ link, iconName }) => {
  const Icon = Icons[iconName];
  const location = useLocation();

  const matchRoute = (route) => {
    return matchPath({ path: route }, location.pathname);
  };

  const isActive = matchRoute(link.path);

  return (
    <NavLink
      to={link.path}
      className={`relative flex items-center gap-x-3 px-6 py-2.5 text-sm font-medium transition-all duration-200
        ${isActive ? "text-blue-600 bg-blue-50" : "text-slate-500 hover:text-slate-900 hover:bg-slate-50"}
      `}
    >
      {/* Animated Active Indicator */}
      {isActive && (
        <motion.span
          layoutId="active-sidebar-indicator"
          className="absolute left-0 top-0 h-full w-[4px] bg-blue-600 rounded-r-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2 }}
        />
      )}
      
      {Icon && <Icon className="text-lg" />}
      <span>{link.name}</span>
    </NavLink>
  );
};

export default SidebarLink;