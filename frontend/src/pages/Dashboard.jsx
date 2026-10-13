import React from "react"
import { useSelector } from "react-redux"
import { Outlet } from "react-router-dom"
import Sidebar from "../components/core/Dashboard/Sidebar"

const Dashboard = () => {
  const { loading: authLoading } = useSelector((state) => state.auth)
  const { loading: profileLoading } = useSelector((state) => state.profile)

  if (authLoading || profileLoading) {
    return (
      <div
        role="status"
        aria-label="Loading"
        className="flex h-screen items-center justify-center bg-[#100f0d]"
      >
        <span className="h-10 w-10 animate-spin rounded-full border-2 border-white/10 border-t-[#ffb454]" />
      </div>
    )
  }

  return (
    <div className="relative flex min-h-screen bg-[#100f0d] pt-16 text-[#f3ece0]">
      <Sidebar />

      {/* each page brings its own padding and max width */}
      <main className="h-[calc(100vh-4rem)] min-w-0 flex-1 overflow-y-auto bg-[#100f0d] [scrollbar-color:rgba(255,255,255,0.12)_transparent] [scrollbar-width:thin]">
        <Outlet />
      </main>
    </div>
  )
}

export default Dashboard