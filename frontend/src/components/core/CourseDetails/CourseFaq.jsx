import React, { useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";

const EASE = [0.23, 1, 0.32, 1];

const display = "font-['Space_Grotesk',ui-sans-serif,system-ui,sans-serif]";
const mono = "font-['JetBrains_Mono',ui-monospace,monospace]";

const GRAIN = `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.8' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>")`;

const outline = { WebkitTextStroke: "1px rgba(243,236,220,0.3)" };

const listV = { hidden: {}, show: { transition: { staggerChildren: 0.08, delayChildren: 0.15 } } };
const rowV = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.85, ease: EASE } },
};

const pad = (n) => String(n).padStart(2, "0");

const FAQS = [
  {
    question: "Will I get a certificate after completing the course?",
    answer:
      "Yes! Upon completing all the lectures and assessments, you will receive a verifiable certificate of completion that you can share on LinkedIn or add to your resume.",
  },
  {
    question: "Do I get lifetime access to the course?",
    answer:
      "Absolutely. Once enrolled, you have lifetime access to all course content including any future updates the instructor adds.",
  },
  {
    question: "What if I don't like the course?",
    answer:
      "We offer a full refund within 7 days of purchase if you're not satisfied with the course, no questions asked.",
  },
  {
    question: "Can I access the course on mobile?",
    answer:
      "Yes, CodevolveX is fully responsive. You can access all course content from any device — desktop, tablet, or mobile.",
  },
  {
    question: "Is there any prerequisite knowledge required?",
    answer:
      "Each course lists its own requirements. You can find the specific prerequisites in the Requirements section above.",
  },
  {
    question: "How do I contact the instructor?",
    answer:
      "Once enrolled, you can reach out to the instructor directly through the course discussion board available inside the course player.",
  },
];

/* ------------------------------------------------------------------ */
/*  Plus that morphs into a minus                                      */
/* ------------------------------------------------------------------ */

const PlusMinus = ({ open, reduce }) => (
  <span
    className={`relative flex h-9 w-9 shrink-0 items-center justify-center rounded-full border transition-all duration-500 ${
      open
        ? "border-[#ffb454] bg-[#ffb454]"
        : "border-white/15 group-hover:border-[#ffb454]/60"
    }`}
  >
    <span
      className={`absolute h-px w-3.5 transition-colors duration-500 ${
        open ? "bg-[#1d1a16]" : "bg-zinc-400 group-hover:bg-[#ffb454]"
      }`}
    />
    <motion.span
      initial={false}
      animate={{ rotate: open ? 90 : 0, opacity: open ? 0 : 1 }}
      transition={{ duration: reduce ? 0 : 0.5, ease: EASE }}
      className="absolute h-3.5 w-px bg-zinc-400 group-hover:bg-[#ffb454]"
    />
  </span>
);

/* ------------------------------------------------------------------ */
/*  Item                                                               */
/* ------------------------------------------------------------------ */

