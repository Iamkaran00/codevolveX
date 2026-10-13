import React, { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { AiOutlineCaretDown } from "react-icons/ai";
import { VscSignOut, VscAccount } from "react-icons/vsc";
import { HiArrowUpRight } from "react-icons/hi2";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

import { logout } from "../../../services/operations/authAPI";
import useOnClickOutside from "../../../hooks/useOnClickOutside";

const EASE = [0.23, 1, 0.32, 1];

const display = "font-['Space_Grotesk',ui-sans-serif,system-ui,sans-serif]";
const mono = "font-['JetBrains_Mono',ui-monospace,monospace]";

const GRAIN = `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.8' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>")`;

const Avatar = ({ user, className }) =>
  user?.image ? (
    <img
      src={user.image}
      alt={`profile-${user?.firstName}`}
      className={`aspect-square rounded-full object-cover ${className}`}
    />
  ) : (
    <span
      className={`flex aspect-square items-center justify-center rounded-full bg-[#2a2112] font-semibold text-[#ffb454] ${display} ${className}`}
    >
      {`${user?.firstName?.charAt(0) || ""}${user?.lastName?.charAt(0) || ""}` || "?"}
    </span>
  );

const ProfileDropdown = () => {
  const { user } = useSelector((state) => state.profile);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useOnClickOutside(ref, () => setOpen(false));

  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  if (!user) return null;

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((prev) => !prev)}
        aria-haspopup="menu"
        aria-expanded={open}
        className={`group flex cursor-pointer items-center gap-2 rounded-full border p-1 pr-2.5 outline-none transition-all duration-500 focus-visible:border-[#ffb454] ${
          open
            ? "border-[#ffb454]/60 bg-[#ffb454]/10"
            : "border-white/10 hover:border-[#ffb454]/40"
        }`}
      >
        <Avatar
          user={user}
          className="w-9 ring-1 ring-white/10 transition-all duration-500 group-hover:ring-[#ffb454]/60"
        />
        <AiOutlineCaretDown
          className={`text-xs text-zinc-500 transition-all duration-500 group-hover:text-[#ffb454] ${
            open ? "rotate-180 text-[#ffb454]" : "rotate-0"
          }`}
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            role="menu"
            onClick={(e) => e.stopPropagation()}
            initial={{ opacity: 0, y: -8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.97 }}
            transition={{ duration: 0.35, ease: EASE }}
            className="absolute right-0 top-[120%] z-[1000] mt-1 w-64 origin-top-right overflow-hidden rounded-2xl border border-white/[0.09] bg-[#14130f] shadow-[0_24px_60px_-20px_rgba(0,0,0,0.8)]"
          >
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 opacity-[0.06] mix-blend-overlay"
              style={{ backgroundImage: GRAIN }}
            />
            <div
              aria-hidden
              className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-[#ffb454]/10 blur-2xl"
            />

            {/* user */}
            <div className="relative flex items-center gap-3 border-b border-white/[0.07] px-4 py-4">
              <Avatar user={user} className="w-11 ring-1 ring-[#ffb454]/40" />
              <div className="min-w-0">
                <p
                  className={`truncate text-[15px] font-semibold tracking-tight text-[#f3ece0] ${display}`}
                >
                  {user?.firstName} {user?.lastName}
                </p>
                <p className={`mt-0.5 truncate text-[11px] text-zinc-500 ${mono}`}>
                  {user?.email}
                </p>
              </div>
            </div>

            {user?.accountType && (
              <div className="relative flex items-center gap-2 px-4 pt-3">
                <span className="h-1.5 w-1.5 rounded-full bg-[#ffb454]" />
                <span className={`text-[10px] uppercase tracking-[0.2em] text-zinc-500 ${mono}`}>
                  {user.accountType}
                </span>
              </div>
            )}

            {/* links */}
            <div className="relative p-2">
              <Link to="/my-profile" role="menuitem" onClick={() => setOpen(false)}>
                <div className="group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-zinc-300 transition-all duration-500 hover:bg-white/[0.04] hover:text-[#ffb454]">
                  <VscAccount className="text-lg text-zinc-500 transition-colors duration-500 group-hover:text-[#ffb454]" />
                  <span className="flex-1">My Profile</span>
                  <HiArrowUpRight className="text-zinc-600 transition-all duration-500 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-[#ffb454]" />
                </div>
              </Link>

              <button
                role="menuitem"
                onClick={() => {
                  dispatch(logout(navigate));
                  setOpen(false);
                }}
                className="group flex w-full cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm text-zinc-400 transition-all duration-500 hover:bg-[#e0816f]/10 hover:text-[#e0816f]"
              >
                <VscSignOut className="text-lg text-zinc-500 transition-colors duration-500 group-hover:text-[#e0816f]" />
                Logout
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProfileDropdown;