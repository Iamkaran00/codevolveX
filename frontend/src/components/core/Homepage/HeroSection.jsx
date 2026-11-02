import React, { useEffect, useId, useRef, useState } from "react";
import { NavLink } from "react-router-dom";

import {
  motion,
  AnimatePresence,
  animate,
  useMotionValue,
  useSpring,
  useTransform,
  useInView,
  useReducedMotion,
} from "framer-motion";

import { HiArrowRight, HiPlay } from "react-icons/hi2";
import {
  SiReact,
  SiNodedotjs,
  SiMongodb,
  SiTailwindcss,
  SiExpress,
  SiSocketdotio,
  SiGit,
  SiRedux,
} from "react-icons/si";
import { useSelector } from "react-redux";

const EASE = [0.23, 1, 0.32, 1];

const display = "font-['Space_Grotesk',ui-sans-serif,system-ui,sans-serif]";
const mono = "font-['JetBrains_Mono',ui-monospace,monospace]";
const HAND = "font-['Caveat','Segoe_Script','Brush_Script_MT',cursive]";

const GRAIN = `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.8' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>")`;

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.13, delayChildren: 0.1 } },
};
const item = {
  hidden: { opacity: 0, y: 22 },
  show: { opacity: 1, y: 0, transition: { duration: 0.95, ease: EASE } },
};

const FACTS = [
  ["Structured paths", "Lessons in an order that makes sense"],
  ["Track progress", "Mark lessons done and pick up where you left off"],
  ["Built by instructors", "Courses from people who ship for a living"],
];

const clampN = (v, a, b) => Math.max(a, Math.min(b, v));

/* ------------------------------------------------------------------ */
/*  BUILD DESK                                                         */
/*                                                                     */
/*  A messy desk: code is typed in the editor, and the chat app on the */
/*  phone comes alive as each line lands. A sticky note gets ticked    */
/*  off by hand. Everything can be picked up and thrown. A handful of  */
/*  tech stickers rain onto the desk with real circle physics: they    */
/*  collide, roll, stack, and can be grabbed and flung.                */
/* ------------------------------------------------------------------ */

const SW = 540; // stage width
const SH = 620; // stage height

const TOK = { fn: "#ffb454", str: "#9bd8bd", v: "#f3ece0", p: "#71717a" };

const CODE = [
  [["io", "fn"], [".on(", "p"], ['"connection"', "str"], [", (", "p"], ["socket", "v"], [") => {", "p"]],
  [["  socket", "v"], [".join(", "p"], ["room", "v"], [");", "p"]],
  [["  socket", "v"], [".on(", "p"], ['"message"', "str"], [", (", "p"], ["msg", "v"], [") => {", "p"]],
  [["    io", "fn"], [".to(", "p"], ["room", "v"], [").emit(", "p"], ['"message"', "str"], [", ", "p"], ["msg", "v"], [");", "p"]],
  [["  });", "p"]],
  [["});", "p"]],
];

const LINE_LEN = CODE.map((l) => l.reduce((a, [t]) => a + t.length, 0));
const LINE_END = LINE_LEN.map((_, i) => LINE_LEN.slice(0, i + 1).reduce((a, b) => a + b, 0));
const TOTAL = LINE_END[LINE_END.length - 1];
const TYPING_TICKS = 32; // "typing..." before the last reply
const HOLD_TICKS = 110; // let the finished scene breathe
const LOOP = TOTAL + TYPING_TICKS + HOLD_TICKS;
const TICK = 38; // ms per typed character

const NOTE_ITEMS = ["Project setup", "Socket events", "Chat UI", "Deploy"];

const BUILD_CSS = `
@import url('https://fonts.googleapis.com/css2?family=Caveat:wght@500;600&display=swap');
@keyframes cx-blink { 0%, 49% { opacity: 1; } 50%, 100% { opacity: 0; } }
.cx-caret { animation: cx-blink 1s steps(1) infinite; }
.cx-sticker { cursor: grab; touch-action: none; }
.cx-sticker.is-grabbing { cursor: grabbing; }
`;

const renderLine = (tokens, count) => {
  let left = count;
  return tokens.map(([t, c], k) => {
    if (left <= 0) return null;
    const part = t.slice(0, left);
    left -= part.length;
    return (
      <span key={k} style={{ color: TOK[c] }}>
        {part}
      </span>
    );
  });
};

/* ---------- a draggable, throwable thing on the desk ---------- */

