import React from "react";
import { FiAlertTriangle, FiInfo } from "react-icons/fi";

export default function ConfirmationModal({ modalData }) {
  // Explicit Color Strategy: Reads the color directly from your input. Defaults  indigo.
  const themeColor = modalData?.btn1Color === "red" ? "red" : "indigo";
  const isRed = themeColor === "red";

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/20 backdrop-blur-md p-4 transition-all duration-300 animate-fadeIn">
      
      <div className="w-full max-w-[420px] rounded-3xl border border-slate-200/60 bg-white p-8 shadow-[0_8px_30px_rgb(0,0,0,0.08)] animate-scaleUp relative overflow-hidden font-sans">
        
        <div className={`absolute -top-10 -right-10 h-32 w-32 rounded-full blur-3xl opacity-[0.15] pointer-events-none ${
          isRed ? 'bg-red-500' : 'bg-indigo-500'
        }`} />

        <div className="flex items-start gap-4 relative z-10">
          
          <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full border ${
            isRed ? 'bg-red-50 border-red-100 text-red-600' : 'bg-indigo-50 border-indigo-100 text-indigo-600'
          }`}>
            {isRed ? <FiAlertTriangle className="text-xl" /> : <FiInfo className="text-xl" />}
          </div>

          <div className="flex flex-col pt-1">
            <h3 className="text-xl font-bold tracking-tight text-slate-900">
              {modalData?.text1}
            </h3>
            <p className="mt-2 text-sm font-medium text-slate-500 leading-relaxed pr-2">
              {modalData?.text2}
            </p>
          </div>
        </div>
        
        <div className="mt-8 flex flex-col-reverse sm:flex-row items-center justify-end gap-3 relative z-10">
          
          <button 
            className="w-full sm:w-auto inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-bold text-slate-600 transition-all hover:bg-slate-50 hover:text-slate-900 active:scale-[0.98]" 
            onClick={modalData?.btn2Handler}
          >
            {modalData?.btn2Text}
          </button>

          <button
            onClick={modalData?.btn1Handler}
            className={`w-full sm:w-auto inline-flex items-center justify-center rounded-xl px-6 py-2.5 text-sm font-bold text-white transition-all duration-300 active:scale-[0.98] ${
              isRed 
                ? "bg-red-600 hover:bg-red-700 shadow-[0_4px_14px_0_rgba(220,38,38,0.35)] hover:shadow-[0_6px_20px_rgba(220,38,38,0.25)]" 
                : "bg-indigo-600 hover:bg-indigo-700 shadow-[0_4px_14px_0_rgba(79,70,229,0.35)] hover:shadow-[0_6px_20px_rgba(79,70,229,0.25)]"
            }`}
          >
            {modalData?.btn1Text}
          </button>
          
        </div>
      </div>
    </div>
  );
}