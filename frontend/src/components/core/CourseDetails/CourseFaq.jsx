import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, MessageCircleQuestion } from "lucide-react";

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

function FAQItem({ faq, index }) {
  const [open, setOpen] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.3, ease: "easeOut" }}
      className={`group rounded-2xl transition-all duration-300 border ${
        open
          ? "bg-gradient-to-br from-indigo-50/40 to-violet-50/20 border-violet-200 shadow-[0_4px_20px_-8px_rgba(124,58,237,0.1)]"
          : "bg-white border-indigo-50 hover:border-indigo-100 hover:shadow-sm"
      }`}
    >
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between px-6 py-5 text-left focus:outline-none"
      >
        <span
          className={`text-[15px] pr-4 tracking-tight transition-colors duration-300 ${
            open
              ? "font-semibold text-violet-900"
              : "font-medium text-indigo-950 group-hover:text-indigo-800"
          }`}
        >
          {faq.question}
        </span>
        <div
          className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${
            open ? "bg-violet-100 text-violet-600" : "bg-indigo-50/50 text-indigo-400 group-hover:bg-indigo-100 group-hover:text-indigo-600"
          }`}
        >
          <ChevronDown
            size={16}
            className={`transition-transform duration-400 ease-[0.23,1,0.32,1] ${
              open ? "-rotate-180" : "rotate-0"
            }`}
            strokeWidth={2.5}
          />
        </div>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
            className="overflow-hidden"
          >
            <div className="px-6 pb-6 pt-1">
              <p className="text-[14px] leading-relaxed text-indigo-700/80 pr-8">
                {faq.answer}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function CourseFAQ() {
  return (
    <div className="w-full max-w-3xl mx-auto bg-white p-6 md:p-8 rounded-[2rem] shadow-[0_2px_40px_-12px_rgba(79,70,229,0.05)] ring-1 ring-indigo-50 antialiased">
      {/* Header section */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="mb-8"
      >
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-50 border border-indigo-100/50 mb-4">
          <MessageCircleQuestion size={14} className="text-indigo-500" />
          <span className="text-xs font-semibold text-indigo-600 tracking-wide uppercase">
            Support
          </span>
        </div>
        <h2 className="text-2xl font-semibold tracking-tight text-indigo-950">
          Frequently Asked Questions
        </h2>
        <p className="text-sm font-medium text-indigo-400 mt-2">
          Everything you need to know about the course structure and access.
        </p>
      </motion.div>

      {/* FAQ List */}
      <div className="space-y-3">
        {FAQS.map((faq, i) => (
          <FAQItem key={i} faq={faq} index={i} />
        ))}
      </div>
    </div>
  );
}