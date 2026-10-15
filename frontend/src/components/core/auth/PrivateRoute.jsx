import React from 'react'
import { useSelector } from 'react-redux'
import { useNavigate, useLocation } from 'react-router-dom'
import { motion, useReducedMotion } from 'framer-motion'
import { LogIn, Lock } from 'lucide-react'

const EASE = [0.23, 1, 0.32, 1]

const display = "font-['Space_Grotesk',ui-sans-serif,system-ui,sans-serif]"
const mono = "font-['JetBrains_Mono',ui-monospace,monospace]"

const GRAIN = `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.8' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>")`

const container = { hidden: {}, show: { transition: { staggerChildren: 0.12 } } }
const item = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.9, ease: EASE } },
}

function SignInPrompt() {
  const navigate = useNavigate()
  const location = useLocation()
  const reduce = useReducedMotion()

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#100f0d] px-5">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.06] mix-blend-overlay"
        style={{ backgroundImage: GRAIN }}
      />

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="relative flex w-full max-w-md flex-col items-center text-center"
      >
        <motion.p
          variants={item}
          className={`mb-12 text-2xl font-semibold tracking-tight text-[#f3ece0] ${display}`}
        >
          codevolve<span className="text-[#ffb454]">X</span>
        </motion.p>

        <motion.div variants={item}>
          <motion.div
            animate={reduce ? undefined : { y: [0, -6, 0] }}
            transition={{ duration: 6, ease: 'easeInOut', repeat: Infinity }}
            className="relative flex h-20 w-20 items-center justify-center rounded-full border border-white/10 bg-white/[0.02]"
          >
            <span className="absolute inset-2 rounded-full border border-dashed border-[#ffb454]/30" />
            <Lock size={24} className="text-[#ffb454]" />
          </motion.div>
        </motion.div>

        <motion.h2
          variants={item}
          className={`mt-9 text-4xl font-semibold leading-[1.05] tracking-tight text-[#f3ece0] sm:text-5xl ${display}`}
        >
          Sign in to
          <br />
          continue<span className="text-[#ffb454]">.</span>
        </motion.h2>

        <motion.p variants={item} className="mt-5 max-w-xs text-[15px] leading-relaxed text-zinc-500">
          You need an account to access this page. We'll bring you right back
          after you sign in.
        </motion.p>

        <motion.p
          variants={item}
          className={`mt-4 max-w-full truncate rounded-full border border-white/[0.08] px-4 py-1.5 text-xs text-zinc-600 ${mono}`}
        >
          {location.pathname}
        </motion.p>

        <motion.div variants={item} className="mt-10 flex w-full flex-col items-center gap-4">
          <button
            onClick={() => navigate('/login', { state: { from: location } })}
            className="group flex w-full items-center justify-center gap-2 rounded-full bg-[#ffb454] px-8 py-3.5 text-sm font-semibold text-[#1d1a16] transition-all duration-500 hover:bg-[#ffc272] active:scale-[0.98]"
          >
            <LogIn size={16} />
            Sign in
          </button>

          <button
            onClick={() => navigate('/signup')}
            className="text-sm text-zinc-500 transition-colors duration-500 hover:text-[#ffb454]"
          >
            Don't have an account?{' '}
            <span className="text-zinc-300 underline decoration-white/15 underline-offset-4">
              Sign up
            </span>
          </button>
        </motion.div>
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