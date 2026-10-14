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

// how far each card drops from the wire, so the line feels organic
const DROPS = [30, 54, 40, 66];
const MAX_DROP = 66;
const CARD_H = 280;

// wire physics
const TOP_PAD = 70; // headroom above the resting wire (room to pull it up)
const PULL_UP = -70; // max px you can pull the wire up
const PULL_DOWN = 150; // max px you can pull the wire down
const BOTTOM_PAD = 140; // room below for the cards when the wire is pulled down
const WAVE_SPEED = 1100; // px per second a ripple travels along the wire
const K_REST = 14; // how hard the wire wants to return to its resting curve
const K_PULL = 140; // how hard your hand pulls it
const SIGMA = 110; // how wide your grip is (px)
const SUBSTEPS = 6;

const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

const nameOf = (r) =>
  `${r.user?.firstName || ""} ${r.user?.lastName || ""}`.trim() || "Student";

const initialsOf = (r) =>
  `${r.user?.firstName?.charAt(0) || ""}${r.user?.lastName?.charAt(0) || ""}` ||
  "?";

const handleOf = (r) =>
  (r.user?.firstName || "student").toLowerCase().replace(/[^a-z0-9]/g, "") ||
  "student";

// read a value off the wire at any x (linear interpolation between nodes)
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

/* ------------------------------------------------------------------ */
/*  A card hanging from the wire                                       */
/* ------------------------------------------------------------------ */