function FAQItem({ faq, index, open, onToggle, reduce }) {
  const panelId = `faq-panel-${index}`;
  const buttonId = `faq-button-${index}`;

  return (
    <motion.li
      variants={rowV}
      className={`group relative overflow-hidden rounded-2xl border transition-all duration-500 ${
        open
          ? "border-[#ffb454]/40 bg-[#ffb454]/[0.04]"
          : "border-white/[0.07] bg-white/[0.02] hover:border-white/20"
      }`}
    >
      {/* amber spine that grows when open */}
      <motion.span
        aria-hidden
        initial={false}
        animate={{ scaleY: open ? 1 : 0 }}
        transition={{ duration: reduce ? 0 : 0.6, ease: EASE }}
        style={{ originY: 0 }}
        className="absolute bottom-0 left-0 top-0 w-px bg-[#ffb454]"
      />

      <h3>
        <button
          id={buttonId}
          type="button"
          aria-expanded={open}
          aria-controls={panelId}
          onClick={onToggle}
          className="flex w-full cursor-pointer items-center gap-5 px-5 py-5 text-left outline-none focus-visible:ring-1 focus-visible:ring-inset focus-visible:ring-[#ffb454]/60 sm:px-6"
        >
          <span
            className={`hidden w-14 shrink-0 text-4xl font-semibold leading-none text-transparent transition-all duration-500 sm:block ${display}`}
            style={open ? { WebkitTextStroke: "1px #ffb454" } : outline}
          >
            {pad(index + 1)}
          </span>
          <span className={`shrink-0 text-xs text-zinc-700 sm:hidden ${mono}`}>
            {pad(index + 1)}
          </span>

          <span
            className={`flex-1 text-[15px] leading-snug transition-colors duration-500 sm:text-base ${
              open ? "text-[#f3ece0]" : "text-zinc-300 group-hover:text-[#f3ece0]"
            }`}
          >
            {faq.question}
          </span>

          <PlusMinus open={open} reduce={reduce} />
        </button>
      </h3>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            id={panelId}
            role="region"
            aria-labelledby={buttonId}
            initial={reduce ? false : { height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={reduce ? { opacity: 0 } : { height: 0, opacity: 0 }}
            transition={{ duration: 0.6, ease: EASE }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-6 sm:pl-[5.75rem] sm:pr-16">
              <p className="text-[15px] leading-relaxed text-zinc-400">{faq.answer}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.li>
  );
}

/* ------------------------------------------------------------------ */
/*  Section                                                            */
/* ------------------------------------------------------------------ */

export default function CourseFAQ() {
  const reduce = useReducedMotion();
  const [openSet, setOpenSet] = useState(() => new Set());

  const allOpen = openSet.size === FAQS.length;

  const toggle = (i) =>
    setOpenSet((prev) => {
      const next = new Set(prev);
      next.has(i) ? next.delete(i) : next.add(i);
      return next;
    });

  const toggleAll = () =>
    setOpenSet(allOpen ? new Set() : new Set(FAQS.map((_, i) => i)));

  return (
    <motion.section
      initial={reduce ? false : { opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 1, ease: EASE }}
      className="relative mx-auto w-full max-w-3xl overflow-hidden rounded-3xl border border-white/[0.08] bg-[#14130f] p-7 sm:p-10"
    >
      {/* grain */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.06] mix-blend-overlay"
        style={{ backgroundImage: GRAIN }}
      />
      {/* soft amber glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-[#ffb454] opacity-[0.08] blur-3xl"
      />

      <div className="relative">
        {/* header */}
        <div className="flex items-end justify-between gap-6">
          <div>
            <div className="flex items-center gap-3">
              <motion.span
                initial={reduce ? false : { scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.9, ease: EASE, delay: 0.2 }}
                style={{ originX: 0 }}
                className="h-px w-8 bg-[#ffb454]"
              />
              <p className={`text-[11px] uppercase tracking-[0.25em] text-zinc-500 ${mono}`}>
                Support · quick answers
              </p>
            </div>
            <h2
              className={`mt-5 text-3xl font-semibold leading-[1.05] tracking-tight text-[#f3ece0] sm:text-4xl ${display}`}
            >
              Frequently
              <br />
              asked<span className="text-[#ffb454]">.</span>
            </h2>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-zinc-500">
              Everything you need to know about the course structure and access.
            </p>
          </div>

          <div className="text-right">
            <p className={`text-4xl font-semibold tabular-nums text-[#ffb454] sm:text-5xl ${display}`}>
              {pad(FAQS.length)}
            </p>
            <p className={`mt-1 text-[11px] uppercase tracking-[0.2em] text-zinc-600 ${mono}`}>
              Questions
            </p>
          </div>
        </div>

        {/* expand / collapse all */}
        <div className="mt-8 flex justify-end border-t border-white/[0.07] pt-6">
          <button
            type="button"
            onClick={toggleAll}
            className={`inline-flex items-center gap-2 rounded-full border border-white/15 px-4 py-2 text-[11px] uppercase tracking-[0.2em] text-zinc-400 transition-all duration-500 hover:border-[#ffb454]/60 hover:text-[#ffb454] ${mono}`}
          >
            {allOpen ? "Collapse all" : "Expand all"}
          </button>
        </div>

        {/* list */}
        <motion.ul
          variants={listV}
          initial={reduce ? false : "hidden"}
          whileInView="show"
          viewport={{ once: true, margin: "-60px" }}
          className="mt-4 flex flex-col gap-3"
        >
          {FAQS.map((faq, i) => (
            <FAQItem
              key={faq.question}
              faq={faq}
              index={i}
              open={openSet.has(i)}
              onToggle={() => toggle(i)}
              reduce={reduce}
            />
          ))}
        </motion.ul>
      </div>
    </motion.section>
  );
}