import React, { useEffect, useRef } from "react";
import { NavLink } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import { SiGithub } from "react-icons/si";
import { FaLinkedinIn, FaTwitter } from "react-icons/fa";
import { HiArrowRight, HiArrowUp } from "react-icons/hi2";

const EASE = [0.23, 1, 0.32, 1];

const display = "font-['Space_Grotesk',ui-sans-serif,system-ui,sans-serif]";
const mono = "font-['JetBrains_Mono',ui-monospace,monospace]";

const GRAIN = `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.8' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>")`;

const LINKS = {
  Platform: [
    ["Courses", "/catalogue"],
    ["Learning Paths", "#"],
    ["Instructors", "#"],
    ["Pricing", "#"],
  ],
  Company: [
    ["About Us", "#"],
    ["Careers", "#"],
    ["Blog", "#"],
    ["Press", "#"],
  ],
  Support: [
    ["Help Centre", "#"],
    ["Contact Us", "#"],
    ["Community", "#"],
    ["Status", "#"],
  ],
  Legal: [
    ["Privacy Policy", "#"],
    ["Terms of Service", "#"],
    ["Cookie Policy", "#"],
  ],
};

const SOCIALS = [
  { Icon: FaTwitter, href: "#", label: "Twitter" },
  { Icon: FaLinkedinIn, href: "https://www.linkedin.com/in/karan-sahu7", label: "LinkedIn" },
  { Icon: SiGithub, href: "https://www.github.com/iamkaran00", label: "GitHub" },
];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1, delayChildren: 0.05 } },
};
const item = {
  hidden: { opacity: 0, y: 22 },
  show: { opacity: 1, y: 0, transition: { duration: 0.95, ease: EASE } },
};

const WORD = "codevolveX".split("");
// every letter travels at its own speed, so they rise out of the bottom
// edge at different rates and line up as you reach the end of the page
const SPEEDS = [1.0, 1.7, 0.8, 2.0, 1.25, 1.8, 0.9, 1.55, 1.1, 1.9];
const TRAVEL = 120; // px, scaled by each letter's speed

const WORD_STYLE = { WebkitTextStroke: "1.5px rgba(243,236,224,0.22)" };

const Letters = () =>
  WORD.map((c, i) => (
    <span
      key={i}
      data-l={i}
      className="inline-block will-change-transform"
      style={{ transform: `translateY(${SPEEDS[i] * TRAVEL}px)` }}
    >
      {c}
    </span>
  ));

