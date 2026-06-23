import React, { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { motion } from "framer-motion"
import { FaStar } from "react-icons/fa"
import ReactStars from "react-rating-stars-component"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts"
import { IndianRupee, Users, BookOpen, TrendingUp, Award } from "lucide-react"

import { getInstructorDashboardStats } from "../services/operations/courseApi"

function StatCard({ icon: Icon, label, value, accent }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.23, 1, 0.32, 1] }}
      className="rounded-2xl border border-slate-200 bg-white p-5"
    >
      <div className={`mb-3 flex h-10 w-10 items-center justify-center rounded-xl ${accent}`}>
        <Icon size={18} />
      </div>
      <p className="text-2xl font-black text-slate-900 tracking-tight">{value}</p>
      <p className="mt-1 text-xs font-bold text-slate-400 uppercase tracking-wider">{label}</p>
    </motion.div>
  )
}

function TopCard({ title, course, metric }) {
  if (!course) return null
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5">
      <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">
        {title}
      </p>
      <div className="flex items-center gap-3">
        <img
          src={course.thumbnail}
          alt={course.courseName}
          className="h-12 w-16 rounded-lg object-cover border border-slate-100 shrink-0"
        />
        <div className="min-w-0">
          <p className="text-sm font-bold text-slate-900 truncate">{course.courseName}</p>
          <p className="text-xs font-semibold text-indigo-600 mt-0.5">{metric}</p>
        </div>
      </div>
    </div>
  )
}

export default function InstructorDashboard() {
  const { token } = useSelector((state) => state.auth)
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      setLoading(true)
      const data = await getInstructorDashboardStats(token)
      setStats(data)
      setLoading(false)
    }
    if (token) load()
  }, [token])

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-28 rounded-2xl bg-slate-100 animate-pulse" />
        ))}
      </div>
    )
  }

  if (!stats || stats.totalCourses === 0) {
    return (
      <div className="flex h-[240px] flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white text-center">
        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-500">
          <BookOpen size={22} />
        </div>
        <h3 className="text-base font-bold text-slate-900">No data yet</h3>
        <p className="text-sm text-slate-400 mt-1">
          Create a course and get your first enrollment to see analytics here.
        </p>
      </div>
    )
  }

  const chartData = stats.courseStats
    .filter((c) => c.revenue > 0 || c.studentsEnrolled > 0)
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 8)
    .map((c) => ({
      name: c.courseName.length > 18 ? c.courseName.slice(0, 18) + "…" : c.courseName,
      revenue: c.revenue,
    }))

  return (
    <div className="w-full">
      <div className="mb-8 border-b border-slate-200 pb-5">
        <h1 className="text-2xl font-black tracking-tight text-slate-900">Dashboard</h1>
        <p className="mt-1 text-sm font-medium text-slate-400">
          Income, enrollment, and performance across your courses.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <StatCard
          icon={IndianRupee}
          label="Total Revenue"
          value={`₹${stats.totalRevenue.toLocaleString("en-IN")}`}
          accent="bg-emerald-50 text-emerald-600"
        />
        <StatCard
          icon={Users}
          label="Total Students"
          value={stats.totalStudents.toLocaleString("en-IN")}
          accent="bg-indigo-50 text-indigo-600"
        />
        <StatCard
          icon={BookOpen}
          label="Total Courses"
          value={stats.totalCourses}
          accent="bg-violet-50 text-violet-600"
        />
      </div>

      {chartData.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
          className="rounded-2xl border border-slate-200 bg-white p-6 mb-8"
        >
          <h2 className="text-sm font-black text-slate-900 mb-5">Revenue by Course</h2>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={chartData} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
              <CartesianGrid vertical={false} stroke="#f1f5f9" />
              <XAxis
                dataKey="name"
                tick={{ fontSize: 11, fill: "#94a3b8" }}
                axisLine={{ stroke: "#e2e8f0" }}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 11, fill: "#94a3b8" }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v) => `₹${v >= 1000 ? `${v / 1000}k` : v}`}
              />
              <Tooltip
                cursor={{ fill: "#f8fafc" }}
                formatter={(value) => [`₹${value.toLocaleString("en-IN")}`, "Revenue"]}
                contentStyle={{
                  borderRadius: 12,
                  border: "1px solid #e2e8f0",
                  fontSize: 12,
                  fontWeight: 600,
                }}
              />
              <Bar dataKey="revenue" fill="#4338ca" radius={[8, 8, 0, 0]} maxBarSize={48} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <TopCard
          title="Top Earner"
          course={stats.topByRevenue}
          metric={`₹${stats.topByRevenue?.revenue?.toLocaleString("en-IN")} earned`}
        />
        <TopCard
          title="Most Enrolled"
          course={stats.topByEnrollment}
          metric={`${stats.topByEnrollment?.studentsEnrolled} students`}
        />
        <TopCard
          title="Highest Rated"
          course={stats.topByRating}
          metric={
            stats.topByRating
              ? `${stats.topByRating.averageRating.toFixed(1)} · ${stats.topByRating.reviewCount} reviews`
              : "No reviews yet"
          }
        />
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden">
        <div className="border-b border-slate-100 px-6 py-4">
          <h2 className="text-xs font-black text-slate-400 uppercase tracking-widest">
            All Courses
          </h2>
        </div>
        <div className="divide-y divide-slate-50">
          {stats.courseStats.map((course) => (
            <div key={course._id} className="flex items-center gap-4 px-6 py-4">
              <img
                src={course.thumbnail}
                alt={course.courseName}
                className="h-12 w-16 rounded-lg object-cover border border-slate-100 shrink-0"
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-slate-900 truncate">{course.courseName}</p>
                <div className="flex items-center gap-1.5 mt-1">
                  {course.reviewCount > 0 ? (
                    <>
                      <ReactStars
                        count={5}
                        value={course.averageRating}
                        size={12}
                        edit={false}
                        activeColor="#f59e0b"
                        emptyIcon={<FaStar />}
                        fullIcon={<FaStar />}
                      />
                      <span className="text-[11px] font-semibold text-slate-400">
                        ({course.reviewCount})
                      </span>
                    </>
                  ) : (
                    <span className="text-[11px] font-semibold text-slate-300">No reviews</span>
                  )}
                </div>
              </div>
              <div className="text-right shrink-0">
                <p className="text-sm font-black text-slate-900">
                  ₹{course.revenue.toLocaleString("en-IN")}
                </p>
                <p className="text-[11px] font-semibold text-slate-400">
                  {course.studentsEnrolled} students
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}