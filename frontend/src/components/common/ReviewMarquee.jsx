import React, { useEffect, useMemo, useRef, useState } from "react";
import { Star, Quote } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { getAllReviews } from "../../services/operations/courseApi";

const EASE = [0.23, 1, 0.32, 1];
const MIN_PER_ROW = 6;
const BASE_SPEED = 62; // px per second

const display = "font-['Space_Grotesk',ui-sans-serif,system-ui,sans-serif]";
const mono = "font-['JetBrains_Mono',ui-monospace,monospace]";

const GRAIN = `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.8' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>")`;

const DROPS = [30, 54, 40, 66];
const MAX_DROP = 66;
const CARD_H = 280;

/* ---------------- wire (1D wave equation) ---------------- */
const TOP_PAD = 70;
const PULL_UP = -70;
const PULL_DOWN = 150;
const BOTTOM_PAD = 140;
const WAVE_SPEED = 1100;
const K_REST = 14;
const K_PULL = 140;
const SIGMA = 110;
const SUBSTEPS = 6;

/* ---------------- page-scroll disturbance ---------------- */
const SCROLL_KICK = 3.2;
const SCROLL_VMAX = 520;
const SCROLL_REACH = 1.5;
const ENTER_KICK = 0.22;

/* ---------------- pendulum + coupling physics ---------------- */
const G = 1900; // gravity in px/s^2 (tuned so a card swings with a ~2s period)
const DAMP = 0.42; // angular drag (underdamped: cards keep swinging a while)
const PHI_MAX = 1.15; // rad, hard stop so cards never flip over the wire
const CARD_LOAD = 95; // how hard a hanging card pulls the wire down
const RESTITUTION = 0.55; // bounciness of card-to-card collisions
const WIND = 34; // gentle ambient push, px/s^2
const PN = 36; // spark pool size

const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

const nameOf = (r) =>
  `${r.user?.firstName || ""} ${r.user?.lastName || ""}`.trim() || "Student";

const initialsOf = (r) =>
  `${r.user?.firstName?.charAt(0) || ""}${r.user?.lastName?.charAt(0) || ""}` ||
  "?";

const handleOf = (r) =>
  (r.user?.firstName || "student").toLowerCase().replace(/[^a-z0-9]/g, "") ||
  "student";

const sampleWire = (arr, sp, N, x) => {
  const f = clamp(x / sp, 0, N - 1);
  const i = Math.min(N - 2, Math.floor(f));
  const t = f - i;
  return arr[i] * (1 - t) + arr[i + 1] * t;
};

function Stars({ rating = 5, size = 12 }) {
  const full = Math.floor(rating);
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          size={size}
          className={
            i < full
              ? "fill-[#ffb454] text-[#ffb454]"
              : "fill-transparent text-zinc-700"
          }
        />
      ))}
    </div>
  );
}

