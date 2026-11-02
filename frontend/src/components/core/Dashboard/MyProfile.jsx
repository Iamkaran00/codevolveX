import React, { useEffect, useId, useMemo, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { motion, animate, useReducedMotion, useInView } from "framer-motion";
import { FcGoogle } from "react-icons/fc";
 
const USE_DEMO_ACTIVITY = true;

const EASE = [0.23, 1, 0.32, 1];
const DAYS = 182; // 26 weeks

const display = "font-['Space_Grotesk',ui-sans-serif,system-ui,sans-serif]";
const mono = "font-['JetBrains_Mono',ui-monospace,monospace]";

const ROLE_COLOR = {
  Student: "#ffb454",
  Instructor: "#9bd8bd",
  Admin: "#c8b2ff",
};

const LEVEL_CLASS = [
  "bg-white/[0.05]",
  "bg-[#ffb454]/25",
  "bg-[#ffb454]/45",
  "bg-[#ffb454]/70",
  "bg-[#ffb454]",
];
const LEVEL_LABEL = ["No activity", "Light", "Moderate", "Busy", "Deep focus"];

const GRAIN = `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.8' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>")`;
 

const clampN = (v, a, b) => Math.max(a, Math.min(b, v));

const mulberry32 = (a) => () => {
  a |= 0;
  a = (a + 0x6d2b79f5) | 0;
  let t = Math.imul(a ^ (a >>> 15), 1 | a);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};

const strHash = (s) => {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (Math.imul(31, h) + s.charCodeAt(i)) | 0;
  return h;
};

const buildActivity = (seed) => {
  const rng = mulberry32(strHash(seed));
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const out = [];
  let prev = false;
  for (let i = DAYS - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const weekend = d.getDay() === 0 || d.getDay() === 6;
    const p = (prev ? 0.74 : 0.34) * (weekend ? 0.8 : 1);
    const active = rng() < p;
    out.push({ date: d, level: active ? 1 + Math.floor(rng() * 4) : 0 });
    prev = active;
  }
  return out;
};

const calcStreaks = (days) => {
  let longest = 0;
  let run = 0;
  let active = 0;
  days.forEach((d) => {
    if (d.level > 0) {
      run++;
      active++;
      longest = Math.max(longest, run);
    } else {
      run = 0;
    }
  });
  let i = days.length - 1;
  if (days[i].level === 0) i--; 
  let current = 0;
  while (i >= 0 && days[i].level > 0) {
    current++;
    i--;
  }
  return { current, longest, active };
};

const formatDate = (value) => {
  if (!value) return "";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return String(value);
  return d.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

const greetingFor = (hour) => {
  if (hour < 5) return "Still up";
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  if (hour < 21) return "Good evening";
  return "Good night";
}; 
const CountUp = ({ to, reduce }) => {
  const [n, setN] = useState(reduce ? to : 0);
  useEffect(() => {
    if (reduce) {
      setN(to);
      return undefined;
    }
    const controls = animate(0, to, {
      duration: 1.6,
      ease: EASE,
      onUpdate: (v) => setN(Math.round(v)),
    });
    return () => controls.stop();
  }, [to, reduce]);
  return <>{n}</>;
};

const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.9, ease: EASE } },
};
const stagger = { show: { transition: { staggerChildren: 0.12 } } };

const Row = ({ label, value }) => (
  <div className="grid grid-cols-[110px_1fr] items-baseline gap-4 border-b border-white/[0.07] py-4 transition-colors duration-500 hover:border-[#ffb454]/30 sm:grid-cols-[160px_1fr]">
    <dt className="text-sm text-zinc-500">{label}</dt>
    <dd className="min-w-0 truncate text-[15px] text-zinc-100">
      {value ? (
        value
      ) : (
        <Link
          to="/settings"
          className="text-zinc-600 transition-colors duration-500 hover:text-[#ffb454]"
        >
          Add
        </Link>
      )}
    </dd>
  </div>
); 

const CW = 280; // card width
const CH = 410; // card height
const HOLE = 26; // card top -> lanyard hole
const NR = 15; 
const NP = NR + 1; // + the card's centre of mass
const STEP = 1 / 120;
const GRAV = 1800; // px/s^2
const DAMP = 0.9988;
const ITER = 22;

