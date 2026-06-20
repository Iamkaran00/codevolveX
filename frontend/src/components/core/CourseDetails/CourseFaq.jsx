import React, { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronDown, ChevronUp } from "lucide-react"

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
]

function FAQItem({ faq, index }) {
  const [open, setOpen] = useState(false)

  return (
    <div className="border border-slate-200 rounded-2xl overflow-hidden bg-white">
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between px-6 py-5 text-left hover:bg-slate-50 transition-colors"
      >
        <span className="text-base font-bold text-slate-900 pr-4">
          {faq.question}
        </span>
        {open ? (
          <ChevronUp size={18} className="text-slate-400 shrink-0" />
        ) : (
          <ChevronDown size={18} className="text-slate-400 shrink-0" />
        )}
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
            className="overflow-hidden"
          >
            <div className="border-t border-slate-100 px-6 py-5">
              <p className="text-sm font-medium text-slate-600 leading-relaxed">
                {faq.answer}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default function CourseFAQ() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.3, ease: [0.23, 1, 0.32, 1] }}
    >
      <h2 className="text-2xl font-black text-slate-900 mb-6">
        Frequently Asked Questions
      </h2>

      <div className="space-y-3">
        {FAQS.map((faq, i) => (
          <FAQItem key={i} faq={faq} index={i} />
        ))}
      </div>
    </motion.div>
  )
}