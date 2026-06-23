import React from 'react'
import { useSelector } from 'react-redux'
import { useNavigate, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { LogIn, Lock } from 'lucide-react'

function SignInPrompt() {
  const navigate = useNavigate()
  const location = useLocation()

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: [0.23, 1, 0.32, 1] }}
        className="w-full max-w-sm rounded-3xl border border-slate-200 bg-white p-8 text-center"
      >
        <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
          <Lock size={22} />
        </div>
        <h2 className="text-lg font-black text-slate-900">Sign in to continue</h2>
        <p className="mt-2 text-sm text-slate-400">
          You need an account to access this page.
        </p>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => navigate('/login', { state: { from: location } })}
          className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 py-3 text-sm font-bold text-white transition-colors"
        >
          <LogIn size={16} />
          Sign In
        </motion.button>

        <button
          onClick={() => navigate('/signup')}
          className="mt-3 text-xs font-bold text-slate-400 hover:text-slate-700 transition-colors"
        >
          Don't have an account? Sign up
        </button>
      </motion.div>
    </div>
  )
}

const PrivateRoute = ({ children }) => {
  const { token } = useSelector((state) => state.auth)

  if (token) {
    return children
  }

  return <SignInPrompt />
}

export default PrivateRoute