const LANYARD_CSS = `
.lb-inner { transform-style: preserve-3d; transition: transform .9s cubic-bezier(.23,1,.32,1); }
.lb-inner.is-flipped { transform: rotateY(180deg); }
.lb-face { backface-visibility: hidden; -webkit-backface-visibility: hidden; }
.lb-back { transform: rotateY(180deg); }
.lb-card { cursor: grab; }
.lb-card.is-grabbing { cursor: grabbing; }
.lb-glare {
  background: radial-gradient(280px circle at var(--gx, 50%) var(--gy, 25%), rgba(255,255,255,.16), transparent 62%);
}
`;

function LanyardBadge({ color, front, back, flipped, onFlip }) {
  const reduce = useReducedMotion();
  const pid = `lbstrap${useId().replace(/:/g, "")}`;

  const wrapRef = useRef(null);
  const cardRef = useRef(null);
  const tiltRef = useRef(null);
  const glareRef = useRef(null);
  const strapRef = useRef(null);
  const weaveRef = useRef(null);
  const textPathRef = useRef(null);
  const ringRef = useRef(null);
  const shadowRef = useRef(null);
  const api = useRef({});
  const visible = useRef(true);
  const flipCb = useRef(onFlip);
  flipCb.current = onFlip;

  const inView = useInView(wrapRef, { margin: "120px" });
  useEffect(() => {
    visible.current = inView;
  }, [inView]);

  useEffect(() => {
    const wrap = wrapRef.current;
    const cardEl = cardRef.current;
    if (!wrap || !cardEl) return undefined;

    let W = wrap.clientWidth;
    const seg = W < 640 ? 9.5 : 13;
    const D = CH / 2 - HOLE;
    const C = NP - 1;
    const reach = seg * (NR - 1) + D - 1;

    const X = new Float64Array(NP);
    const Y = new Float64Array(NP);
    const PX = new Float64Array(NP);
    const PY = new Float64Array(NP);
    const inv = new Float64Array(NP);
    for (let i = 0; i < NP; i += 1) inv[i] = i === 0 ? 0 : i < NR ? 1 / 0.6 : 1 / 7;

    
    const a0 = reduce ? 0 : 0.7;
    for (let i = 0; i < NR; i += 1) {
      X[i] = W / 2 + Math.sin(a0) * seg * i;
      Y[i] = Math.cos(a0) * seg * i;
    }
    X[C] = X[NR - 1] + Math.sin(a0) * D;
    Y[C] = Y[NR - 1] + Math.cos(a0) * D;
    PX.set(X);
    PY.set(Y);

    const drag = { on: false, moved: 0, ox: 0, oy: 0, tx: 0, ty: 0 };
    const tilt = { x: 0, y: 0, tx: 0, ty: 0 };
    let simT = 0;

    const step = () => {
      simT += STEP;
      X[0] = W / 2;
      Y[0] = 0;
      PX[0] = X[0];
      PY[0] = Y[0];

      const g = GRAV * STEP * STEP;
      const wind = reduce ? 0 : 0.0035 * (Math.sin(simT * 0.8) + 0.6 * Math.sin(simT * 1.9 + 1.3));

      for (let i = 1; i < NP; i += 1) {
        if (i === C && drag.on) continue;
        const vx = (X[i] - PX[i]) * DAMP;
        const vy = (Y[i] - PY[i]) * DAMP;
        PX[i] = X[i];
        PY[i] = Y[i];
        X[i] += vx + wind * (i / NP);
        Y[i] += vy + g;
      }

      if (drag.on) {
        PX[C] = X[C];
        PY[C] = Y[C];
        X[C] += (drag.tx - X[C]) * 0.3;
        Y[C] += (drag.ty - Y[C]) * 0.3;
      }

      for (let it = 0; it < ITER; it += 1) {
        X[0] = W / 2;
        Y[0] = 0;
        for (let i = 0; i < NP - 1; i += 1) {
          const L = i < NR - 1 ? seg : D;
          const dx = X[i + 1] - X[i];
          const dy = Y[i + 1] - Y[i];
          const d = Math.hypot(dx, dy) || 1e-6;
          const diff = (d - L) / d;
          const w0 = inv[i];
          const w1 = i + 1 === C && drag.on ? 0 : inv[i + 1];
          const ws = w0 + w1;
          if (ws === 0) continue;
          const f0 = w0 / ws;
          const f1 = w1 / ws;
          X[i] += dx * diff * f0;
          Y[i] += dy * diff * f0;
          X[i + 1] -= dx * diff * f1;
          Y[i + 1] -= dy * diff * f1;
        }
      }

      if (!drag.on) {
        const minX = CW / 2 - 50;
        const maxX = W - CW / 2 + 50;
        if (X[C] < minX) {
          const v = X[C] - PX[C];
          X[C] = minX;
          PX[C] = minX + v * 0.55;
        } else if (X[C] > maxX) {
          const v = X[C] - PX[C];
          X[C] = maxX;
          PX[C] = maxX + v * 0.55;
        }
      }
    };

    const draw = () => {
      let d = `M${X[0].toFixed(1)} ${Y[0].toFixed(1)}`;
      for (let i = 1; i < NR - 1; i += 1) {
        const mx = (X[i] + X[i + 1]) / 2;
        const my = (Y[i] + Y[i + 1]) / 2;
        d += ` Q${X[i].toFixed(1)} ${Y[i].toFixed(1)} ${mx.toFixed(1)} ${my.toFixed(1)}`;
      }
      d += ` L${X[NR - 1].toFixed(1)} ${Y[NR - 1].toFixed(1)}`;
      strapRef.current?.setAttribute("d", d);
      weaveRef.current?.setAttribute("d", d);
      textPathRef.current?.setAttribute("d", d);

      const px = X[NR - 1];
      const py = Y[NR - 1];
      const dx = X[C] - px;
      const dy = Y[C] - py;
      const rot = -Math.atan2(dx, dy);

      cardEl.style.transform = `translate3d(${px.toFixed(2)}px, ${py.toFixed(2)}px, 0) rotate(${rot.toFixed(4)}rad) translate(${-CW / 2}px, ${-HOLE}px)`;

      if (ringRef.current) {
        ringRef.current.setAttribute("cx", px.toFixed(1));
        ringRef.current.setAttribute("cy", py.toFixed(1));
      }

      if (shadowRef.current) {
        const off = (X[C] - W / 2) * 0.9;
        const s = 1 - Math.min(0.45, Math.abs(rot) * 0.5);
        shadowRef.current.style.transform = `translateX(${(W / 2 + off - 110).toFixed(1)}px) scaleX(${s.toFixed(3)})`;
        shadowRef.current.style.opacity = String(Math.max(0.15, 0.5 - Math.abs(rot) * 0.4).toFixed(3));
      }

      tilt.x += (tilt.tx - tilt.x) * 0.12;
      tilt.y += (tilt.ty - tilt.y) * 0.12;
      if (tiltRef.current) {
        tiltRef.current.style.transform = `perspective(1000px) rotateX(${(-tilt.y * 6).toFixed(2)}deg) rotateY(${(tilt.x * 8).toFixed(2)}deg)`;
      }
      if (glareRef.current) {
        glareRef.current.style.setProperty("--gx", `${(50 + tilt.x * 38).toFixed(1)}%`);
        glareRef.current.style.setProperty("--gy", `${(28 + tilt.y * 30).toFixed(1)}%`);
      }
    };

    const local = (e) => {
      const r = wrap.getBoundingClientRect();
      return [e.clientX - r.left, e.clientY - r.top];
    };

    api.current.down = (e) => {
      if (e.pointerType === "mouse" && e.button !== 0) return;
      const [wx, wy] = local(e);
      drag.on = true;
      drag.moved = 0;
      drag.ox = wx - X[C];
      drag.oy = wy - Y[C];
      drag.tx = X[C];
      drag.ty = Y[C];
      try {
        e.currentTarget.setPointerCapture(e.pointerId);
      } catch (err) {
        /* ignore */
      }
      cardEl.classList.add("is-grabbing");
    };

    api.current.move = (e) => {
      if (drag.on) {
        const [wx, wy] = local(e);
        let tx = wx - drag.ox;
        let ty = wy - drag.oy;
        const vx = tx - W / 2;
        const len = Math.hypot(vx, ty);
        if (len > reach) {
          tx = W / 2 + (vx / len) * reach;
          ty = (ty / len) * reach;
        }
        drag.tx = tx;
        drag.ty = ty;
        drag.moved += Math.abs(e.movementX || 0) + Math.abs(e.movementY || 0);
      } else if (!reduce && e.pointerType === "mouse") {
        const ix = clampN(e.movementX || 0, -30, 30);
        const iy = clampN(e.movementY || 0, -30, 30);
        PX[C] -= ix * 0.05;
        PY[C] -= iy * 0.05;
      }

      const t = tiltRef.current;
      if (t) {
        const r = t.getBoundingClientRect();
        tilt.tx = clampN((e.clientX - (r.left + r.width / 2)) / (r.width / 2), -1, 1);
        tilt.ty = clampN((e.clientY - (r.top + r.height / 2)) / (r.height / 2), -1, 1);
      }
    };

    api.current.up = (e) => {
      if (!drag.on) return;
      drag.on = false;
      cardEl.classList.remove("is-grabbing");
      if (drag.moved < 6) flipCb.current?.();
      try {
        e.currentTarget.releasePointerCapture(e.pointerId);
      } catch (err) {
        /* ignore */
      }
    };

    api.current.leave = () => {
      tilt.tx = 0;
      tilt.ty = 0;
    };

    const ro =
      typeof ResizeObserver !== "undefined"
        ? new ResizeObserver(() => {
            W = wrap.clientWidth;
          })
        : null;
    ro?.observe(wrap);

    let raf;
    let last = performance.now();
    const t0 = last;
    let acc = 0;
    const tick = (now) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      // wait for the page fade-in so the first swing is seen
      if (visible.current && now - t0 > 500) {
        acc += dt;
        let n = 0;
        while (acc >= STEP && n < 6) {
          step();
          acc -= STEP;
          n += 1;
        }
        if (n === 6) acc = 0;
      }
      draw();
      raf = requestAnimationFrame(tick);
    };
    draw();
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      ro?.disconnect();
    };
  }, [reduce]);

  return (
    <div ref={wrapRef} className="relative h-[600px] w-full select-none">
      <style>{LANYARD_CSS}</style>

      {/* ceiling hook */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-0 z-10 h-2 w-14 -translate-x-1/2 rounded-b-md bg-white/10"
      />
      <span
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-0 z-30 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-zinc-400 bg-[#100f0d]"
      />

      {/* floor shadow */}
      <div
        ref={shadowRef}
        aria-hidden
        className="pointer-events-none absolute bottom-8 left-0 h-6 w-[220px] rounded-[50%] bg-black blur-xl"
      />

      {/* strap (coloured by account type) */}
      <svg
        aria-hidden
        className="pointer-events-none absolute inset-0 z-10 h-full w-full overflow-visible"
      >
        <path ref={strapRef} fill="none" stroke={color} strokeWidth="14" strokeLinejoin="round" />
        <path
          ref={weaveRef}
          fill="none"
          stroke="rgba(29,26,22,0.22)"
          strokeWidth="14"
          strokeDasharray="1 5"
        />
        <path id={pid} ref={textPathRef} fill="none" stroke="none" />
        <text
          fontSize="7.5"
          fill="#1d1a16"
          letterSpacing="2.2"
          dominantBaseline="central"
          style={{ fontFamily: "'JetBrains Mono', ui-monospace, monospace", fontWeight: 600 }}
        >
          <textPath href={`#${pid}`} startOffset="12">
            CODEVOLVEX · CODEVOLVEX · CODEVOLVEX
          </textPath>
        </text>
      </svg>

      {/* the card */}
      <div
        ref={cardRef}
        className="lb-card absolute left-0 top-0 z-20"
        style={{
          width: CW,
          height: CH,
          transformOrigin: "0 0",
          willChange: "transform",
          touchAction: "none",
        }}
        onPointerDown={(e) => api.current.down?.(e)}
        onPointerMove={(e) => api.current.move?.(e)}
        onPointerUp={(e) => api.current.up?.(e)}
        onPointerCancel={(e) => api.current.up?.(e)}
        onPointerLeave={() => api.current.leave?.()}
      >
        <div ref={tiltRef} className="relative h-full w-full" style={{ transformStyle: "preserve-3d" }}>
          <div className={`lb-inner relative h-full w-full ${flipped ? "is-flipped" : ""}`}>
            <div className="lb-face absolute inset-0 overflow-hidden rounded-[22px]">
              {front}
              <div aria-hidden ref={glareRef} className="lb-glare pointer-events-none absolute inset-0" />
            </div>
            <div className="lb-face lb-back absolute inset-0 overflow-hidden rounded-[22px]">
              {back}
            </div>
          </div>
        </div>
      </div>

      {/* metal ring through the hole */}
      <svg
        aria-hidden
        className="pointer-events-none absolute inset-0 z-30 h-full w-full overflow-visible"
      >
        <circle ref={ringRef} r="5.5" fill="#100f0d" stroke="#c9c5bb" strokeWidth="2.5" />
      </svg>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  ID badge content                                                   */
/* ------------------------------------------------------------------ */

const Slot = ({ dark }) => (
  <span
    className={`absolute left-1/2 top-5 h-3 w-12 -translate-x-1/2 rounded-full ${
      dark ? "bg-[#100f0d] ring-1 ring-white/10" : "bg-[#1d1a16]/80"
    } shadow-[inset_0_2px_3px_rgba(0,0,0,0.5)]`}
  />
);

const Badge = ({ user, fullName, details, isGoogle }) => {
  const [flipped, setFlipped] = useState(false);
  const role = user?.accountType ?? "Student";
  const color = ROLE_COLOR[role] ?? ROLE_COLOR.Student;
  const idNo = `CX-${String(user?._id ?? user?.id ?? "000000")
    .slice(-6)
    .toUpperCase()}`;
  const issued = user?.createdAt ? new Date(user.createdAt).getFullYear() : "";
  const toggle = () => setFlipped((f) => !f);

  const front = (
    <div className="flex h-full w-full flex-col bg-[#f1eadc] text-[#1d1a16] shadow-[0_30px_60px_-30px_rgba(0,0,0,0.7)]">
      <div className="relative h-[84px] shrink-0" style={{ backgroundColor: color }}>
        <Slot />
        <span className={`absolute bottom-3 left-6 text-[11px] uppercase tracking-[0.2em] ${mono}`}>
          {role}
        </span>
        <span className={`absolute bottom-3 right-6 text-[13px] font-semibold tracking-tight ${display}`}>
          codevolveX
        </span>
      </div>

      <div className="flex flex-1 flex-col px-6 pt-6">
        <img
          src={user?.image}
          alt={fullName}
          draggable={false}
          className="h-24 w-24 rounded-2xl bg-[#ddd3c0] object-cover"
        />
        <h2 className={`mt-5 text-[26px] font-semibold leading-[1.1] tracking-tight ${display}`}>
          {fullName}
        </h2>
        <p className={`mt-2 break-all text-[11px] text-[#1d1a16]/60 ${mono}`}>{user?.email}</p>

        <div className="mt-auto pb-5">
          <div
            aria-hidden
            className="mb-3 h-7 w-full opacity-80"
            style={{
              backgroundImage:
                "repeating-linear-gradient(90deg,#1d1a16 0 2px,transparent 2px 4px,#1d1a16 4px 5px,transparent 5px 9px)",
            }}
          />
          <div className={`flex justify-between text-[10px] tracking-widest text-[#1d1a16]/60 ${mono}`}>
            <span>{idNo}</span>
            <span>{issued ? `ISSUED ${issued}` : "codevolveX"}</span>
          </div>
        </div>
      </div>
    </div>
  );

  const back = (
    <div className="relative flex h-full w-full flex-col border border-white/10 bg-[#1c1a17] p-6 shadow-[0_30px_60px_-30px_rgba(0,0,0,0.7)]">
      <Slot dark />
      <p className={`mt-9 text-[11px] uppercase tracking-[0.2em] text-zinc-500 ${mono}`}>Details</p>
      <dl className="mt-5 flex flex-col gap-4 text-sm">
        {[
          ["Phone", details?.contactNumber],
          ["Gender", details?.gender],
          ["Born", formatDate(details?.dateOfBirth)],
        ].map(([k, v]) => (
          <div key={k}>
            <dt className="text-xs text-zinc-500">{k}</dt>
            <dd className="mt-0.5 text-zinc-100">{v || "—"}</dd>
          </div>
        ))}
        <div>
          <dt className="text-xs text-zinc-500">Signed in with</dt>
          <dd className="mt-0.5 flex items-center gap-2 text-zinc-100">
            {isGoogle ? (
              <>
                <FcGoogle size={15} /> Google
              </>
            ) : (
              "Email & password"
            )}
          </dd>
        </div>
      </dl>
      <p className={`mt-auto text-[10px] tracking-widest text-zinc-600 ${mono}`}>{idNo}</p>
    </div>
  );

  return (
    <div className="relative mx-auto w-full max-w-[400px] lg:-mx-10 lg:w-[380px] lg:max-w-none">
      <LanyardBadge color={color} front={front} back={back} flipped={flipped} onFlip={toggle} />

      <div className="absolute bottom-0 left-0 right-0 flex items-center justify-center gap-3 text-xs text-zinc-600">
        <span>Grab it, throw it</span>
        <span className="h-1 w-1 rounded-full bg-zinc-700" />
        <button
          type="button"
          onClick={toggle}
          className="text-zinc-500 underline decoration-white/10 underline-offset-4 transition-colors duration-500 hover:text-[#ffb454] hover:decoration-[#ffb454]/40"
        >
          {flipped ? "Show front" : "Flip over"}
        </button>
      </div>
    </div>
  );
};

/* ------------------------------------------------------------------ */
/*  Learning rhythm (heatmap)                                          */
/* ------------------------------------------------------------------ */

const Rhythm = ({ days, reduce }) => {
  const { current, longest, active } = useMemo(() => calcStreaks(days), [days]);

  const { cells, cols, months } = useMemo(() => {
    const pad = days[0].date.getDay();
    const cells = [...Array(pad).fill(null), ...days];
    const cols = Math.ceil(cells.length / 7);
    const months = [];
    let lastMonth = -1;
    for (let c = 0; c < cols; c++) {
      const first = cells.slice(c * 7, c * 7 + 7).find(Boolean);
      if (first && first.date.getMonth() !== lastMonth) {
        lastMonth = first.date.getMonth();
        months.push({
          col: c,
          label: first.date.toLocaleDateString("en-US", { month: "short" }),
        });
      }
    }
    return { cells, cols, months };
  }, [days]);

  return (
    <section>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <h3 className={`text-2xl font-semibold tracking-tight text-[#f3ece0] ${display}`}>
          Learning rhythm
        </h3>
        <p className="text-xs text-zinc-600">
          Last 26 weeks{USE_DEMO_ACTIVITY ? " · preview data" : ""}
        </p>
      </div>

      <div className="mt-6 grid grid-cols-3 gap-6 border-y border-white/[0.07] py-6">
        {[
          [current, "Day streak"],
          [longest, "Longest streak"],
          [active, "Active days"],
        ].map(([n, label]) => (
          <div key={label}>
            <p className={`text-4xl font-semibold tabular-nums text-[#f3ece0] sm:text-5xl ${display}`}>
              <CountUp to={n} reduce={reduce} />
            </p>
            <p className="mt-1 text-xs text-zinc-500">{label}</p>
          </div>
        ))}
      </div>

      <div className="mt-6 overflow-x-auto pb-2">
        <div className="w-max">
          <div
            className="mb-2 grid text-[10px] text-zinc-600"
            style={{ gridTemplateColumns: `repeat(${cols}, 12px)`, columnGap: 4 }}
          >
            {months.map((m) => (
              <span key={m.col} className="whitespace-nowrap" style={{ gridColumn: m.col + 1 }}>
                {m.label}
              </span>
            ))}
          </div>
          <div
            className="grid"
            style={{
              gridTemplateRows: "repeat(7, 12px)",
              gridAutoFlow: "column",
              gridAutoColumns: "12px",
              gap: 4,
            }}
          >
            {cells.map((cell, i) =>
              cell ? (
                <motion.span
                  key={i}
                  title={`${cell.date.toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short",
                  })} · ${LEVEL_LABEL[cell.level]}`}
                  initial={reduce ? false : { opacity: 0, scale: 0.6 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{
                    duration: 0.7,
                    ease: EASE,
                    delay: reduce ? 0 : 0.4 + Math.floor(i / 7) * 0.025,
                  }}
                  className={`rounded-[3px] transition-colors duration-500 hover:bg-[#ffb454] ${LEVEL_CLASS[cell.level]}`}
                />
              ) : (
                <span key={i} />
              )
            )}
          </div>
        </div>
      </div>

      <div className="mt-3 flex items-center justify-end gap-1.5 text-[10px] text-zinc-600">
        Less
        {LEVEL_CLASS.map((c) => (
          <span key={c} className={`h-3 w-3 rounded-[3px] ${c}`} />
        ))}
        More
      </div>
    </section>
  );
};

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

const MyProfile = () => {
  const { user } = useSelector((state) => state.profile);
  const reduce = useReducedMotion();

  const days = useMemo(
    () => buildActivity(String(user?._id ?? user?.email ?? "codevolvex")),
    [user?._id, user?.email]
  );

  if (!user) return null;

  const fullName = `${user?.firstName ?? ""} ${user?.lastName ?? ""}`.trim();
  const details = user?.additionalDetails ?? {};
  const isGoogle = user?.authProvider === "google";
  const courses = user?.courses?.length ?? 0;
  const since = user?.createdAt ? new Date(user.createdAt).getFullYear() : null;

  const checks = [
    user?.firstName,
    user?.lastName,
    user?.email,
    user?.image,
    details?.contactNumber,
    details?.gender,
    details?.dateOfBirth,
    details?.about,
  ];
  const pct = Math.round((checks.filter(Boolean).length / checks.length) * 100);

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-[#100f0d] px-5 pb-28 pt-20 text-zinc-200">
      {/* soft film grain: warmth without glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.06] mix-blend-overlay"
        style={{ backgroundImage: GRAIN }}
      />

      <motion.div
        variants={stagger}
        initial="hidden"
        animate="show"
        className="relative mx-auto grid w-full max-w-6xl gap-16 lg:grid-cols-[300px_1fr] lg:gap-20"
      >
        {/* left: hanging badge */}
        <motion.div variants={fadeUp} className="lg:sticky lg:top-16 lg:self-start">
          <Badge user={user} fullName={fullName} details={details} isGoogle={isGoogle} />
        </motion.div>

        {/* right: everything else, editorial style */}
        <div className="flex min-w-0 flex-col gap-16 pt-2 lg:pt-12">
          <motion.header variants={fadeUp}>
            <div className="flex items-start justify-between gap-6">
              <p className="text-sm text-zinc-500">
                {new Date().toLocaleDateString("en-IN", {
                  weekday: "long",
                  day: "numeric",
                  month: "long",
                })}
              </p>
              <Link
                to="/settings"
                className="rounded-full border border-white/15 px-4 py-1.5 text-sm text-zinc-300 transition-all duration-500 hover:border-[#ffb454]/60 hover:bg-[#ffb454]/10 hover:text-[#ffb454]"
              >
                Edit profile
              </Link>
            </div>

            <h1
              className={`mt-5 text-5xl font-semibold leading-[1.04] tracking-tight text-[#f3ece0] sm:text-6xl ${display}`}
            >
              {greetingFor(new Date().getHours())},
              <br />
              <span className="text-[#ffb454]">{user?.firstName}.</span>
            </h1>

            <p className="mt-5 text-[15px] text-zinc-500">
              {user?.accountType}
              {" · "}
              {courses} {courses === 1 ? "course" : "courses"}
              {since ? ` · member since ${since}` : ""}
            </p>
          </motion.header>

          <motion.div variants={fadeUp}>
            <Rhythm days={days} reduce={reduce} />
          </motion.div>

          <motion.section variants={fadeUp}>
            <h3 className={`text-2xl font-semibold tracking-tight text-[#f3ece0] ${display}`}>
              About
            </h3>
            {details?.about ? (
              <p className="mt-4 max-w-prose text-lg leading-relaxed text-zinc-300">
                {details.about}
              </p>
            ) : (
              <p className="mt-4 max-w-prose text-lg leading-relaxed text-zinc-600">
                Nothing here yet.{" "}
                <Link
                  to="/settings"
                  className="text-zinc-400 underline decoration-white/15 underline-offset-4 transition-colors duration-500 hover:text-[#ffb454] hover:decoration-[#ffb454]/40"
                >
                  Write a few lines about yourself
                </Link>
                .
              </p>
            )}
          </motion.section>

          <motion.section variants={fadeUp}>
            <div className="flex items-end justify-between gap-4">
              <h3 className={`text-2xl font-semibold tracking-tight text-[#f3ece0] ${display}`}>
                Details
              </h3>
              <p className="text-xs text-zinc-600">Profile {pct}% complete</p>
            </div>
            <div className="mt-3 h-px w-full bg-white/[0.07]">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${pct}%` }}
                transition={{ duration: 1.6, ease: EASE, delay: 0.6 }}
                className="h-px bg-[#ffb454]"
              />
            </div>
            <dl>
              <Row label="First name" value={user?.firstName} />
              <Row label="Last name" value={user?.lastName} />
              <Row label="Email" value={user?.email} />
              <Row label="Phone" value={details?.contactNumber} />
              <Row label="Gender" value={details?.gender} />
              <Row label="Date of birth" value={formatDate(details?.dateOfBirth)} />
            </dl>
          </motion.section>
        </div>
      </motion.div>
    </div>
  );
};

export default MyProfile;