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
      className={`relative flex items-center gap-x-3 px-6 py-2.5 text-sm font-semibold transition-all duration-200 group
        ${isActive 
          ? "text-indigo-600 bg-indigo-50/60 font-bold" 
          : "text-slate-500 hover:text-slate-900 hover:bg-slate-50/80"
        }
      `}
    >
      {isActive && (
        <motion.span
          layoutId="active-sidebar-indicator"
          className="absolute left-0 top-0 h-full w-[3.5px] bg-indigo-600 rounded-r-full shadow-[0_0_8px_rgba(79,70,229,0.4)]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2 }}
        />
      )}
      {Icon && (
        <Icon 
          className={`text-lg transition-transform duration-200 group-hover:scale-105 
            ${isActive ? "text-indigo-600" : "text-slate-400 group-hover:text-slate-600"}`} 
        />
      )}
      
      <span className="tracking-wide">{link.name}</span>
    </NavLink>
  );
};

export default SidebarLink;