function Layer({ id, depth, rot, z, top, onGrab, mx, my, stageRef, reduce, float, className, children }) {
  const px = useSpring(useTransform(mx, [-0.5, 0.5], [-depth, depth]), {
    stiffness: 90,
    damping: 18,
    mass: 0.6,
  });
  const py = useSpring(useTransform(my, [-0.5, 0.5], [-depth * 0.7, depth * 0.7]), {
    stiffness: 90,
    damping: 18,
    mass: 0.6,
  });
  const rv = useMotionValue(0);
  const rs = useSpring(rv, { stiffness: 140, damping: 11, mass: 0.7 });
  const rotate = useTransform(rs, (v) => v + rot);

  return (
    <motion.div style={{ x: px, y: py, zIndex: top === id ? 60 : z }} className={`absolute ${className}`}>
      <motion.div
        animate={reduce ? undefined : { y: [0, -float, 0] }}
        transition={{ duration: 5 + float * 0.35, repeat: Infinity, ease: "easeInOut" }}
      >
        <motion.div
          drag
          dragConstraints={stageRef}
          dragElastic={0.2}
          dragTransition={{ power: 0.28, timeConstant: 280, bounceStiffness: 260, bounceDamping: 16 }}
          whileDrag={{ scale: 1.035 }}
          onDragStart={() => onGrab(id)}
          onDrag={(e, info) => {
            if (!reduce) rv.set(clampN(info.velocity.x * 0.012, -16, 16));
          }}
          onDragEnd={() => rv.set(0)}
          style={{ rotate, transformOrigin: "50% 15%", touchAction: "none" }}
          className="cursor-grab active:cursor-grabbing"
        >
          {children}
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

/* ---------- editor ---------- */

function Editor({ n, L }) {
  const cur = LINE_END.findIndex((e) => n < e);
  const live = L >= 2;

  return (
    <div className="w-[360px] overflow-hidden rounded-2xl border border-white/10 bg-[#14130f] shadow-[0_40px_70px_-20px_rgba(0,0,0,0.95)]">
      <div className="flex items-center gap-3 border-b border-white/[0.07] px-4 py-2.5">
        <span className="flex gap-1.5">
          {[0, 1, 2].map((i) => (
            <span key={i} className="h-2.5 w-2.5 rounded-full bg-white/15" />
          ))}
        </span>
        <span className={`ml-2 flex items-center gap-2 text-[11px] text-zinc-400 ${mono}`}>
          <span className="h-1.5 w-1.5 rounded-full bg-[#ffb454]" />
          server.js
        </span>
        <span className={`ml-auto text-[10px] text-zinc-600 ${mono}`}>socket.io</span>
      </div>

      <div className={`px-4 py-4 text-[12.5px] leading-6 ${mono}`}>
        {CODE.map((tokens, i) => {
          const start = i ? LINE_END[i - 1] : 0;
          const count = clampN(n - start, 0, LINE_LEN[i]);
          const isCur = cur === i || (cur === -1 && i === CODE.length - 1);
          return (
            <div key={i} className="flex whitespace-pre">
              <span className="mr-4 w-6 shrink-0 select-none text-right text-zinc-700">{i + 1}</span>
              <span>
                {renderLine(tokens, count)}
                {isCur && (
                  <span className="cx-caret ml-px inline-block h-[15px] w-[7px] translate-y-[3px] bg-[#ffb454]" />
                )}
              </span>
            </div>
          );
        })}
      </div>

      <div
        className={`flex items-center justify-between border-t border-white/[0.07] px-4 py-2 text-[10px] text-zinc-600 ${mono}`}
      >
        <span>{L < CODE.length ? "writing server.js" : "saved"}</span>
        <span className="flex items-center gap-1.5">
          <span
            className={`h-1.5 w-1.5 rounded-full transition-colors duration-500 ${
              live ? "bg-[#ffb454]" : "bg-zinc-700"
            }`}
          />
          {live ? "live · 3 clients" : "offline"}
        </span>
      </div>
    </div>
  );
}

/* ---------- phone ---------- */

function Pop({ className = "", children }) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 14, scale: 0.92 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ type: "spring", stiffness: 420, damping: 28 }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function Phone({ L, n, after }) {
  const joined = L >= 1;
  const online = L >= 2;
  const m1 = L >= 4;
  const m2 = L >= 5;
  const typing = n >= TOTAL && after < TYPING_TICKS;
  const m3 = after >= TYPING_TICKS;

  return (
    <div className="h-[400px] w-[200px] rounded-[36px] border border-white/15 bg-[#0c0b09] p-[7px] shadow-[0_40px_70px_-20px_rgba(0,0,0,0.95)]">
      <div className="flex h-full flex-col overflow-hidden rounded-[29px] bg-[#14130f]">
        <div className="mx-auto mt-2 h-[18px] w-16 shrink-0 rounded-full bg-[#0c0b09]" />

        <div className="flex items-center gap-2.5 border-b border-white/[0.07] px-4 pb-2.5 pt-2">
          <span
            className={`grid h-7 w-7 place-items-center rounded-full bg-[#ffb454] text-[12px] font-bold text-[#1d1a16] ${display}`}
          >
            #
          </span>
          <div className="min-w-0">
            <p className={`text-[12.5px] font-semibold leading-none text-[#f3ece0] ${display}`}>
              team-chat
            </p>
            <p className="mt-1 flex items-center gap-1.5 text-[9px] text-zinc-500">
              <span
                className={`h-1.5 w-1.5 rounded-full transition-colors duration-500 ${
                  online ? "bg-[#8cc84b]" : "bg-zinc-600"
                }`}
              />
              {online ? "3 online" : "connecting…"}
            </p>
          </div>
        </div>

        <div className="flex min-h-0 flex-1 flex-col justify-end gap-2 px-3 pb-3">
          <AnimatePresence initial={false}>
            {joined && (
              <Pop key="join" className="self-center">
                <span className="rounded-full border border-white/10 px-2.5 py-1 text-[9px] text-zinc-500">
                  you joined #team-chat
                </span>
              </Pop>
            )}
            {m1 && (
              <Pop key="m1" className="max-w-[80%] self-start">
                <p className="mb-0.5 pl-1 text-[8.5px] text-zinc-600">maya</p>
                <p className="rounded-2xl rounded-bl-md bg-white/[0.07] px-3 py-2 text-[11px] leading-snug text-zinc-200">
                  is the room live yet?
                </p>
              </Pop>
            )}
            {m2 && (
              <Pop key="m2" className="max-w-[80%] self-end">
                <p className="rounded-2xl rounded-br-md bg-[#ffb454] px-3 py-2 text-[11px] leading-snug text-[#1d1a16]">
                  yep. messages are flowing
                </p>
              </Pop>
            )}
            {typing && (
              <Pop key="typing" className="self-start">
                <div className="flex items-center gap-1 rounded-2xl rounded-bl-md bg-white/[0.07] px-3 py-2.5">
                  {[0, 1, 2].map((i) => (
                    <motion.span
                      key={i}
                      animate={{ y: [0, -3, 0] }}
                      transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.14 }}
                      className="h-1.5 w-1.5 rounded-full bg-zinc-400"
                    />
                  ))}
                </div>
              </Pop>
            )}
            {m3 && (
              <Pop key="m3" className="max-w-[80%] self-start">
                <p className="mb-0.5 pl-1 text-[8.5px] text-zinc-600">maya</p>
                <p className="rounded-2xl rounded-bl-md bg-white/[0.07] px-3 py-2 text-[11px] leading-snug text-zinc-200">
                  ship it.
                </p>
              </Pop>
            )}
          </AnimatePresence>
        </div>

        <div className="mx-3 mb-3 flex shrink-0 items-center gap-2 rounded-full bg-white/[0.06] py-1.5 pl-3.5 pr-1.5">
          <span className="flex-1 truncate text-[10px] text-zinc-600">Message #team-chat</span>
          <span className="grid h-6 w-6 place-items-center rounded-full bg-[#ffb454] text-[#1d1a16]">
            <HiArrowRight className="h-3 w-3 -rotate-45" />
          </span>
        </div>
      </div>
    </div>
  );
}