function HangingCard({ r, i, width, setPos, setClip, setMag, onEnter, onMove, onLeave, onFlip }) {
  const drop = DROPS[i % DROPS.length];
  const amp = 2.2 + (i % 3) * 0.9;
  const dur = 3.4 + (i % 4) * 0.55;
  const delay = -((i * 0.83) % dur);

  return (
    <div
      ref={(el) => setPos(i, el)}
      className="absolute left-0 top-0 z-20 px-3"
      style={{ width, willChange: "transform", transformOrigin: "50% 0" }}
    >
      <div
        className="rv-swing relative"
        style={{
          "--amp": `${amp}deg`,
          animationDuration: `${dur}s`,
          animationDelay: `${delay}s`,
        }}
      >
        {/* clip sitting on the wire */}
        <span
          ref={(el) => setClip(i, el)}
          className="absolute left-1/2 top-[-13px] z-20 h-[26px] w-[11px] rounded-[3px] bg-[#ffb454] shadow-[0_2px_8px_rgba(255,180,84,0.35)]"
          style={{ transform: "translateX(-50%)" }}
        >
          <span className="absolute left-0 top-[11px] h-px w-full bg-[#1d1a16]/40" />
          <span className="absolute left-1/2 top-[5px] h-1 w-1 -translate-x-1/2 rounded-full bg-[#1d1a16]/50" />
        </span>

        {/* V-shaped strings */}
        <svg
          aria-hidden
          className="relative z-10 block w-full"
          style={{ height: drop }}
          preserveAspectRatio="none"
        >
          <line x1="50%" y1="0" x2="14%" y2="100%" stroke="rgba(243,236,224,0.28)" strokeWidth="1" vectorEffect="non-scaling-stroke" />
          <line x1="50%" y1="0" x2="86%" y2="100%" stroke="rgba(243,236,224,0.28)" strokeWidth="1" vectorEffect="non-scaling-stroke" />
        </svg>

        {/* magnetic layer */}
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

/* ------------------------------------------------------------------ */
/*  Section                                                            */
/* ------------------------------------------------------------------ */

export default function ReviewsMarquee() {
  const reduce = useReducedMotion();
  const [reviews, setReviews] = useState([]);
  const [W, setW] = useState(0);
  const wrapRef = useRef(null);

  const posEls = useRef([]);
  const clipEls = useRef([]);
  const magEls = useRef([]);
  const magState = useRef([]);
  const lean = useRef([]);
  const hovered = useRef(false);

  // wire drawing targets (updated every frame, no React re-render)
  const wirePathEl = useRef(null);
  const glowPathEl = useRef(null);
  const sparkEl = useRef(null);
  const sparkGlowEl = useRef(null);

  // shared motion state (read by the frame loop and the pointer handlers)
  const sc = useRef({
    scroll: 0,
    speed: 0,
    down: false,
    dragging: false,
    moved: 0,
    lastX: 0,
    lastT: 0,
    startY: 0,
    px: 0, // where your finger/mouse grips the wire (x, px)
    pull: 0, // how far you've pulled it up/down (px)
    pinned: 0,
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

  // enough cards (a clean multiple of the reviews) to fill the wire seamlessly
  const items = useMemo(() => {
    if (!reviews.length || !W) return [];
    const needed = Math.max(MIN_PER_ROW, Math.ceil((W + 2 * CARD_W) / CARD_W));
    const reps = Math.ceil(needed / reviews.length);
    return Array.from({ length: reps }, () => reviews).flat();
  }, [reviews, W, CARD_W]);

  // grab the wire: sideways scrubs the reviews, up/down pulls the wire itself
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
        S.speed = clamp(S.speed * 0.6 + (-dx / dt) * 0.4, -2500, 2500);
        S.pull = clamp(dy, PULL_UP, PULL_DOWN);
      }
      S.lastX = e.clientX;
      S.lastT = now;
    };

    const up = () => {
      if (!S.down) return;
      S.down = false;
      S.pull = 0; // let go: the wire snaps back and wobbles
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

  // frame loop: marquee slide + wire physics + hanging cards
  useEffect(() => {
    if (!W || !items.length) return undefined;

    const S = sc.current;
    const total = items.length * CARD_W;
    let last = performance.now();
    let raf;

    /* ---- the wire: a row of springy points, each pulled toward its resting curve ---- */
    const N = clamp(Math.round(W / 30) + 1, 24, 64);
    const sp = W / (N - 1);
    const C = (WAVE_SPEED / sp) ** 2; // how strongly neighbours drag each other
    const y = new Float64Array(N);
    const v = new Float64Array(N);
    const rest = new Float64Array(N);
    for (let i = 0; i < N; i += 1) {
      const u = (i * sp - W / 2) / (W / 2);
      rest[i] = TOP_PAD + 2 + SAG * (1 - u * u);
      y[i] = rest[i];
    }
    S.px = W / 2;

    const stepWire = (h) => {
      const active = S.dragging;
      const damp = active ? 5 : 1.5;
      for (let i = 1; i < N - 1; i += 1) {
        let a = K_REST * (rest[i] - y[i]) + C * (y[i - 1] + y[i + 1] - 2 * y[i]);
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

    const drawWire = (now) => {
      let d = `M0 ${y[0].toFixed(1)}`;
      for (let i = 1; i < N - 1; i += 1) {
        const mx = (i * sp + (i + 1) * sp) / 2;
        const my = (y[i] + y[i + 1]) / 2;
        d += ` Q${(i * sp).toFixed(1)} ${y[i].toFixed(1)} ${mx.toFixed(1)} ${my.toFixed(1)}`;
      }
      d += ` L${W} ${y[N - 1].toFixed(1)}`;
      wirePathEl.current?.setAttribute("d", d);
      glowPathEl.current?.setAttribute("d", d);

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
    const place = (dt) => {
      for (let i = 0; i < items.length; i += 1) {
        const el = posEls.current[i];
        if (!el) continue;

        const base = i * CARD_W - S.scroll;
        const x = (((base % total) + total) % total) - CARD_W;
        const cx = x + CARD_W / 2;
        S.centers[i] = cx;

        // the card hangs wherever the wire is right now
        const yw = sampleWire(y, sp, N, cx);
        const slope = (sampleWire(y, sp, N, cx + 6) - sampleWire(y, sp, N, cx - 6)) / 12;

        // swing: leans against travel, and gets kicked when the wire twists under it
        const L = lean.current[i] || (lean.current[i] = { a: 0, v: 0 });
        const target = reduce ? 0 : clamp(-S.speed * 0.012 * (1 + (i % 3) * 0.15), -14, 14);
        const twist =
          (sampleWire(v, sp, N, cx + 6) - sampleWire(v, sp, N, cx - 6)) / 12; // how fast the wire tilts here
        L.v -= twist * 57.3 * dt * 3;
        L.v += ((target - L.a) * 80 - L.v * 8) * dt;
        L.a += L.v * dt;

        el.style.transform = `translate3d(${x}px, ${yw}px, 0) rotate(${L.a}deg)`;

        // clip follows the slope of the wire
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

    const tick = (now) => {
      const dt = Math.min(0.033, (now - last) / 1000);
      last = now;

      if (S.dragging) {
        S.speed += (0 - S.speed) * Math.min(1, dt * 8);
      } else {
        const paused = hovered.current || S.pinned > 0;
        const targetSpeed = paused ? 0 : BASE_SPEED * (reduce ? 0.4 : 1);
        const rate = Math.abs(S.speed) > BASE_SPEED * 1.5 ? 2 : 5;
        S.speed += (targetSpeed - S.speed) * Math.min(1, dt * rate);
        S.scroll += S.speed * dt;
      }
      S.scroll = ((S.scroll % total) + total) % total;

      const h = dt / SUBSTEPS;
      for (let k = 0; k < SUBSTEPS; k += 1) stepWire(h);

      place(dt);
      drawWire(now);
      raf = requestAnimationFrame(tick);
    };

    place(0.016);
    drawWire(0);
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

  // tap to flip on touch screens (desktop flips on hover); a flipped card holds the wire still
  const onFlip = (e) => {
    const S = sc.current;
    if (S.moved > 6) return;
    if (!window.matchMedia("(hover: none)").matches) return;
    const on = e.currentTarget.classList.toggle("is-flipped");
    S.pinned = Math.max(0, S.pinned + (on ? 1 : -1));
  };

  // pointer down anywhere on the wire area = you've grabbed it
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

  // moving the mouse across the wire gusts the cards nearby
  const onWrapMove = (e) => {
    const S = sc.current;
    if (S.down || reduce || e.pointerType !== "mouse") return;
    const dx = clamp(e.movementX || 0, -40, 40);
    if (!dx || !wrapRef.current) return;
    const px = e.clientX - wrapRef.current.getBoundingClientRect().left;
    for (let i = 0; i < S.centers.length; i += 1) {
      const c = S.centers[i];
      const L = lean.current[i];
      if (c == null || !L) continue;
      const d = Math.abs(c - px);
      if (d < 220) L.v += dx * 1.1 * (1 - d / 220);
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
          Real reviews from learners on CodevolveX. Grab the wire, pull it any
          way you like, then let go.
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

            
          </div>
        )}
      </div>

      <style>{`
        .rv-swing {
          transform-origin: 50% 0;
          animation: rvSwing ease-in-out infinite alternate;
        }
        @keyframes rvSwing {
          from { transform: rotate(calc(var(--amp) * -1)); }
          to   { transform: rotate(var(--amp)); }
        }

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

        .rv-swing:hover { animation-play-state: paused; }

        /* while dragging: grabbing cursor, cards ignore the pointer so nothing flips */
        .rv-wrap.rv-dragging { cursor: grabbing; }
        .rv-wrap.rv-dragging .rv-card { pointer-events: none; }

        @media (prefers-reduced-motion: reduce) {
          .rv-swing { animation: none !important; }
        }
      `}</style>
    </section>
  );
}