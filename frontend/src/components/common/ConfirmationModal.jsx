import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { FiAlertTriangle, FiInfo } from "react-icons/fi";

const EASE = [0.23, 1, 0.32, 1];

const display = "font-['Space_Grotesk',ui-sans-serif,system-ui,sans-serif]";

export default function ConfirmationModal({ modalData }) {
  const isRed = modalData?.btn1Color === "red";

  // Esc closes the modal the same way the secondary button does
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") modalData?.btn2Handler?.();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [modalData]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4, ease: EASE }}
      onClick={() => modalData?.btn2Handler?.()}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
    >
      <motion.div
        role="dialog"
        aria-modal="true"
        initial={{ opacity: 0, y: 16, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: EASE }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-[440px] rounded-3xl border border-white/10 bg-[#14130f] p-8 shadow-[0_40px_80px_-30px_rgba(0,0,0,0.9)]"
      >
        <div className="flex items-start gap-5">
          <div
            className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full border ${
              isRed
                ? "border-red-400/30 bg-red-400/10 text-red-300"
                : "border-[#ffb454]/30 bg-[#ffb454]/10 text-[#ffb454]"
            }`}
          >
            {isRed ? <FiAlertTriangle className="text-xl" /> : <FiInfo className="text-xl" />}
          </div>

          <div className="flex flex-col pt-0.5">
            <h3
              className={`text-xl font-semibold tracking-tight text-[#f3ece0] ${display}`}
            >
              {modalData?.text1}
            </h3>
            <p className="mt-2 pr-2 text-[15px] leading-relaxed text-zinc-400">
              {modalData?.text2}
            </p>
          </div>
        </div>

        <div className="mt-9 flex flex-col-reverse items-center justify-end gap-3 sm:flex-row">
          <button
            autoFocus
            onClick={modalData?.btn2Handler}
            className="inline-flex w-full items-center justify-center rounded-full border border-white/15 px-6 py-2.5 text-sm text-zinc-300 transition-all duration-500 hover:border-white/30 hover:bg-white/[0.05] hover:text-[#f3ece0] active:scale-[0.98] sm:w-auto"
          >
            {modalData?.btn2Text}
          </button>

          <button
            onClick={modalData?.btn1Handler}
            className={`inline-flex w-full items-center justify-center rounded-full px-7 py-2.5 text-sm font-semibold transition-all duration-500 active:scale-[0.98] sm:w-auto ${
              isRed
                ? "bg-red-500 text-white hover:bg-red-400"
                : "bg-[#ffb454] text-[#1d1a16] hover:bg-[#ffc272]"
            }`}
          >
            {modalData?.btn1Text}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}