export const Footer = () => {
  const year = new Date().getFullYear();
  const reduce = useReducedMotion();

  const footerRef = useRef(null);
  const wordWrapRef = useRef(null);
  const wordRef = useRef(null);
  const glowRef = useRef(null);

  // scroll-linked parallax: letters rise at different speeds as the footer enters
  useEffect(() => {
    if (!wordRef.current) return undefined;
    const letters = wordRef.current.querySelectorAll("[data-l]");
    let raf;

    const update = () => {
      if (!footerRef.current) return;
      const rect = footerRef.current.getBoundingClientRect();
      const p = Math.max(
        0,
        Math.min(1, (window.innerHeight - rect.top) / rect.height)
      );
      letters.forEach((el) => {
        const i = Number(el.dataset.l);
        el.style.transform = `translateY(${(1 - p) * SPEEDS[i] * TRAVEL}px)`;
      });
    };

    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(update);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    update();
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  // amber light that follows the cursor across the wordmark
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

  const toTop = () =>
    window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });

  return (
    <footer
      ref={footerRef}
      className="relative overflow-hidden border-t border-white/[0.07] bg-[#100f0d] pt-24"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.06] mix-blend-overlay"
        style={{ backgroundImage: GRAIN }}
      />

      <motion.div
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-40px" }}
        className="relative mx-auto max-w-7xl px-5 sm:px-8"
      >
        {/* closing CTA */}
        <motion.div
          variants={item}
          className="flex flex-col justify-between gap-8 border-b border-white/[0.07] pb-16 lg:flex-row lg:items-end"
        >
          <div>
            <div className="flex items-center gap-3">
              <span className="h-px w-8 bg-[#ffb454]" />
              <p className={`text-[11px] uppercase tracking-[0.25em] text-zinc-500 ${mono}`}>
                Ready when you are
              </p>
            </div>
            <h2
              className={`mt-6 text-4xl font-semibold leading-[1.04] tracking-tight text-[#f3ece0] sm:text-6xl ${display}`}
            >
              Go build something
              <br />
              <span className="text-[#ffb454]">real</span>
              <span className="text-[#ffb454]">.</span>
            </h2>
          </div>

          <NavLink to="/catalogue">
            <button className="group flex w-full cursor-pointer items-center justify-center gap-2 rounded-full bg-[#ffb454] px-8 py-4 text-sm font-semibold text-[#1d1a16] transition-all duration-500 hover:bg-[#ffc272] active:scale-[0.98] sm:w-auto">
              Explore Catalogue
              <HiArrowRight className="h-4 w-4 transition-transform duration-500 group-hover:translate-x-1" />
            </button>
          </NavLink>
        </motion.div>

        {/* brand + links */}
        <div className="grid grid-cols-1 gap-14 py-16 lg:grid-cols-12 lg:gap-8">
          <motion.div variants={item} className="flex flex-col items-start lg:col-span-4">
            <NavLink
              to="/"
              className={`mb-6 text-2xl font-semibold tracking-tight text-[#f3ece0] ${display}`}
            >
              codevolve<span className="text-[#ffb454]">X</span>
            </NavLink>
            <p className="mb-8 max-w-[320px] text-[15px] leading-relaxed text-zinc-500">
              The modern platform for developers who build, not just learn.
              Master the stack, ship real code, and elevate your engineering
              journey.
            </p>

            <div className="flex gap-3">
              {SOCIALS.map(({ Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="group flex h-11 w-11 items-center justify-center rounded-full border border-white/10 text-zinc-500 transition-all duration-500 hover:-translate-y-1 hover:border-[#ffb454] hover:bg-[#ffb454] hover:text-[#1d1a16]"
                >
                  <Icon size={17} />
                </a>
              ))}
            </div>
          </motion.div>

          <div className="grid grid-cols-2 gap-10 sm:grid-cols-4 lg:col-span-8 lg:pl-10">
            {Object.entries(LINKS).map(([heading, items]) => (
              <motion.div key={heading} variants={item}>
                <p className={`mb-6 text-[11px] uppercase tracking-[0.25em] text-zinc-600 ${mono}`}>
                  {heading}
                </p>
                <ul className="flex flex-col gap-3.5">
                  {items.map(([label, to]) => (
                    <li key={label}>
                      <NavLink
                        to={to}
                        className="group inline-flex items-center gap-2 text-[14px] text-zinc-400 transition-colors duration-500 hover:text-[#ffb454]"
                      >
                        <span className="h-px w-0 bg-[#ffb454] transition-all duration-500 group-hover:w-3" />
                        {label}
                      </NavLink>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* giant wordmark: letters rise at different speeds on scroll, amber light follows the cursor */}
      <div
        ref={wordWrapRef}
        onMouseMove={onMove}
        onMouseLeave={onLeave}
        className="relative mx-auto -mb-[2.2vw] max-w-[1800px] select-none overflow-hidden px-2"
      >
        <div ref={wordRef} className="flex justify-center">
          <div className="relative">
            <span
              aria-hidden
              className={`block whitespace-nowrap text-[17vw] font-bold leading-[0.85] tracking-tighter text-transparent ${display}`}
              style={WORD_STYLE}
            >
              <Letters />
            </span>
            <span
              ref={glowRef}
              aria-hidden
              className={`pointer-events-none absolute inset-0 block whitespace-nowrap text-[17vw] font-bold leading-[0.85] tracking-tighter text-[#ffb454] opacity-0 transition-opacity duration-700 ${display}`}
              style={{
                "--mx": "50%",
                "--my": "50%",
                WebkitMaskImage:
                  "radial-gradient(260px circle at var(--mx) var(--my), #000 0%, transparent 70%)",
                maskImage:
                  "radial-gradient(260px circle at var(--mx) var(--my), #000 0%, transparent 70%)",
              }}
            >
              <Letters />
            </span>
          </div>
        </div>
      </div>

      {/* bottom bar */}
      <div className="relative border-t border-white/[0.07] bg-[#100f0d]/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-5 px-5 py-6 sm:flex-row sm:px-8">
          <p className="text-[13px] text-zinc-600">
            © {year} <span className="text-zinc-400">codevolveX</span>. All rights reserved.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-5 sm:gap-8">
            

            <p className="hidden text-[13px] text-zinc-600 sm:block">
              Built with <span className="text-[#ffb454]">♥</span> for developers.
            </p>

            <button
              onClick={toTop}
              aria-label="Back to top"
              className="group flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-white/15 text-zinc-400 transition-all duration-500 hover:border-[#ffb454] hover:bg-[#ffb454] hover:text-[#1d1a16]"
            >
              <HiArrowUp className="transition-transform duration-500 group-hover:-translate-y-0.5" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};