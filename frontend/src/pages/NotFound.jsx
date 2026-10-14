import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate, NavLink } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import { HiArrowRight } from "react-icons/hi2";

const EASE = [0.23, 1, 0.32, 1];

const display = "font-['Space_Grotesk',ui-sans-serif,system-ui,sans-serif]";
const mono = "font-['JetBrains_Mono',ui-monospace,monospace]";

const GRAIN = `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.8' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>")`;

const ROUTES = {
  home: "/",
  catalogue: "/catalogue",
  login: "/login",
  signup: "/signup",
  profile: "/my-profile",
};

const LINE_COLOR = {
  cmd: "text-[#f3ece0]",
  out: "text-zinc-400",
  err: "text-[#e0816f]",
  ok: "text-[#ffb454]",
};

const WORD_STYLE = { WebkitTextStroke: "1.5px rgba(243,236,224,0.25)" };

export default function NotFound() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const reduce = useReducedMotion();

  const [lines, setLines] = useState([]);
  const [value, setValue] = useState("");
  const inputRef = useRef(null);
  const bodyRef = useRef(null);
  const glowRef = useRef(null);
  const wordWrapRef = useRef(null);

  const push = (...items) => setLines((prev) => [...prev, ...items]);

  // the opening "scene" plays out line by line
  useEffect(() => {
    const script = [
      { k: "cmd", t: `cd ${pathname}` },
      { k: "err", t: `bash: cd: ${pathname}: No such file or directory` },
      { k: "out", t: "Searched every route. Nothing lives here." },
      { k: "ok", t: 'Type "help" or tap a command below to find your way back.' },
    ];

    if (reduce) {
      setLines(script);
      return undefined;
    }

    const timers = script.map((line, i) =>
      setTimeout(() => setLines((prev) => [...prev, line]), 500 + i * 750)
    );
    return () => timers.forEach(clearTimeout);
  }, [pathname, reduce]);

  useEffect(() => {
    if (bodyRef.current) bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
  }, [lines]);

  const run = (raw) => {
    const input = raw.trim();
    if (!input) return;
    const [cmd, ...rest] = input.split(/\s+/);
    const arg = rest.join(" ").replace(/^\//, "").toLowerCase();

    if (cmd === "clear") {
      setLines([]);
      return;
    }

    push({ k: "cmd", t: input });

    if (cmd === "help") {
      push(
        { k: "out", t: "help        show this list" },
        { k: "out", t: "ls          list places you can go" },
        { k: "out", t: "cd <place>  take me there" },
        { k: "out", t: "home        go back to safety" },
        { k: "out", t: "clear       wipe the screen" }
      );
    } else if (cmd === "ls") {
      push({ k: "out", t: Object.keys(ROUTES).map((r) => `${r}/`).join("   ") });
    } else if (cmd === "home") {
      push({ k: "ok", t: "Heading home..." });
      setTimeout(() => navigate("/"), reduce ? 0 : 600);
    } else if (cmd === "cd" || cmd === "open") {
      if (!arg) {
        push({ k: "err", t: "cd: where to? try `ls` first." });
      } else if (ROUTES[arg]) {
        push({ k: "ok", t: `Opening /${arg}...` });
        setTimeout(() => navigate(ROUTES[arg]), reduce ? 0 : 600);
      } else {
        push({ k: "err", t: `cd: ${arg}: No such directory. Same problem you had.` });
      }
    } else {
      push({ k: "err", t: `command not found: ${cmd}. Try "help".` });
    }
  };

  const onSubmit = (e) => {
    e.preventDefault();
    run(value);
    setValue("");
  };

  // amber light that follows the cursor over the giant 404
  const onMove = (e) => {
    if (!wordWrapRef.current || !glowRef.current) return;
    const r = wordWrapRef.current.getBoundingClientRect();
    glowRef.current.style.setProperty("--mx", `${e.clientX - r.left}px`);
    glowRef.current.style.setProperty("--my", `${e.clientY - r.top}px`);
    glowRef.current.style.opacity = "1";
  };
  const onLeave = () => {
    if (glowRef.current) glowRef.current.style.opacity = "0";
  };

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-[#100f0d] px-5 py-20 sm:px-8">
      <style>{`
        @keyframes nfFloat{0%,100%{transform:translateY(0)}50%{transform:translateY(-14px)}}
        @keyframes nfBlink{0%,100%{opacity:1}50%{opacity:0}}
        @keyframes nfFlicker{0%,100%{opacity:1}92%{opacity:1}93%{opacity:.35}94%{opacity:1}96%{opacity:.5}97%{opacity:1}}
        @media (prefers-reduced-motion: reduce){.nf-anim{animation:none!important}}
      `}</style>

      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.06] mix-blend-overlay"
        style={{ backgroundImage: GRAIN }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/3 h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#ffb454]/[0.07] blur-3xl"
      />

      <div className="relative flex w-full max-w-3xl flex-col items-center">
        {/* eyebrow */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.95, ease: EASE }}
          className="flex items-center gap-3"
        >
          <span className="h-px w-8 bg-[#ffb454]" />
          <p
            className={`nf-anim flex items-center gap-2.5 text-[11px] uppercase tracking-[0.25em] text-zinc-500 ${mono}`}
            style={{ animation: "nfFlicker 5s linear infinite" }}
          >
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#ffb454]" />
            Signal lost
          </p>
          <span className="h-px w-8 bg-[#ffb454]" />
        </motion.div>

        {/* giant 404 */}
        <motion.div
          ref={wordWrapRef}
          onMouseMove={onMove}
          onMouseLeave={onLeave}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.1, ease: EASE, delay: 0.1 }}
          className="relative mt-6 select-none"
        >
          <div
            className="nf-anim relative"
            style={{ animation: "nfFloat 7s ease-in-out infinite" }}
          >
            <span
              aria-hidden
              className={`block text-[34vw] font-bold leading-[0.85] tracking-tighter text-transparent sm:text-[240px] ${display}`}
              style={WORD_STYLE}
            >
              404
            </span>
            <span
              ref={glowRef}
              aria-hidden
              className={`pointer-events-none absolute inset-0 block text-[34vw] font-bold leading-[0.85] tracking-tighter text-[#ffb454] opacity-0 transition-opacity duration-700 sm:text-[240px] ${display}`}
              style={{
                "--mx": "50%",
                "--my": "50%",
                WebkitMaskImage:
                  "radial-gradient(180px circle at var(--mx) var(--my), #000 0%, transparent 70%)",
                maskImage:
                  "radial-gradient(180px circle at var(--mx) var(--my), #000 0%, transparent 70%)",
              }}
            >
              404
            </span>
            <h1 className="sr-only">Page not found</h1>
          </div>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.95, ease: EASE, delay: 0.25 }}
          className={`mt-8 text-center text-3xl font-semibold tracking-tight text-[#f3ece0] sm:text-4xl ${display}`}
        >
          This page wandered off<span className="text-[#ffb454]">.</span>
        </motion.p>

        {/* terminal */}
        <motion.div
          initial={{ opacity: 0, y: 26 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: EASE, delay: 0.4 }}
          onClick={() => inputRef.current?.focus()}
          className="mt-12 w-full overflow-hidden rounded-3xl border border-white/[0.08] bg-[#14130f]"
        >
          <div className="flex items-center justify-between border-b border-white/[0.07] px-6 py-4">
            <div className="flex items-center gap-3">
              <span className="h-1.5 w-1.5 rounded-full bg-[#ffb454]" />
              <span className={`text-xs text-zinc-400 ${mono}`}>codevolvex / lost-and-found</span>
            </div>
            <span className={`text-[10px] uppercase tracking-[0.2em] text-zinc-600 ${mono}`}>
              interactive
            </span>
          </div>

          <div
            ref={bodyRef}
            className={`h-[240px] overflow-y-auto px-6 py-5 text-[13px] leading-[1.9] sm:text-[14px] ${mono}`}
          >
            {lines.map((line, i) => (
              <motion.p
                key={i}
                initial={reduce ? false : { opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, ease: EASE }}
                className={`whitespace-pre-wrap break-words ${LINE_COLOR[line.k]}`}
              >
                {line.k === "cmd" ? (
                  <>
                    <span className="mr-2 text-[#ffb454]">$</span>
                    {line.t}
                  </>
                ) : (
                  line.t
                )}
              </motion.p>
            ))}

            <form onSubmit={onSubmit} className="flex items-center">
              <span className="mr-2 text-[#ffb454]">$</span>
              <input
                ref={inputRef}
                value={value}
                onChange={(e) => setValue(e.target.value)}
                aria-label="Terminal command"
                autoComplete="off"
                autoCapitalize="off"
                spellCheck={false}
                className="min-w-0 flex-1 bg-transparent text-[#f3ece0] caret-[#ffb454] outline-none placeholder:text-zinc-700"
                placeholder="type a command"
              />
            </form>
          </div>

          {/* quick commands, for touch screens */}
          <div className="flex flex-wrap gap-2 border-t border-white/[0.07] px-6 py-4">
            {["help", "ls", "cd catalogue", "home"].map((c) => (
              <button
                key={c}
                onClick={(e) => {
                  e.stopPropagation();
                  run(c);
                }}
                className={`cursor-pointer rounded-full border border-white/15 px-4 py-1.5 text-xs text-zinc-400 transition-all duration-500 hover:border-[#ffb454]/60 hover:text-[#ffb454] ${mono}`}
              >
                {c}
              </button>
            ))}
          </div>
        </motion.div>

        {/* real exits */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.95, ease: EASE, delay: 0.55 }}
          className="mt-10 flex w-full flex-col items-center justify-center gap-4 sm:w-auto sm:flex-row"
        >
          <NavLink to="/" className="w-full sm:w-auto">
            <button className="group flex w-full cursor-pointer items-center justify-center gap-2 rounded-full bg-[#ffb454] px-8 py-4 text-sm font-semibold text-[#1d1a16] transition-all duration-500 hover:bg-[#ffc272] active:scale-[0.98]">
              Take me home
              <HiArrowRight className="h-4 w-4 transition-transform duration-500 group-hover:translate-x-1" />
            </button>
          </NavLink>
          <NavLink to="/catalogue" className="w-full sm:w-auto">
            <button className="flex w-full cursor-pointer items-center justify-center rounded-full border border-white/15 px-8 py-4 text-sm text-zinc-300 transition-all duration-500 hover:border-[#ffb454]/60 hover:text-[#ffb454]">
              Explore catalogue
            </button>
          </NavLink>
        </motion.div>
      </div>
    </div>
  );
}