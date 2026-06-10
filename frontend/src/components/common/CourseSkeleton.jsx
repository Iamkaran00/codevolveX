import React from "react";

export default function CourseSkeleton() {
  return (
    <div className="flex flex-col items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-md sm:flex-row animate-pulse">
      
      <div className="flex w-full items-center gap-4 sm:w-auto">
        <div className="h-16 w-24 rounded-xl bg-slate-200 shrink-0" />
        
        <div className="flex flex-col gap-2 w-full sm:w-[250px]">
          <div className="h-4 w-3/4 rounded bg-slate-200" />
          <div className="h-3 w-1/2 rounded bg-slate-200" />
        </div>
      </div>

      <div className="flex w-full items-center justify-end sm:w-auto">
        <div className="h-9 w-32 rounded-xl bg-slate-200" />
      </div>

    </div>
  );
}