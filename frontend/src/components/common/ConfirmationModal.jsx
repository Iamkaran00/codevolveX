import React from "react";
import IconBtn from "./IconBtn";

export default function ConfirmationModal({ modalData }) {
  return (
    <div className="fixed inset-0 z-[100] grid place-items-center bg-slate-900/40 backdrop-blur-sm p-4 transition-all duration-300 animate-fadeIn">
      
      
      <div className="w-full max-w-[400px] rounded-2xl border border-slate-200 bg-white p-6 shadow-xl animate-scaleUp">
        
        <p className="text-lg font-bold text-slate-900">
          {modalData?.text1}
        </p>
        <p className="mt-2 text-sm text-slate-500 leading-relaxed">
          {modalData?.text2}
        </p>
        
        <div className="mt-6 flex items-center justify-end gap-3">
          
<button
  onClick={modalData?.btn1Handler}
  className="rounded-xl bg-indigo-600 px-5 py-2.5 text-xs font-semibold text-white shadow-sm shadow-indigo-100 transition-all hover:bg-indigo-700 active:scale-[0.98]"
>
  {modalData?.btn1Text}
</button>
          
          <button 
            className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-xs font-semibold text-slate-600 transition-all hover:bg-slate-50 hover:text-slate-900 active:scale-[0.98]" 
            onClick={modalData?.btn2Handler}
          >
            {modalData?.btn2Text}
          </button>

        </div>
      </div>
    </div>
  );
}