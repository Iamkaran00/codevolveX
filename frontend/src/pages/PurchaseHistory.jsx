import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { Receipt, Calendar, Download } from 'lucide-react'

import { getPurchaseHistory } from '../services/operations/profileApi'
import { generateReceipt } from '../utils/generatePDF'
const PurchaseHistory = () => {
  const { token } = useSelector((state) => state.auth)
  const { user } = useSelector((state) => state.profile)
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      setLoading(true)
      const data = await getPurchaseHistory(token)
      setOrders(data || [])
      setLoading(false)
    }
    if (token) load()
  }, [token])

  return (
    <div className="w-full">
      <div className="mb-8 border-b border-slate-200 pb-5">
        <h1 className="text-2xl font-black tracking-tight text-slate-900">Purchase History</h1>
        <p className="mt-1 text-sm font-medium text-slate-400">
          A record of every course you've purchased.
        </p>
      </div>

      {loading ? (
        <div className="flex flex-col gap-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-20 rounded-2xl bg-slate-100 animate-pulse" />
          ))}
        </div>
      ) : orders.length === 0 ? (
        <div className="flex h-[240px] flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white text-center">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-500">
            <Receipt size={22} />
          </div>
          <h3 className="text-base font-bold text-slate-900">No purchases yet</h3>
          <p className="text-sm text-slate-400 mt-1">Your transaction history will appear here.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {orders.map((order) => (
            <div
              key={order._id}
              className="rounded-2xl border border-slate-200 bg-white p-5"
            >
              <div className="flex items-center justify-between gap-4 mb-3">
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">
                  <Calendar size={13} />
                  {new Date(order.createdAt).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </div>
                <span className="text-lg font-black text-slate-900">
                  ₹{order.amount?.toLocaleString("en-IN")}
                </span>
              </div>

              <div className="flex flex-col gap-2">
                {order.courses?.map((course) => (
                  <div key={course._id} className="flex items-center gap-3">
                    <img
                      src={course.thumbnail}
                      alt={course.courseName}
                      className="h-10 w-14 rounded-lg object-cover border border-slate-100 shrink-0"
                    />
                    <p className="text-sm font-bold text-slate-700 truncate">
                      {course.courseName}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-4 flex items-center justify-between gap-3 border-t border-slate-100 pt-4">
                <p className="text-[11px] font-mono text-black truncate">
                  Payment ID: {order.razorpay_payment_id}
                </p>
                <button
                  onClick={() => generateReceipt(order, user)}
                  className="flex items-center gap-1.5 shrink-0 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-bold text-slate-600 hover:bg-slate-50 hover:border-indigo-200 transition-colors"
                >
                  <Download size={13} />
                  Receipt
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default PurchaseHistory