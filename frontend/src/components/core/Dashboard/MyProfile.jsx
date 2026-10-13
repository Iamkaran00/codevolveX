import React, { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { motion, animate, useReducedMotion } from "framer-motion";
import { FcGoogle } from "react-icons/fc";

/* ------------------------------------------------------------------ */
/*  Config                                                             */
/* ------------------------------------------------------------------ */

// The heatmap needs real per-day activity from your backend.
// Until that exists, a stable placeholder pattern is generated from the
// user's id. Set this to false (and pass real data) once it's available.
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

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

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
  if (days[i].level === 0) i--; // today may not be done yet
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

/* ------------------------------------------------------------------ */
/*  Small pieces                                                       */
/* ------------------------------------------------------------------ */

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

/* ------------------------------------------------------------------ */
/*  ID badge                                                           */
/* ------------------------------------------------------------------ */

const faceStyle = {
  backfaceVisibility: "hidden",
  WebkitBackfaceVisibility: "hidden",
};

const Badge = ({ user, fullName, details, isGoogle, reduce }) => {
  const [flipped, setFlipped] = useState(false);
  const role = user?.accountType ?? "Student";
  const color = ROLE_COLOR[role] ?? ROLE_COLOR.Student;
  const idNo = `CX-${String(user?._id ?? user?.id ?? "000000")
    .slice(-6)
    .toUpperCase()}`;
  const issued = user?.createdAt ? new Date(user.createdAt).getFullYear() : "";

  return (
    <div className="mx-auto w-[280px]">
      {/* whole assembly sways gently from the top, like it's hanging */}
      <motion.div
        style={{ transformOrigin: "50% 0%" }}
        animate={reduce ? undefined : { rotate: [-1.3, 1.3, -1.3] }}
        transition={{ duration: 8, ease: "easeInOut", repeat: Infinity }}
      >
        {/* strap + clip */}
        <div className="relative mx-auto h-24 w-3 bg-[#a9742c]">
          <div className="absolute inset-y-0 left-1/2 w-px -translate-x-1/2 bg-black/20" />
        </div>
        <div className="relative z-10 mx-auto -mb-2 h-4 w-8 rounded-[5px] bg-gradient-to-b from-zinc-300 to-zinc-500" />

        {/* card */}
        <motion.div
          drag
          dragConstraints={{ left: -28, right: 28, top: -4, bottom: 28 }}
          dragElastic={0.22}
          dragSnapToOrigin
          dragTransition={{ bounceStiffness: 120, bounceDamping: 16 }}
          whileDrag={{ cursor: "grabbing", scale: 1.02 }}
          onTap={() => setFlipped((f) => !f)}
          className="cursor-grab select-none"
          style={{ perspective: 1400, touchAction: "pan-y" }}
        >
          <motion.div
            animate={{ rotateY: flipped ? 180 : 0 }}
            transition={{ duration: 1, ease: EASE }}
            style={{ transformStyle: "preserve-3d" }}
            className="relative h-[410px] w-full"
          >
            {/* FRONT */}
            <div
              style={faceStyle}
              className="absolute inset-0 flex flex-col overflow-hidden rounded-[22px] bg-[#f1eadc] text-[#1d1a16] shadow-[0_30px_60px_-30px_rgba(0,0,0,0.7)]"
            >
              <div
                className="flex items-center justify-between px-6 pb-3 pt-6"
                style={{ backgroundColor: color }}
              >
                <span className={`text-[11px] uppercase tracking-[0.2em] ${mono}`}>
                  {role}
                </span>
                <span className="h-3 w-10 rounded-full bg-[#1d1a16]/80" />
              </div>

              <div className="flex flex-1 flex-col px-6 pt-6">
                <img
                  src={user?.image}
                  alt={fullName}
                  className="h-24 w-24 rounded-2xl bg-[#ddd3c0] object-cover"
                />
                <h2
                  className={`mt-5 text-[26px] font-semibold leading-[1.1] tracking-tight ${display}`}
                >
                  {fullName}
                </h2>
                <p className={`mt-2 break-all text-[11px] text-[#1d1a16]/60 ${mono}`}>
                  {user?.email}
                </p>

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

            {/* BACK */}
            <div
              style={{ ...faceStyle, transform: "rotateY(180deg)" }}
              className="absolute inset-0 flex flex-col overflow-hidden rounded-[22px] border border-white/10 bg-[#1c1a17] p-6 shadow-[0_30px_60px_-30px_rgba(0,0,0,0.7)]"
            >
              <p className={`text-[11px] uppercase tracking-[0.2em] text-zinc-500 ${mono}`}>
                Details
              </p>
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
              <p className={`mt-auto text-[10px] tracking-widest text-zinc-600 ${mono}`}>
                {idNo}
              </p>
            </div>
          </motion.div>
        </motion.div>
      </motion.div>

      <div className="mt-8 flex items-center justify-center gap-3 text-xs text-zinc-600">
        <span>Drag me</span>
        <span className="h-1 w-1 rounded-full bg-zinc-700" />
        <button
          type="button"
          onClick={() => setFlipped((f) => !f)}
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
          <Badge
            user={user}
            fullName={fullName}
            details={details}
            isGoogle={isGoogle}
            reduce={reduce}
          />
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