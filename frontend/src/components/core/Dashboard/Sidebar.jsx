import React, { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import { LayoutGroup } from "framer-motion"
import { VscSignOut } from "react-icons/vsc"

import { sidebarLinks } from "../../../data/DashboardLink"
import { logout } from "../../../services/operations/authAPI"
import SidebarLink from "./SidebarLink"
import ConfirmationModal from "../../common/ConfirmationModal"

const display = "font-['Space_Grotesk',ui-sans-serif,system-ui,sans-serif]"
const mono = "font-['JetBrains_Mono',ui-monospace,monospace]"

const GRAIN = `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.8' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>")`

const Sidebar = () => {
  const { user, loading: profileLoading } = useSelector((state) => state.profile)
  const { loading: authLoading } = useSelector((state) => state.auth)

  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [confirmationModal, setConfirmationModal] = useState(null)

  if (authLoading || profileLoading) return null

  const initials = `${user?.firstName?.[0] ?? ""}${user?.lastName?.[0] ?? ""}`

  return (
    <>
      <aside className="relative flex h-[calc(100vh-4rem)] min-w-[260px] shrink-0 flex-col justify-between overflow-hidden border-r border-white/[0.07] bg-[#100f0d] px-4 py-6">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.06] mix-blend-overlay"
          style={{ backgroundImage: GRAIN }}
        />

        <div className="relative flex flex-col">
           
          

          {/* navigation */}
          <nav aria-label="Dashboard">
            <p className={`mb-3 px-4 text-[11px] text-zinc-600 ${mono}`}>Dashboard</p>
            <LayoutGroup id="dashboard-nav">
              <ul className="flex flex-col gap-1">
                {sidebarLinks.map((link) => {
                  // only show links meant for this account type
                  if (link.type && user?.accountType !== link.type) return null
                  return (
                    <li key={link.id}>
                      <SidebarLink link={link} iconName={link.icon} />
                    </li>
                  )
                })}
              </ul>
            </LayoutGroup>
          </nav>
        </div>

        {/* account */}
        <div className="relative border-t border-white/[0.07] pt-5">
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
            className="group flex w-full cursor-pointer items-center gap-3.5 rounded-full px-4 py-2.5 text-left outline-none transition-colors duration-500 hover:bg-[#e0816f]/[0.06] focus-visible:ring-1 focus-visible:ring-[#e0816f]/70"
          >
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-white/10 text-zinc-500 transition-all duration-500 group-hover:border-[#e0816f]/50 group-hover:text-[#e0816f]">
              <VscSignOut className="text-[15px]" />
            </span>
            <span
              className={`text-[15px] text-zinc-400 transition-colors duration-500 group-hover:text-[#e0816f] ${display}`}
            >
              Log out
            </span>
          </button>
        </div>
      </aside>

      {confirmationModal && <ConfirmationModal modalData={confirmationModal} />}
    </>
  )
}

export default Sidebar