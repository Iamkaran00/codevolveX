import React from 'react'
import { useSelector } from 'react-redux'
import { Outlet } from 'react-router-dom'
import Sidebar from '../components/core/Dashboard/Sidebar'

const Dashboard = () => {
  const { loading: authLoading } = useSelector((state) => state.auth)
  const { loading: profileLoading } = useSelector((state) => state.profile)

  if (authLoading || profileLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50">
        {/* Placeholder for a better skeleton loader later */}
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
      </div>
    )
  }

  return (
     

  <div className="relative flex min-h-[calc(100vh-4rem)] pt-16 bg-slate-50 text-slate-900">
    <Sidebar />

    <div className="h-[calc(100vh-4rem)] flex-1 overflow-auto bg-slate-50">
      <div className="mx-auto w-11/12 max-w-[1000px] py-10">
        <Outlet />
      </div>
    </div>
  </div>
);
  
}

export default Dashboard