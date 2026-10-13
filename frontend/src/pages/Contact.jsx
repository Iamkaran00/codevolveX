import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { HiChatBubbleLeftRight, HiMapPin, HiPhone, HiArrowUpRight } from "react-icons/hi2";
import ContactUsForm from "../components/common/ContactUsform";

const EASE = [0.23, 1, 0.32, 1];

const display = "font-['Space_Grotesk',ui-sans-serif,system-ui,sans-serif]";
const mono = "font-['JetBrains_Mono',ui-monospace,monospace]";

const GRAIN = `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.8' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>")`;

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
};
const item = {
  hidden: { opacity: 0, y: 22 },
  show: { opacity: 1, y: 0, transition: { duration: 0.95, ease: EASE } },
};

const contactDetails = [
  {
    icon: HiChatBubbleLeftRight,
    heading: "Chat with us",
    description: "Our AI agents and human mentors are here to help.",
    details: "support@codevolvex.com",
    href: "mailto:support@codevolvex.com",
  },
  {
    icon: HiMapPin,
    heading: "Visit us",
    description: "Our engineering hub in the heart of MP.",
    details: "Jabalpur, Madhya Pradesh, India",
  },
  {
    icon: HiPhone,
    heading: "Call us",
    description: "Mon - Fri From 8am to 5pm.",
    details: "+91-7440682926",
    href: "tel:+917440682926",
  },
];

const ContactCard = ({ element, index }) => {
  const Icon = element.icon;
  const Wrapper = element.href ? "a" : "div";

  return (
    <motion.li variants={item}>
      <Wrapper
        {...(element.href ? { href: element.href } : {})}
        className="group relative flex gap-5 overflow-hidden rounded-2xl border border-white/[0.07] bg-white/[0.02] p-6 outline-none transition-all duration-500 hover:-translate-y-1 hover:border-[#ffb454]/40 hover:bg-[#ffb454]/[0.04] focus-visible:border-[#ffb454]"
      >
        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-white/15 text-[#ffb454] transition-all duration-500 group-hover:border-[#ffb454] group-hover:bg-[#ffb454] group-hover:text-[#1d1a16]">
          <Icon className="h-5 w-5" />
        </span>

        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-3">
            <h3 className={`text-lg font-semibold tracking-tight text-[#f3ece0] ${display}`}>
              {element.heading}
            </h3>
            <span className={`text-xs text-zinc-700 ${mono}`}>{String(index + 1).padStart(2, "0")}</span>
          </div>
          <p className="mt-1.5 text-sm leading-relaxed text-zinc-500">{element.description}</p>
          <p
            className={`mt-3 flex items-center gap-2 break-all text-[13px] text-[#ffb454] ${mono}`}
          >
            {element.details}
            {element.href && (
              <HiArrowUpRight className="h-3.5 w-3.5 shrink-0 opacity-0 transition-all duration-500 group-hover:translate-x-0.5 group-hover:opacity-100" />
            )}
          </p>
        </div>
      </Wrapper>
    </motion.li>
  );
};

const Contact = () => {
  const reduce = useReducedMotion();

  return (
    <section className="relative overflow-hidden bg-[#100f0d] px-5 pb-24 pt-36 sm:px-8 lg:pb-32 lg:pt-44">
      {/* grain */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.06] mix-blend-overlay"
        style={{ backgroundImage: GRAIN }}
      />
      {/* ambient glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute -left-32 top-24 h-96 w-96 rounded-full bg-[#ffb454] opacity-[0.06] blur-3xl"
      />

      <div className="relative mx-auto flex max-w-7xl flex-col justify-between gap-16 lg:flex-row lg:gap-20">
        {/* left: details */}
        <motion.div
          variants={container}
          initial={reduce ? false : "hidden"}
          animate="show"
          className="flex flex-col gap-10 lg:w-[38%]"
        >
          <div>
            <motion.div variants={item} className="flex items-center gap-3">
              <span className="h-px w-8 bg-[#ffb454]" />
              <p className={`text-[11px] uppercase tracking-[0.25em] text-zinc-500 ${mono}`}>
                Get in touch
              </p>
            </motion.div>

            <motion.h1
              variants={item}
              className={`mt-6 text-5xl font-semibold leading-[1.02] tracking-tight text-[#f3ece0] sm:text-6xl ${display}`}
            >
              Let's
              <br />
              connect<span className="text-[#ffb454]">.</span>
            </motion.h1>

            <motion.p variants={item} className="mt-6 max-w-md text-lg leading-relaxed text-zinc-400">
              We're here to help you accelerate your engineering journey. Choose your preferred
              channel.
            </motion.p>
          </div>

          <ul className="flex flex-col gap-4">
            {contactDetails.map((element, index) => (
              <ContactCard key={element.heading} element={element} index={index} />
            ))}
          </ul>
        </motion.div>

        {/* right: form */}
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.1, ease: EASE, delay: 0.4 }}
          className="lg:w-[56%]"
        >
          <div className="relative overflow-hidden rounded-3xl border border-white/[0.08] bg-[#14130f] p-8 sm:p-12">
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 opacity-[0.06] mix-blend-overlay"
              style={{ backgroundImage: GRAIN }}
            />
            <div
              aria-hidden
              className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-[#ffb454] opacity-[0.08] blur-3xl"
            />

            <div className="relative">
              <h2
                className={`text-3xl font-semibold leading-[1.05] tracking-tight text-[#f3ece0] ${display}`}
              >
                Send us a message<span className="text-[#ffb454]">.</span>
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-zinc-500">
                Whether you are looking to accelerate your engineering career, report a bug, or
                partner with us—drop a message below.
              </p>

              <div className="mt-10 border-t border-white/[0.07] pt-10">
                <ContactUsForm />
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Contact;