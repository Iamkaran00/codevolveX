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

const nameOf = (r) =>
  `${r.user?.firstName || ""} ${r.user?.lastName || ""}`.trim() || "Student";

const initialsOf = (r) =>
  `${r.user?.firstName?.charAt(0) || ""}${r.user?.lastName?.charAt(0) || ""}` ||
  "?";

const handleOf = (r) =>
  (r.user?.firstName || "student").toLowerCase().replace(/[^a-z0-9]/g, "") ||
  "student";

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

function HangingCard({ r, i, width, setPos, setClip, setMag, onEnter, onMove, onLeave }) {
  const drop = DROPS[i % DROPS.length];
  const amp = 2.2 + (i % 3) * 0.9;
  const dur = 3.4 + (i % 4) * 0.55;
  const delay = -((i * 0.83) % dur);

  return (
    <div
      ref={(el) => setPos(i, el)}
      className="absolute left-0 top-0 z-20 px-3"
      style={{ width, willChange: "transform" }}
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
          <div className="rv-card" style={{ height: CARD_H }} tabIndex={0}>
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
  const hovered = useRef(false);

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

  // slide + sag + magnetic physics, all in one frame loop
  useEffect(() => {
    if (!W || !items.length) return undefined;

    const total = items.length * CARD_W;
    let scroll = 0;
    let speed = 0;
    let last = performance.now();
    let raf;

    const place = () => {
      for (let i = 0; i < items.length; i += 1) {
        const el = posEls.current[i];
        if (!el) continue;

        const base = i * CARD_W - scroll;
        const x = (((base % total) + total) % total) - CARD_W;
        const cx = x + CARD_W / 2;
        const u = Math.max(-1, Math.min(1, (cx - W / 2) / (W / 2)));
        const y = 2 + SAG * (1 - u * u);
        el.style.transform = `translate3d(${x}px, ${y}px, 0)`;

        // clip follows the slope of the wire
        const clip = clipEls.current[i];
        if (clip) {
          const slope = (-4 * SAG * u) / W;
          clip.style.transform = `translateX(-50%) rotate(${Math.atan(slope)}rad)`;
        }

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
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      const target = hovered.current ? 0 : BASE_SPEED * (reduce ? 0.4 : 1);
      speed += (target - speed) * Math.min(1, dt * 5);
      scroll = (scroll + speed * dt) % total;
      place();
      raf = requestAnimationFrame(tick);
    };

    place();
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

  if (reviews.length === 0) return null;

  const wirePath = `M0 2 Q ${W / 2} ${2 + 2 * SAG} ${W} 2`;
  const stageH = SAG + 2 + MAX_DROP + CARD_H + 40;

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
        className="relative mx-auto mb-20 flex max-w-7xl flex-col justify-between gap-8 px-5 sm:px-8 lg:flex-row lg:items-end"
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
          Real reviews from learners on CodevolveX. Hover a card to see who
          wrote it.
        </p>
      </motion.div>

      {/* the wire */}
      <div
        ref={wrapRef}
        className="relative w-full"
        style={{
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
              height={SAG + 6}
            >
              <path d={wirePath} fill="none" stroke="rgba(161,161,170,0.55)" strokeWidth="1.6" />
              <path d={wirePath} fill="none" stroke="rgba(255,180,84,0.10)" strokeWidth="5" />
              {!reduce && (
                <>
                  <circle r="9" fill="rgba(255,180,84,0.18)">
                    <animateMotion dur="9s" repeatCount="indefinite" path={wirePath} />
                  </circle>
                  <circle r="3" fill="#ffb454">
                    <animateMotion dur="9s" repeatCount="indefinite" path={wirePath} />
                  </circle>
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
        .rv-card:focus-within .rv-inner { transform: rotateY(180deg); }

        .rv-swing:hover { animation-play-state: paused; }

        @media (prefers-reduced-motion: reduce) {
          .rv-swing { animation: none !important; }
        }
      `}</style>
    </section>
  );
}