function HangingCard({ r, i, width, setPos, setClip, setMag, onEnter, onMove, onLeave, onFlip }) {
  const drop = DROPS[i % DROPS.length];

  return (
    <div
      ref={(el) => setPos(i, el)}
      className="absolute left-0 top-0 z-20 px-3"
      style={{ width, willChange: "transform", transformOrigin: "50% 0" }}
    >
      {/* swing is now driven entirely by the physics loop (no CSS keyframes) */}
      <div className="relative">
        {/* clip sitting on the wire */}
        <span
          ref={(el) => setClip(i, el)}
          className="absolute left-1/2 top-[-13px] z-20 h-[26px] w-[11px] rounded-[3px] bg-[#ffb454] shadow-[0_2px_8px_rgba(255,180,84,0.35)]"
          style={{ transform: "translateX(-50%)" }}
        >
          <span className="absolute left-0 top-[11px] h-px w-full bg-[#1d1a16]/40" />
          <span className="absolute left-1/2 top-[5px] h-1 w-1 -translate-x-1/2 rounded-full bg-[#1d1a16]/50" />
        </span>

        <svg
          aria-hidden
          className="relative z-10 block w-full"
          style={{ height: drop }}
          preserveAspectRatio="none"
        >
          <line x1="50%" y1="0" x2="14%" y2="100%" stroke="rgba(243,236,224,0.28)" strokeWidth="1" vectorEffect="non-scaling-stroke" />
          <line x1="50%" y1="0" x2="86%" y2="100%" stroke="rgba(243,236,224,0.28)" strokeWidth="1" vectorEffect="non-scaling-stroke" />
        </svg>

        <div
          ref={(el) => setMag(i, el)}
          onMouseEnter={onEnter}
          onMouseMove={(e) => onMove(i, e)}
          onMouseLeave={() => onLeave(i)}
          style={{ willChange: "transform" }}
        >
          <div className="rv-card" style={{ height: CARD_H }} tabIndex={0} onClick={onFlip}>
            <div className="rv-inner relative h-full w-full">
              {/* front */}
              <div className="rv-face absolute inset-0 flex flex-col overflow-hidden rounded-3xl border border-white/[0.09] bg-[#14130f]">
                <div className="flex items-center gap-2.5 border-b border-white/[0.07] px-5 py-3">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#ffb454]" />
                  <span className={`truncate text-[10.5px] text-zinc-500 ${mono}`}>
                    review_{handleOf(r)}.log
                  </span>
                </div>

                <div className="relative min-h-0 flex-1 px-5 pt-4">
                  <Quote
                    size={30}
                    className="absolute right-5 top-4 text-transparent"
                    style={{ stroke: "rgba(243,236,224,0.18)" }}
                  />
                  <p className="line-clamp-5 pr-6 text-[14.5px] leading-relaxed text-[#e6dfd3]">
                    {r.review}
                  </p>
                </div>

                <div className="flex items-center justify-between gap-3 border-t border-white/[0.07] px-5 py-3.5">
                  <span className={`truncate text-[11px] text-[#ffb454] ${mono}`}>
                    {handleOf(r)}@codevolvex
                  </span>
                  <Stars rating={r.rating || 5} />
                </div>
              </div>

              {/* back */}
              <div className="rv-face rv-back absolute inset-0 overflow-hidden rounded-3xl border border-[#ffb454]/50 bg-[#14130f]">
                {r.user?.image ? (
                  <img
                    src={r.user.image}
                    alt={nameOf(r)}
                    draggable={false}
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                ) : (
                  <div
                    className={`absolute inset-0 flex items-center justify-center bg-gradient-to-br from-[#2a2112] to-[#14130f] text-8xl font-bold text-[#ffb454]/40 ${display}`}
                  >
                    {initialsOf(r)}
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />
                <div className="absolute inset-0 flex flex-col justify-end p-5">
                  <Stars rating={r.rating || 5} size={13} />
                  <p className={`mt-2 truncate text-xl font-semibold tracking-tight text-[#f3ece0] ${display}`}>
                    {nameOf(r)}
                  </p>
                  <p className={`truncate text-[11px] text-[#ffb454] ${mono}`}>
                    {r.course?.courseName || "CodevolveX student"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ReviewsMarquee() {
  const reduce = useReducedMotion();
  const [reviews, setReviews] = useState([]);
  const [W, setW] = useState(0);
  const wrapRef = useRef(null);

  const posEls = useRef([]);
  const clipEls = useRef([]);
  const magEls = useRef([]);
  const magState = useRef([]);
  const pend = useRef([]); // per-card pendulum state
  const hovered = useRef(false);

  const wirePathEl = useRef(null);
  const glowPathEl = useRef(null);
  const sparkEl = useRef(null);
  const sparkGlowEl = useRef(null);
  const partEls = useRef([]);

  const sc = useRef({
    scroll: 0,
    travel: 0, // unwrapped scroll, used to get true pivot acceleration
    speed: 0,
    down: false,
    dragging: false,
    moved: 0,
    lastX: 0,
    lastT: 0,
    startY: 0,
    px: 0,
    pull: 0,
    pinned: 0,
    snap: null,
    centers: [],
  });

  useEffect(() => {
    async function load() {
      const data = await getAllReviews();
      setReviews(data || []);
    }
    load();
  }, []);

  // measure the wire's width
  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return undefined;
    const update = () => setW(el.clientWidth);
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, [reviews.length]);

  const CARD_W = W && W < 640 ? 300 : 352;
  const SAG = W && W < 640 ? 34 : 64;

  const items = useMemo(() => {
    if (!reviews.length || !W) return [];
    const needed = Math.max(MIN_PER_ROW, Math.ceil((W + 2 * CARD_W) / CARD_W));
    const reps = Math.ceil(needed / reviews.length);
    return Array.from({ length: reps }, () => reviews).flat();
  }, [reviews, W, CARD_W]);

  useEffect(() => {
    const S = sc.current;

    const move = (e) => {
      if (!S.down) return;
      const now = performance.now();
      const dx = e.clientX - S.lastX;
      const dy = e.clientY - S.startY;
      const dt = Math.max(1, now - S.lastT) / 1000;
      S.moved += Math.abs(dx);

      if (!S.dragging && (S.moved > 6 || Math.abs(dy) > 6)) {
        S.dragging = true;
        hovered.current = false;
        wrapRef.current?.classList.add("rv-dragging");
      }

      const rect = wrapRef.current?.getBoundingClientRect();
      if (rect) S.px = e.clientX - rect.left;

      if (S.dragging) {
        S.scroll -= dx;
        S.travel -= dx;
        S.speed = clamp(S.speed * 0.6 + (-dx / dt) * 0.4, -2500, 2500);
        S.pull = clamp(dy, PULL_UP, PULL_DOWN);
      }
      S.lastX = e.clientX;
      S.lastT = now;
    };

    const up = () => {
      if (!S.down) return;
      S.down = false;
      // a hard pull that is released snaps back and throws sparks
      if (S.dragging && Math.abs(S.pull) > 35) S.snap = { x: S.px, p: Math.abs(S.pull) };
      S.pull = 0;
      if (S.dragging) {
        S.dragging = false;
        wrapRef.current?.classList.remove("rv-dragging");
      }
    };

    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
    window.addEventListener("pointercancel", up);
    return () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
      window.removeEventListener("pointercancel", up);
    };
  }, []);

  // frame loop: marquee slide + wire physics + pendulum cards + collisions + sparks
  useEffect(() => {
    if (!W || !items.length) return undefined;

    const S = sc.current;
    const n = items.length;
    const total = n * CARD_W;
    let last = performance.now();
    let raf;

    const N = clamp(Math.round(W / 30) + 1, 24, 64);
    const sp = W / (N - 1);
    const C = (WAVE_SPEED / sp) ** 2;
    const y = new Float64Array(N);
    const v = new Float64Array(N);
    const rest = new Float64Array(N);
    const load = new Float64Array(N); // downward force the cards put on the wire
    for (let i = 0; i < N; i += 1) {
      const u = (i * sp - W / 2) / (W / 2);
      rest[i] = TOP_PAD + 2 + SAG * (1 - u * u);
      y[i] = rest[i];
    }
    S.px = W / 2;

    // per-card scratch
    const cxArr = new Float64Array(n);
    const ywArr = new Float64Array(n);
    const lpArr = new Float64Array(n); // pendulum length
    const lcArr = new Float64Array(n); // collision lever (lower part of the card)
    for (let i = 0; i < n; i += 1) {
      const drop = DROPS[i % DROPS.length];
      lpArr[i] = drop + CARD_H * 0.55;
      lcArr[i] = drop + CARD_H * 0.75;
      if (!pend.current[i]) pend.current[i] = { a: 0, w: 0, py: 0, ay: 0 };
    }

    // sparks
    const pxs = new Float64Array(PN);
    const pys = new Float64Array(PN);
    const pvx = new Float64Array(PN);
    const pvy = new Float64Array(PN);
    const plife = new Float64Array(PN);
    const emit = (x, yy, count, power) => {
      if (reduce) return;
      let made = 0;
      for (let k = 0; k < PN && made < count; k += 1) {
        if (plife[k] > 0) continue;
        const ang = -Math.PI / 2 + (Math.random() - 0.5) * 2.4;
        const sp2 = power * (0.35 + Math.random() * 0.75);
        pxs[k] = x;
        pys[k] = yy;
        pvx[k] = Math.cos(ang) * sp2;
        pvy[k] = Math.sin(ang) * sp2;
        plife[k] = 0.6 + Math.random() * 0.7;
        made += 1;
      }
    };

    let lastScrollY = window.scrollY;
    let scrollVel = 0;
    let wasVisible = false;

    // pivot kinematics
    let lastTravel = S.travel;
    let pvel = 0; // pivot (wire clip) horizontal velocity, px/s
    let pacc = 0; // smoothed horizontal acceleration, px/s^2

    const stepWire = (h) => {
      const active = S.dragging;
      const damp = active ? 5 : 1.5;
      for (let i = 1; i < N - 1; i += 1) {
        let a =
          K_REST * (rest[i] - y[i]) +
          C * (y[i - 1] + y[i + 1] - 2 * y[i]) -
          load[i];
        if (active) {
          const q = (i * sp - S.px) / SIGMA;
          const w = Math.exp(-q * q);
          if (w > 0.01) a += w * K_PULL * (rest[i] + S.pull - y[i]);
        }
        v[i] += a * h;
        v[i] -= v[i] * damp * h;
      }
      for (let i = 1; i < N - 1; i += 1) y[i] += v[i] * h;
    };

    const drawWire = (now, energy) => {
      let d = `M0 ${y[0].toFixed(1)}`;
      for (let i = 1; i < N - 1; i += 1) {
        const mx = (i * sp + (i + 1) * sp) / 2;
        const my = (y[i] + y[i + 1]) / 2;
        d += ` Q${(i * sp).toFixed(1)} ${y[i].toFixed(1)} ${mx.toFixed(1)} ${my.toFixed(1)}`;
      }
      d += ` L${W} ${y[N - 1].toFixed(1)}`;
      wirePathEl.current?.setAttribute("d", d);
      glowPathEl.current?.setAttribute("d", d);

      // the wire heats up when it is vibrating
      const heat = clamp(energy / 220, 0, 1);
      glowPathEl.current?.setAttribute("stroke", `rgba(255,180,84,${(0.1 + heat * 0.45).toFixed(3)})`);
      glowPathEl.current?.setAttribute("stroke-width", (5 + heat * 7).toFixed(1));
      wirePathEl.current?.setAttribute(
        "stroke",
        `rgba(${Math.round(161 + heat * 94)},${Math.round(161 + heat * 19)},${Math.round(170 - heat * 86)},${(0.55 + heat * 0.4).toFixed(3)})`
      );

      // a spark that rides the wire
      if (sparkEl.current && sparkGlowEl.current) {
        const t = ((now / 1000) / 9) % 1;
        const sx = t * W;
        const sy = sampleWire(y, sp, N, sx);
        sparkEl.current.setAttribute("cx", sx);
        sparkEl.current.setAttribute("cy", sy);
        sparkGlowEl.current.setAttribute("cx", sx);
        sparkGlowEl.current.setAttribute("cy", sy);
      }
    };

    /* ---- cards ---- */
    const place = (dt, now, t) => {
      load.fill(0);
      const sub = 2;
      const h = dt / sub;

      // 1) integrate each card as a real damped pendulum hanging from a moving, bouncing pivot
      for (let i = 0; i < n; i += 1) {
        const base = i * CARD_W - S.scroll;
        const x = (((base % total) + total) % total) - CARD_W;
        const cx = x + CARD_W / 2;
        cxArr[i] = cx;
        S.centers[i] = cx;

        const yw = sampleWire(y, sp, N, cx);
        ywArr[i] = yw;

        const P = pend.current[i];
        const Lp = lpArr[i];

        // vertical acceleration of the wire at this card changes effective gravity
        const wvy = sampleWire(v, sp, N, cx);
        if (dt > 0) {
          const ayRaw = clamp((wvy - P.py) / dt, -4000, 4000);
          P.ay += (ayRaw - P.ay) * Math.min(1, dt * 25);
        }
        P.py = wvy;
        const gEff = Math.max(G * 0.25, G - P.ay);

        // ambient wind: each card gets its own slow gust
        const wind = reduce ? 0 : WIND * (Math.sin(t * 0.7 + i * 1.7) + 0.6 * Math.sin(t * 1.9 + i * 0.9));

        const ax = pacc + wind;

        for (let s = 0; s < sub; s += 1) {
          const acc =
            -(gEff / Lp) * Math.sin(P.a) -
            (ax / Lp) * Math.cos(P.a) -
            DAMP * P.w -
            0.05 * Math.abs(P.w) * P.w;
          P.w += acc * h;
          P.a += P.w * h;
          if (P.a > PHI_MAX) {
            P.a = PHI_MAX;
            if (P.w > 0) P.w *= -0.3;
          } else if (P.a < -PHI_MAX) {
            P.a = -PHI_MAX;
            if (P.w < 0) P.w *= -0.3;
          }
        }

        // reaction: the card's weight and swing tension pull the wire down
        if (cx > 0 && cx < W) {
          const tension = CARD_LOAD * (Math.cos(P.a) + (Lp * P.w * P.w) / G);
          const f = clamp(cx / sp, 0, N - 1.001);
          const i0 = Math.floor(f);
          const tt = f - i0;
          load[i0] += tension * (1 - tt);
          load[i0 + 1] += tension * tt;
        }
      }

      // 2) card-to-card collisions (neighbours bump their lower edges together)
      const minGap = CARD_W - 24 - 2;
      for (let i = 0; i < n; i += 1) {
        const j = (i + 1) % n;
        if (j === i) continue;
        const gapPivot = cxArr[j] - cxArr[i];
        if (gapPivot < CARD_W * 0.5 || gapPivot > CARD_W * 1.5) continue;

        const A = pend.current[i];
        const B = pend.current[j];
        const la = lcArr[i];
        const lb = lcArr[j];
        const bxA = cxArr[i] + la * Math.sin(A.a);
        const bxB = cxArr[j] + lb * Math.sin(B.a);
        const gap = bxB - bxA;

        if (gap < minGap) {
          const pen = minGap - gap;
          // positional push-apart
          A.a -= (pen * 0.5) / la;
          B.a += (pen * 0.5) / lb;
          // velocity of the contact points along x
          const vA = la * Math.cos(A.a) * A.w;
          const vB = lb * Math.cos(B.a) * B.w;
          const rel = vA - vB; // > 0 means they are closing
          if (rel > 0) {
            const jImp = ((1 + RESTITUTION) * rel) / 2;
            A.w -= jImp / la;
            B.w += jImp / lb;
            if (rel > 70 && cxArr[i] > 0 && cxArr[i] < W) {
              const hitY = ywArr[i] + DROPS[i % DROPS.length] + CARD_H * 0.72;
              emit((bxA + bxB) / 2 + CARD_W * 0.0, hitY, Math.min(8, Math.round(rel / 60)), clamp(rel * 0.9, 120, 520));
            }
          }
        }
      }

      // 3) write transforms
      for (let i = 0; i < n; i += 1) {
        const el = posEls.current[i];
        if (!el) continue;
        const cx = cxArr[i];
        const yw = ywArr[i];
        const slope = (sampleWire(y, sp, N, cx + 6) - sampleWire(y, sp, N, cx - 6)) / 12;
        const P = pend.current[i];

        el.style.transform = `translate3d(${cx - CARD_W / 2}px, ${yw}px, 0) rotate(${(-P.a * 57.2958).toFixed(3)}deg)`;

        const clip = clipEls.current[i];
        if (clip) clip.style.transform = `translateX(-50%) rotate(${Math.atan(slope)}rad)`;

        // magnetic easing
        const s = magState.current[i];
        const mag = magEls.current[i];
        if (s && mag) {
          const k = 0.14;
          s.x += (s.tx - s.x) * k;
          s.y += (s.ty - s.y) * k;
          s.rx += (s.trx - s.rx) * k;
          s.ry += (s.try - s.ry) * k;
          s.s += (s.ts - s.s) * k;
          mag.style.transform = `perspective(900px) translate3d(${s.x}px, ${s.y}px, 0) rotateX(${s.rx}deg) rotateY(${s.ry}deg) scale(${s.s})`;
        }
      }
    };

    const stepParticles = (dt) => {
      for (let k = 0; k < PN; k += 1) {
        const el = partEls.current[k];
        if (!el) continue;
        if (plife[k] <= 0) {
          if (el.getAttribute("opacity") !== "0") el.setAttribute("opacity", "0");
          continue;
        }
        pvy[k] += 1300 * dt;
        pvx[k] *= 1 - Math.min(1, dt * 1.2);
        pxs[k] += pvx[k] * dt;
        pys[k] += pvy[k] * dt;
        plife[k] -= dt * 1.5;
        const a = clamp(plife[k], 0, 1);
        el.setAttribute("cx", pxs[k].toFixed(1));
        el.setAttribute("cy", pys[k].toFixed(1));
        el.setAttribute("r", (1 + a * 2.2).toFixed(2));
        el.setAttribute("opacity", a.toFixed(2));
      }
    };

    let simT = 0;

    const tick = (now) => {
      const dt = Math.min(0.033, (now - last) / 1000);
      last = now;
      simT += dt;

      if (S.dragging) {
        S.speed += (0 - S.speed) * Math.min(1, dt * 8);
      } else {
        const paused = hovered.current || S.pinned > 0;
        const targetSpeed = paused ? 0 : BASE_SPEED * (reduce ? 0.4 : 1);
        const rate = Math.abs(S.speed) > BASE_SPEED * 1.5 ? 2 : 5;
        S.speed += (targetSpeed - S.speed) * Math.min(1, dt * rate);
        S.scroll += S.speed * dt;
        S.travel += S.speed * dt;
      }
      S.scroll = ((S.scroll % total) + total) % total;

      // true pivot kinematics: cards move opposite to the scroll direction
      if (dt > 0) {
        const newV = -(S.travel - lastTravel) / dt;
        lastTravel = S.travel;
        const accRaw = clamp((newV - pvel) / dt, -7000, 7000);
        pvel = newV;
        pacc += (accRaw - pacc) * Math.min(1, dt * 18);
      }

      // page scroll shakes the wire
      const scrollY = window.scrollY;
      const dScroll = scrollY - lastScrollY;
      lastScrollY = scrollY;
      scrollVel += (dScroll / Math.max(dt, 0.001) - scrollVel) * Math.min(1, dt * 10);
      if (!reduce && wrapRef.current) {
        const r = wrapRef.current.getBoundingClientRect();
        const vh = window.innerHeight;
        const visible = r.bottom > 0 && r.top < vh;
        const near = r.top < vh * (1 + SCROLL_REACH) && r.bottom > -vh * 0.5;

        let kick = 0;
        if (near && dScroll !== 0) kick += clamp(dScroll, -90, 90) * SCROLL_KICK;
        if (visible && !wasVisible) kick += clamp(scrollVel * ENTER_KICK, -SCROLL_VMAX, SCROLL_VMAX);
        wasVisible = visible;

        if (kick !== 0) {
          for (let i = 1; i < N - 1; i += 1) {
            const shape = Math.sin((Math.PI * i) / (N - 1));
            const ripple = 1 + 0.45 * Math.sin(i * 0.55 + now / 140);
            v[i] = clamp(v[i] + kick * shape * ripple, -SCROLL_VMAX, SCROLL_VMAX);
          }
        }
      }

      // snap-back burst when a hard pull is released
      if (S.snap) {
        const { x, p } = S.snap;
        S.snap = null;
        for (let k = 0; k < 3; k += 1) {
          const sx = clamp(x + (Math.random() - 0.5) * 120, 10, W - 10);
          emit(sx, sampleWire(y, sp, N, sx), 4, clamp(p * 3.2, 160, 520));
        }
      }

      const h = dt / SUBSTEPS;
      for (let k = 0; k < SUBSTEPS; k += 1) stepWire(h);

      let e2 = 0;
      for (let i = 0; i < N; i += 1) e2 += v[i] * v[i];
      const energy = Math.sqrt(e2 / N);

      place(dt, now, simT);
      stepParticles(dt);
      drawWire(now, energy);
      raf = requestAnimationFrame(tick);
    };

    place(0, last, 0);
    drawWire(0, 0);
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [W, items, CARD_W, SAG, reduce]);

  const setPos = (i, el) => { posEls.current[i] = el; };
  const setClip = (i, el) => { clipEls.current[i] = el; };
  const setMag = (i, el) => {
    magEls.current[i] = el;
    if (!magState.current[i]) {
      magState.current[i] = { x: 0, y: 0, rx: 0, ry: 0, s: 1, tx: 0, ty: 0, trx: 0, try: 0, ts: 1 };
    }
  };

  const onEnter = () => { hovered.current = true; };
  const onMove = (i, e) => {
    const s = magState.current[i];
    if (!s) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const dx = (e.clientX - (rect.left + rect.width / 2)) / (rect.width / 2);
    const dy = (e.clientY - (rect.top + rect.height / 2)) / (rect.height / 2);
    s.tx = dx * 14;
    s.ty = dy * 10;
    s.try = dx * 10;
    s.trx = -dy * 8;
    s.ts = 1.045;
  };
  const onLeave = (i) => {
    hovered.current = false;
    const s = magState.current[i];
    if (!s) return;
    s.tx = 0; s.ty = 0; s.trx = 0; s.try = 0; s.ts = 1;
  };

  const onFlip = (e) => {
    const S = sc.current;
    if (S.moved > 6) return;
    if (!window.matchMedia("(hover: none)").matches) return;
    const on = e.currentTarget.classList.toggle("is-flipped");
    S.pinned = Math.max(0, S.pinned + (on ? 1 : -1));
  };

  const onWrapDown = (e) => {
    if (e.pointerType === "mouse" && e.button !== 0) return;
    const S = sc.current;
    const rect = wrapRef.current?.getBoundingClientRect();
    S.down = true;
    S.moved = 0;
    S.lastX = e.clientX;
    S.lastT = performance.now();
    S.startY = e.clientY;
    S.px = rect ? e.clientX - rect.left : S.px;
  };

  // moving the mouse across the wire brushes nearby cards (real angular impulse)
  const onWrapMove = (e) => {
    const S = sc.current;
    if (S.down || reduce || e.pointerType !== "mouse") return;
    const dx = clamp(e.movementX || 0, -40, 40);
    if (!dx || !wrapRef.current) return;
    const px = e.clientX - wrapRef.current.getBoundingClientRect().left;
    for (let i = 0; i < S.centers.length; i += 1) {
      const c = S.centers[i];
      const P = pend.current[i];
      if (c == null || !P) continue;
      const d = Math.abs(c - px);
      if (d < 220) P.w += dx * 0.014 * (1 - d / 220);
    }
  };

  if (reviews.length === 0) return null;

  const stageH = TOP_PAD + SAG + 2 + MAX_DROP + CARD_H + BOTTOM_PAD;

  return (
    <section className="relative overflow-hidden bg-[#100f0d] py-24 sm:py-32">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.06] mix-blend-overlay"
        style={{ backgroundImage: GRAIN }}
      />

      {/* header */}
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.95, ease: EASE }}
        className="relative mx-auto mb-4 flex max-w-7xl flex-col justify-between gap-8 px-5 sm:px-8 lg:flex-row lg:items-end"
      >
        <div>
          <div className="flex items-center gap-3">
            <span className="h-px w-8 bg-[#ffb454]" />
            <p className={`text-[11px] uppercase tracking-[0.25em] text-zinc-500 ${mono}`}>
              $ cat reviews.log
            </p>
          </div>
          <h2
            className={`mt-6 text-4xl font-semibold leading-[1.04] tracking-tight text-[#f3ece0] sm:text-6xl ${display}`}
          >
            Don't just take
            <br />
            our word for it<span className="text-[#ffb454]">.</span>
          </h2>
        </div>
        <p className="max-w-md text-lg leading-relaxed text-zinc-400">
          Real reviews from learners on CodevolveX. Grab the wire, fling it,
          pull it hard and let go. The cards swing, bump and throw sparks.
        </p>
      </motion.div>

      {/* the wire */}
      <div
        ref={wrapRef}
        onPointerDown={onWrapDown}
        onPointerMove={onWrapMove}
        className="rv-wrap relative w-full cursor-grab select-none"
        style={{
          touchAction: "pan-y",
          WebkitMaskImage:
            "linear-gradient(to right, transparent, #000 9%, #000 91%, transparent)",
          maskImage:
            "linear-gradient(to right, transparent, #000 9%, #000 91%, transparent)",
        }}
      >
        {W > 0 && (
          <div className="relative" style={{ height: stageH }}>
            <svg
              aria-hidden
              className="pointer-events-none absolute left-0 top-0 z-10 overflow-visible"
              width={W}
              height={stageH}
            >
              <path ref={glowPathEl} fill="none" stroke="rgba(255,180,84,0.10)" strokeWidth="5" />
              <path ref={wirePathEl} fill="none" stroke="rgba(161,161,170,0.55)" strokeWidth="1.6" />
              {!reduce && (
                <>
                  <circle ref={sparkGlowEl} r="9" fill="rgba(255,180,84,0.18)" />
                  <circle ref={sparkEl} r="3" fill="#ffb454" />
                </>
              )}
            </svg>

            {items.map((r, i) => (
              <HangingCard
                key={i}
                r={r}
                i={i}
                width={CARD_W}
                setPos={setPos}
                setClip={setClip}
                setMag={setMag}
                onEnter={onEnter}
                onMove={onMove}
                onLeave={onLeave}
                onFlip={onFlip}
              />
            ))}

            {/* sparks sit above the cards */}
            {!reduce && (
              <svg
                aria-hidden
                className="pointer-events-none absolute left-0 top-0 z-30 overflow-visible"
                width={W}
                height={stageH}
              >
                {Array.from({ length: PN }).map((_, k) => (
                  <circle
                    key={k}
                    ref={(el) => { partEls.current[k] = el; }}
                    r="2"
                    cx="0"
                    cy="0"
                    opacity="0"
                    fill="#ffb454"
                  />
                ))}
              </svg>
            )}
          </div>
        )}
      </div>

      <style>{`
        .rv-card { perspective: 1100px; }
        .rv-card:focus { outline: none; }
        .rv-inner {
          transform-style: preserve-3d;
          transition: transform 0.8s cubic-bezier(0.23, 1, 0.32, 1);
        }
        .rv-face { backface-visibility: hidden; -webkit-backface-visibility: hidden; }
        .rv-back { transform: rotateY(180deg); }

        @media (hover: hover) {
          .rv-card:hover .rv-inner { transform: rotateY(180deg); }
        }
        .rv-card:focus-visible .rv-inner,
        .rv-card.is-flipped .rv-inner { transform: rotateY(180deg); }

        /* while dragging: grabbing cursor, cards ignore the pointer so nothing flips */
        .rv-wrap.rv-dragging { cursor: grabbing; }
        .rv-wrap.rv-dragging .rv-card { pointer-events: none; }
      `}</style>
    </section>
  );
}