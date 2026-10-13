import React from "react"
import * as Icons from "react-icons/vsc"
import { NavLink, matchPath, useLocation } from "react-router-dom"
import { motion, useReducedMotion } from "framer-motion"

const display = "font-['Space_Grotesk',ui-sans-serif,system-ui,sans-serif]"

export default function SidebarLink({ link, iconName }) {
  const Icon = Icons[iconName]
  const location = useLocation()
  const reduce = useReducedMotion()
  const active = !!matchPath({ path: link.path }, location.pathname)

  return (
    <NavLink
      to={link.path}
      aria-current={active ? "page" : undefined}
      className="group relative flex items-center gap-3.5 rounded-full px-4 py-2.5 outline-none focus-visible:ring-1 focus-visible:ring-[#ffb454]/70"
    >
      {/* one highlight that slides between links as the route changes */}
      {active && (
        <motion.span
          layoutId="dashboard-active-link"
          transition={reduce ? { duration: 0 } : { type: "spring", stiffness: 380, damping: 34 }}
          className="absolute inset-0 rounded-full border border-[#ffb454]/25 bg-[#ffb454]/[0.08]"
        />
      )}

      <span
        className={`relative flex h-8 w-8 shrink-0 items-center justify-center rounded-full border transition-all duration-500 ${
          active
            ? "border-[#ffb454] bg-[#ffb454] text-[#1d1a16]"
            : "border-white/10 text-zinc-500 group-hover:border-[#ffb454]/50 group-hover:text-[#ffb454]"
        }`}
      >
        {Icon && <Icon className="text-[15px]" />}
      </span>

      <span
        className={`relative truncate text-[15px] transition-colors duration-500 ${display} ${
          active
            ? "font-medium text-[#f3ece0]"
            : "text-zinc-400 group-hover:text-[#f3ece0]"
        }`}
      >
        {link.name}
      </span>
    </NavLink>
  )
}