/* ---------- sticky note ---------- */

function Note({ checks }) {
  return (
    <div className="relative w-[176px] rounded-[3px] bg-[#f1eadc] px-5 pb-6 pt-7 text-[#1d1a16] shadow-[0_18px_30px_-12px_rgba(0,0,0,0.8)]">
      <span className="absolute -top-3 left-1/2 h-6 w-16 -translate-x-1/2 -rotate-3 bg-[#ffb454]/70" />
      <p className={`text-[24px] leading-none ${HAND}`} style={{ fontWeight: 600 }}>
        this week:
      </p>
      <ul className="mt-3 space-y-2.5">
        {NOTE_ITEMS.map((t, i) => (
          <li key={t} className="relative flex items-center gap-2.5">
            <span className="relative h-4 w-4 shrink-0 rounded-[3px] border-[1.5px] border-[#1d1a16]/70">
              <svg viewBox="0 0 20 20" className="absolute -left-0.5 -top-1.5 h-5 w-5 overflow-visible">
                <motion.path
                  d="M3 10 L8 15 L18 3"
                  fill="none"
                  stroke="#b4561b"
                  strokeWidth="2.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  initial={false}
                  animate={{ pathLength: checks[i] ? 1 : 0, opacity: checks[i] ? 1 : 0 }}
                  transition={{ duration: 0.4, ease: EASE }}
                />
              </svg>
            </span>
            <span className={`text-[20px] leading-none ${HAND}`} style={{ fontWeight: 500 }}>
              {t}
            </span>
            <motion.span
              aria-hidden
              initial={false}
              animate={{ scaleX: checks[i] ? 1 : 0 }}
              transition={{ duration: 0.45, ease: EASE, delay: 0.1 }}
              style={{ originX: 0 }}
              className="absolute left-6 right-1 top-1/2 h-[2px] bg-[#1d1a16]/55"
            />
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ---------- tech stickers: real circle physics ---------- */

const STICKERS = [
  { Icon: SiReact, label: "react", color: "#61dafb", r: 29 },
  { Icon: SiNodedotjs, label: "node", color: "#8cc84b", r: 27 },
  { Icon: SiMongodb, label: "mongo", color: "#4db33d", r: 28 },
  { Icon: SiTailwindcss, label: "tailwind", color: "#38bdf8", r: 30 },
  { Icon: SiExpress, label: "express", color: "#e6dfd3", r: 26 },
  { Icon: SiSocketdotio, label: "socket", color: "#f3ece0", r: 28 },
  { Icon: SiGit, label: "git", color: "#f05133", r: 25 },
  { Icon: SiRedux, label: "redux", color: "#a78bfa", r: 27 },
];

const FLOOR = SH - 8;
const PSTEP = 1 / 120;

function StickerPile({ stageRef, visibleRef, reduce }) {
  const els = useRef([]);
  const api = useRef({});

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return undefined;

    const n = STICKERS.length;
    const R = STICKERS.map((s) => s.r);
    const X = new Float64Array(n);
    const Y = new Float64Array(n);
    const PX = new Float64Array(n);
    const PY = new Float64Array(n);
    const A = new Float64Array(n); // roll angle

    let seed = 11;
    const rnd = () => {
      seed = (seed * 16807) % 2147483647;
      return seed / 2147483647;
    };

    for (let i = 0; i < n; i += 1) {
      if (reduce) {
        X[i] = 44 + (i * (SW - 88)) / (n - 1);
        Y[i] = FLOOR - R[i];
      } else {
        X[i] = 50 + rnd() * (SW - 100);
        Y[i] = -60 - i * 95 - rnd() * 40; // rain in one after another
      }
      PX[i] = X[i];
      PY[i] = Y[i];
      A[i] = rnd() * 6;
    }

    const drag = { i: -1, ox: 0, oy: 0, tx: 0, ty: 0 };

    const step = () => {
      const g = 2600 * PSTEP * PSTEP;

      for (let i = 0; i < n; i += 1) {
        if (drag.i === i) continue;
        const vx = (X[i] - PX[i]) * 0.9992;
        const vy = (Y[i] - PY[i]) * 0.9992;
        A[i] += vx / R[i];
        PX[i] = X[i];
        PY[i] = Y[i];
        X[i] += vx;
        Y[i] += vy + g;
      }

      if (drag.i >= 0) {
        const i = drag.i;
        PX[i] = X[i];
        PY[i] = Y[i];
        X[i] += (drag.tx - X[i]) * 0.35;
        Y[i] += (drag.ty - Y[i]) * 0.35;
      }

      for (let it = 0; it < 6; it += 1) {
        for (let i = 0; i < n; i += 1) {
          for (let j = i + 1; j < n; j += 1) {
            const dx = X[j] - X[i];
            const dy = Y[j] - Y[i];
            const m = R[i] + R[j];
            if (Math.abs(dx) > m || Math.abs(dy) > m) continue;
            const d = Math.hypot(dx, dy) || 1e-6;
            if (d >= m) continue;
            const c = (m - d) / d;
            const wi = drag.i === i ? 0 : 1;
            const wj = drag.i === j ? 0 : 1;
            const ws = wi + wj;
            if (ws === 0) continue;
            X[i] -= (dx * c * wi) / ws;
            Y[i] -= (dy * c * wi) / ws;
            X[j] += (dx * c * wj) / ws;
            Y[j] += (dy * c * wj) / ws;
          }
        }
      }

      for (let i = 0; i < n; i += 1) {
        if (drag.i === i) continue;
        if (X[i] < R[i]) {
          const v = X[i] - PX[i];
          X[i] = R[i];
          PX[i] = X[i] + v * 0.4;
        } else if (X[i] > SW - R[i]) {
          const v = X[i] - PX[i];
          X[i] = SW - R[i];
          PX[i] = X[i] + v * 0.4;
        }
        if (Y[i] > FLOOR - R[i]) {
          const v = Y[i] - PY[i];
          Y[i] = FLOOR - R[i];
          PY[i] = Y[i] + v * 0.32;
          PX[i] += (X[i] - PX[i]) * 0.1; // floor friction
        }
      }
    };

    const draw = () => {
      for (let i = 0; i < n; i += 1) {
        const el = els.current[i];
        if (!el) continue;
        el.style.transform = `translate3d(${(X[i] - R[i]).toFixed(2)}px, ${(Y[i] - R[i]).toFixed(2)}px, 0) rotate(${A[i].toFixed(3)}rad)`;
      }
    };

    const local = (e) => {
      const r = stage.getBoundingClientRect();
      const s = r.width / SW;
      return [(e.clientX - r.left) / s, (e.clientY - r.top) / s];
    };

    api.current.down = (i, e) => {
      if (e.pointerType === "mouse" && e.button !== 0) return;
      const [px, py] = local(e);
      drag.i = i;
      drag.ox = px - X[i];
      drag.oy = py - Y[i];
      drag.tx = X[i];
      drag.ty = Y[i];
      try {
        e.currentTarget.setPointerCapture(e.pointerId);
      } catch (err) {
        /* ignore */
      }
      e.currentTarget.classList.add("is-grabbing");
      e.currentTarget.style.zIndex = "70";
    };

    api.current.move = (i, e) => {
      if (drag.i !== i) return;
      const [px, py] = local(e);
      drag.tx = clampN(px - drag.ox, R[i], SW - R[i]);
      drag.ty = clampN(py - drag.oy, -40, FLOOR - R[i]);
    };

    api.current.up = (i, e) => {
      if (drag.i !== i) return;
      drag.i = -1;
      e.currentTarget.classList.remove("is-grabbing");
      e.currentTarget.style.zIndex = "45";
      try {
        e.currentTarget.releasePointerCapture(e.pointerId);
      } catch (err) {
        /* ignore */
      }
    };

    let raf;
    let last = performance.now();
    const t0 = last;
    let acc = 0;
    const tick = (now) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      if (visibleRef.current && now - t0 > 900) {
        acc += dt;
        let k = 0;
        while (acc >= PSTEP && k < 6) {
          step();
          acc -= PSTEP;
          k += 1;
        }
        if (k === 6) acc = 0;
      }
      draw();
      raf = requestAnimationFrame(tick);
    };
    draw();
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [stageRef, visibleRef, reduce]);

  return (
    <>
      {STICKERS.map(({ Icon, label, color, r }, i) => (
        <div
          key={label}
          ref={(el) => {
            els.current[i] = el;
          }}
          className="cx-sticker absolute left-0 top-0 select-none"
          style={{
            width: r * 2,
            height: r * 2,
            zIndex: 45,
            willChange: "transform",
            transform: `translate3d(0, ${-200}px, 0)`,
          }}
          onPointerDown={(e) => api.current.down?.(i, e)}
          onPointerMove={(e) => api.current.move?.(i, e)}
          onPointerUp={(e) => api.current.up?.(i, e)}
          onPointerCancel={(e) => api.current.up?.(i, e)}
        >
          <div className="relative h-full w-full rounded-full bg-[#f1eadc] shadow-[0_10px_18px_-6px_rgba(0,0,0,0.8)]">
            <div className="absolute inset-[3px] flex flex-col items-center justify-center rounded-full bg-[#14130f]">
              <Icon className="h-[40%] w-[40%]" style={{ color }} />
              <span className={`mt-0.5 text-[7px] uppercase tracking-wider text-zinc-400 ${mono}`}>
                {label}
              </span>
            </div>
          </div>
        </div>
      ))}
    </>
  );
}

/* ---------- the stage ---------- */

function BuildStage() {
  const reduce = useReducedMotion();
  const outerRef = useRef(null);
  const stageRef = useRef(null);
  const visibleRef = useRef(true);
  const inView = useInView(outerRef, { margin: "100px" });

  const [n, setN] = useState(0);
  const [top, setTop] = useState(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);

  useEffect(() => {
    visibleRef.current = inView;
  }, [inView]);

  useEffect(() => {
    if (!inView) return undefined;
    const id = setInterval(() => setN((v) => (v + 1) % LOOP), TICK);
    return () => clearInterval(id);
  }, [inView]);

  const L = LINE_END.filter((e) => n >= e).length; // finished lines
  const after = Math.max(0, n - TOTAL);
  const checks = [L >= 1, L >= 4, L >= 5, after >= TYPING_TICKS];

  const onMove = (e) => {
    if (reduce) return;
    const r = stageRef.current?.getBoundingClientRect();
    if (!r) return;
    mx.set(clampN((e.clientX - r.left) / r.width - 0.5, -0.5, 0.5));
    my.set(clampN((e.clientY - r.top) / r.height - 0.5, -0.5, 0.5));
  };
  const onLeave = () => {
    mx.set(0);
    my.set(0);
  };

  const shared = { mx, my, stageRef, reduce, top, onGrab: setTop };

  return (
    <div
      ref={outerRef}
      className="relative mx-auto h-[388px] w-full max-w-[540px] min-[420px]:h-[446px] sm:h-[620px]"
    >
      <style>{BUILD_CSS}</style>

      <div
        ref={stageRef}
        onMouseMove={onMove}
        onMouseLeave={onLeave}
        className="absolute left-1/2 top-0 h-[620px] w-[540px] origin-top -translate-x-1/2 scale-[0.62] min-[420px]:scale-[0.72] sm:scale-100"
      >
        {/* faint dotted desk */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage: "radial-gradient(rgba(255,255,255,0.08) 1px, transparent 1px)",
            backgroundSize: "22px 22px",
            maskImage: "radial-gradient(ellipse at 50% 45%, black 15%, transparent 72%)",
            WebkitMaskImage: "radial-gradient(ellipse at 50% 45%, black 15%, transparent 72%)",
          }}
        />

        {/* hand-drawn annotation */}
        <div aria-hidden className="pointer-events-none absolute left-[392px] top-[4px] z-[15] rotate-3">
          <p className={`text-[24px] leading-[0.95] text-[#ffb454] ${HAND}`} style={{ fontWeight: 600 }}>
            your code,
            <br />
            running live
          </p>
          <svg viewBox="0 0 70 64" className="-mt-0.5 ml-3 h-[64px] w-[70px] overflow-visible" fill="none">
            <motion.path
              d="M8 4 C 40 2, 62 22, 52 54"
              stroke="#ffb454"
              strokeWidth="2.2"
              strokeLinecap="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.9, ease: EASE, delay: 1.3 }}
            />
            <motion.path
              d="M43 44 L52 57 L63 47"
              stroke="#ffb454"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.4, ease: EASE, delay: 2.1 }}
            />
          </svg>
        </div>

        <p
          aria-hidden
          className={`pointer-events-none absolute left-3 top-2 -rotate-4 text-[20px] text-zinc-500 ${HAND}`}
          style={{ transform: "rotate(-4deg)" }}
        >
          psst, drag stuff around
        </p>

        <Layer id="editor" depth={8} rot={-3} z={10} float={5} className="left-0 top-[70px]" {...shared}>
          <Editor n={n} L={L} />
        </Layer>

        <Layer id="phone" depth={16} rot={4} z={20} float={7} className="left-[322px] top-[128px]" {...shared}>
          <Phone L={L} n={n} after={after} />
        </Layer>

        <Layer id="note" depth={24} rot={-6} z={30} float={6} className="left-[14px] top-[332px]" {...shared}>
          <Note checks={checks} />
        </Layer>

        <Layer id="sticker" depth={30} rot={12} z={40} float={8} className="left-[462px] top-[104px]" {...shared}>
          <div className="relative grid h-[80px] w-[80px] place-items-center rounded-full bg-[#ffb454] text-center text-[#1d1a16] shadow-[0_14px_24px_-8px_rgba(0,0,0,0.8)]">
            <span aria-hidden className="absolute inset-1.5 rounded-full border border-dashed border-[#1d1a16]/40" />
            <span className={`relative text-[13px] font-semibold leading-[1.05] ${display}`}>
              48
              <br />
              lessons
            </span>
          </div>
        </Layer>

        {/* tech stickers raining onto the desk */}
        <StickerPile stageRef={stageRef} visibleRef={visibleRef} reduce={reduce} />
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Signature                                                          */
/*                                                                     */
/*  Written with a pen stroke, once. The name is revealed by a         */
/*  scribbling mask that sweeps across it, then an underline flourish  */
/*  is drawn. It plays the first time you scroll it into view and      */
/*  never again.                                                       */
/* ------------------------------------------------------------------ */

const FONT_CSS =
  "@import url('https://fonts.googleapis.com/css2?family=Mrs+Saint+Delafield&display=swap');";
const SIG_FONT = "'Mrs Saint Delafield','Segoe Script','Brush Script MT',cursive";

const Signature = () => {
  const reduce = useReducedMotion();
  const wrapRef = useRef(null);
  const measureRef = useRef(null);
  const maskPathRef = useRef(null);
  const flourishRef = useRef(null);
  const doneRef = useRef(false);
  const [box, setBox] = useState(null);
  const [credit, setCredit] = useState(false);
  const uid = useId().replace(/:/g, "");

  // once: true means this flips to true the first time it is seen and stays true
  const inView = useInView(wrapRef, { once: true, amount: 0.6 });

  // measure the text once the handwriting font has loaded
  useEffect(() => {
    let dead = false;
    const measure = () => {
      const t = measureRef.current;
      if (dead || !t || doneRef.current) return;
      const b = t.getBBox();
      if (b.width > 0) setBox({ x: b.x, y: b.y, w: b.width, h: b.height });
    };
    const fonts = typeof document !== "undefined" ? document.fonts : null;
    const timer = setTimeout(measure, 1800);
    if (fonts?.load) {
      Promise.race([
        fonts.load("100px 'Mrs Saint Delafield'"),
        new Promise((r) => setTimeout(r, 1500)),
      ])
        .then(() => setTimeout(measure, 60))
        .catch(measure);
      fonts.addEventListener?.("loadingdone", measure);
    }
    return () => {
      dead = true;
      clearTimeout(timer);
      fonts?.removeEventListener?.("loadingdone", measure);
    };
  }, []);

  // geometry for the scribble mask + underline
  let maskD = "";
  let flourishD = "";
  let vb = "0 0 400 140";
  if (box) {
    const N = 18;
    const top = box.y + box.h * 0.08;
    const bot = box.y + box.h * 0.92;
    const mid = box.y + box.h * 0.5;
    maskD = `M${(box.x - 6).toFixed(1)} ${mid.toFixed(1)}`;
    for (let i = 0; i < N; i += 1) {
      const x = box.x + ((i + 0.5) / N) * box.w;
      maskD += ` L${x.toFixed(1)} ${(i % 2 === 0 ? top : bot).toFixed(1)}`;
    }
    maskD += ` L${(box.x + box.w + 6).toFixed(1)} ${mid.toFixed(1)}`;

    const yb = box.y + box.h * 1.04;
    const x0 = box.x + box.w * 0.04;
    flourishD = `M${x0.toFixed(1)} ${yb.toFixed(1)} C ${(x0 + box.w * 0.25).toFixed(1)} ${(yb - box.h * 0.14).toFixed(1)}, ${(x0 + box.w * 0.5).toFixed(1)} ${(yb + box.h * 0.12).toFixed(1)}, ${(x0 + box.w * 0.72).toFixed(1)} ${(yb + box.h * 0.02).toFixed(1)} S ${(x0 + box.w * 0.92).toFixed(1)} ${(yb - box.h * 0.08).toFixed(1)}, ${(x0 + box.w * 0.96).toFixed(1)} ${(yb + box.h * 0.03).toFixed(1)}`;
    vb = `${(box.x - 8).toFixed(1)} ${(box.y - 6).toFixed(1)} ${(box.w + 16).toFixed(1)} ${(box.h * 1.5).toFixed(1)}`;
  }

  // play once
  useEffect(() => {
    if (!inView || !box || doneRef.current) return undefined;
    const mp = maskPathRef.current;
    const fp = flourishRef.current;
    if (!mp || !fp) return undefined;

    const ml = mp.getTotalLength();
    const fl = fp.getTotalLength();
    mp.style.strokeDasharray = `${ml}`;
    fp.style.strokeDasharray = `${fl}`;

    if (reduce) {
      mp.style.strokeDashoffset = "0";
      fp.style.strokeDashoffset = "0";
      doneRef.current = true;
      setCredit(true);
      return undefined;
    }

    mp.style.strokeDashoffset = `${ml}`;
    fp.style.strokeDashoffset = `${fl}`;

    let second;
    const first = animate(0, 1, {
      duration: 2.8,
      ease: [0.45, 0, 0.25, 1],
      onUpdate: (v) => {
        mp.style.strokeDashoffset = `${ml * (1 - v)}`;
      },
      onComplete: () => {
        setCredit(true);
        second = animate(0, 1, {
          duration: 0.9,
          ease: EASE,
          onUpdate: (v) => {
            fp.style.strokeDashoffset = `${fl * (1 - v)}`;
          },
          onComplete: () => {
            doneRef.current = true;
          },
        });
      },
    });

    return () => {
      first.stop();
      second?.stop();
    };
  }, [inView, box, reduce]);

  return (
    <div
      ref={wrapRef}
      className="pointer-events-none absolute bottom-6 right-6 z-10 select-none text-right sm:bottom-10 sm:right-10"
    >
      <style>{FONT_CSS}</style>

      <motion.p
        initial={{ opacity: 0, y: 6 }}
        animate={inView ? { opacity: 1, y: 0 } : undefined}
        transition={{ duration: 0.6 }}
        className={`text-[11px] tracking-wide text-zinc-600 ${mono}`}
      >
        Designed &amp; built by
      </motion.p>

      <div className="mt-1 h-[96px] w-[300px] -rotate-3 sm:h-[124px] sm:w-[380px]">
        <svg
          viewBox={vb}
          preserveAspectRatio="xMaxYMid meet"
          className="h-full w-full overflow-visible"
          fill="none"
          role="img"
          aria-label="Karan Sahu"
        >
          {/* invisible copy, only used to measure the real text size */}
          <text
            ref={measureRef}
            x="0"
            y="100"
            fontSize="100"
            visibility="hidden"
            style={{ fontFamily: SIG_FONT }}
          >
            Karan Sahu
          </text>

          {box && (
            <>
              <defs>
                <mask
                  id={`sigmask${uid}`}
                  maskUnits="userSpaceOnUse"
                  x={box.x - 40}
                  y={box.y - 40}
                  width={box.w + 80}
                  height={box.h + 80}
                >
                  <path
                    ref={maskPathRef}
                    d={maskD}
                    fill="none"
                    stroke="#fff"
                    strokeWidth={box.h * 0.4}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    style={{ strokeDasharray: 99999, strokeDashoffset: 99999 }}
                  />
                </mask>
              </defs>

              <text
                x="0"
                y="100"
                fontSize="100"
                fill="#f3ece0"
                mask={`url(#sigmask${uid})`}
                style={{ fontFamily: SIG_FONT }}
              >
                Karan Sahu
              </text>

              <path
                ref={flourishRef}
                d={flourishD}
                stroke="#ffb454"
                strokeWidth="2.6"
                strokeLinecap="round"
                style={{ strokeDasharray: 99999, strokeDashoffset: 99999 }}
              />
            </>
          )}
        </svg>
      </div>

      <motion.p
        initial={{ opacity: 0, y: 8 }}
        animate={credit ? { opacity: 1, y: 0 } : undefined}
        transition={{ duration: 0.7 }}
        className={`mt-1 text-[10px] tracking-[0.2em] text-zinc-700 ${mono}`}
      >
        codevolve <span className="text-amber-400">X</span> · 2026
      </motion.p>
    </div>
  );
};

export default function HeroSection() {
  const { user } = useSelector((state) => state.profile);

  return (
    <section className="relative overflow-hidden bg-[#100f0d] px-5 pb-48 pt-36 sm:px-8 lg:pb-44 lg:pt-44">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.06] mix-blend-overlay"
        style={{ backgroundImage: GRAIN }}
      />

      <div className="relative mx-auto grid max-w-7xl items-center gap-16 lg:grid-cols-[1.1fr_0.9fr] lg:gap-20">
        {/* left: words */}
        <motion.div variants={container} initial="hidden" animate="show" className="max-w-2xl">
          <motion.div variants={item} className="flex items-center gap-3">
            <span className="h-px w-8 bg-[#ffb454]" />
            <p className="text-sm text-zinc-500">
              {user?.firstName ? `Welcome back, ${user.firstName}` : "Video courses for developers"}
            </p>
          </motion.div>

          <motion.h1
            variants={item}
            className={`mt-7 text-5xl font-semibold leading-[1.02] tracking-tight text-[#f3ece0] sm:text-6xl lg:text-[5.25rem] ${display}`}
          >
            Learn by building
            <br />
            <span className="text-[#ffb454]">real</span> things.
          </motion.h1>

          <motion.p variants={item} className="mt-7 max-w-lg text-lg leading-relaxed text-zinc-400">
            Hands-on courses from working instructors. Go at your own pace, ship projects as you
            learn, and keep your progress wherever you left off.
          </motion.p>

          <motion.div variants={item} className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center">
            {user?.accountType == "Instructor" ? (
              <NavLink to="/dashboard/my-courses">
                <button className="group flex w-full cursor-pointer items-center justify-center gap-2 rounded-full bg-[#ffb454] px-8 py-4 text-sm font-semibold text-[#1d1a16] transition-all duration-500 hover:bg-[#ffc272] active:scale-[0.98] sm:w-auto">
                  Your Courses
                  <HiArrowRight className="h-4 w-4 transition-transform duration-500 group-hover:translate-x-1" />
                </button>
              </NavLink>
            ) : (
              <NavLink to="/catalogue">
                <button className="group flex w-full cursor-pointer items-center justify-center gap-2 rounded-full bg-[#ffb454] px-8 py-4 text-sm font-semibold text-[#1d1a16] transition-all duration-500 hover:bg-[#ffc272] active:scale-[0.98] sm:w-auto">
                  Explore Catalogue
                  <HiArrowRight className="h-4 w-4 transition-transform duration-500 group-hover:translate-x-1" />
                </button>
              </NavLink>
            )}
     {user ? (
  <NavLink
    to={
      user.accountType === "Student"
        ? "/dashboard/enrolled-courses"
        : "/dashboard/instructor"
    }
    className="group flex w-full items-center justify-center gap-2.5 rounded-full px-6 py-4 text-sm text-zinc-300 transition-colors duration-500 hover:text-[#ffb454] sm:w-auto"
  >
    <span className="flex h-8 w-8 items-center justify-center rounded-full border border-white/15 transition-colors duration-500 group-hover:border-[#ffb454]/60">
      <HiArrowRight className="h-3.5 w-3.5" />
    </span>
    Dashboard
  </NavLink>
) : (
  <button className="group flex w-full items-center justify-center gap-2.5 rounded-full px-6 py-4 text-sm text-zinc-300 transition-colors duration-500 hover:text-[#ffb454] sm:w-auto">
    <span className="flex h-8 w-8 items-center justify-center rounded-full border border-white/15 transition-colors duration-500 group-hover:border-[#ffb454]/60">
      <HiPlay className="h-3.5 w-3.5 translate-x-px" />
    </span>
    Watch demo
  </button>
)}
          </motion.div>

          <motion.dl
            variants={item}
            className="mt-16 grid grid-cols-1 gap-6 border-t border-white/[0.07] pt-8 sm:grid-cols-3"
          >
            {FACTS.map(([title, text]) => (
              <div key={title}>
                <dt className={`text-[15px] font-medium text-[#f3ece0] ${display}`}>{title}</dt>
                <dd className="mt-1.5 text-sm leading-relaxed text-zinc-500">{text}</dd>
              </div>
            ))}
          </motion.dl>
        </motion.div>

        {/* right: the build desk */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.1, ease: EASE, delay: 0.4 }}
          className="px-2 -mt-4 lg:-mt-28"
        >
          <BuildStage />
        </motion.div>
      </div>

      <Signature />
    </section>
  );
}