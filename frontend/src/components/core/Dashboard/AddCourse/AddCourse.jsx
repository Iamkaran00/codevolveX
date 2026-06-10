import React from "react";
import RenderSteps from "./RenderSteps";

export default function AddCourse() {
  return (
    <div className="w-full min-h-screen bg-gray-50/10">
      
      {/* 1. SECTION COMPONENT MASTER LAYOUT GRID */}
      <div className="flex w-full flex-col items-start gap-x-8 gap-y-8 xl:flex-row">
        
        {/* LEFT COLUMN: ACTIVE STEPPER WIZARD FLOW */}
        <div className="flex flex-1 flex-col w-full">
          <div className="mb-8 border-b border-slate-200 pb-5">
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
              Add Course
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Launch a brand new learning path by configuring information modules, sections, and publishing variables.
            </p>
          </div>
          
          <div className="w-full animate-fadeIn">
            <RenderSteps />
          </div>
        </div>

        {/* 
          RIGHT COLUMN: STICKY COURSE UPLOAD TIPS REFERENCE CARD 
          Transformed from dark richblack containers to a premium white-and-indigo dashboard tip board
        */}
        <div className="sticky top-10 hidden max-w-[400px] w-full rounded-2xl border border-slate-200 bg-white p-6 shadow-md xl:block shrink-0">
          <p className="mb-5 text-base font-bold text-slate-900 flex items-center gap-x-2">
            <span className="text-indigo-600 text-lg">⚡</span>
            <span>Course Upload Tips</span>
          </p>
          
          <ul className="ml-4 list-disc space-y-3.5 text-xs font-semibold text-slate-500 leading-relaxed">
            <li>Set the Course Price options clearly or assign free configurations.</li>
            <li>Standard metrics for modern course thumbnail resolution targets stand at <span className="text-slate-800 font-bold">1024x576</span>.</li>
            <li>The dedicated upload video stream section controls the dynamic course landing page trailer clip.</li>
            <li>The interactive <span className="text-indigo-600">Course Builder</span> workspace handles timelines, milestones, and syllabus arrangements.</li>
            <li>Add sequential lectures inside builder clusters to establish videos, documents, or custom coding assignments.</li>
            <li>Information saved under supplementary forms formats dynamically inside the unified public description grids.</li>
          </ul>

          {/* Micro Card Guard Banner */}
          <div className="mt-6 rounded-xl bg-indigo-50/50 border border-indigo-100/60 p-3.5 text-[11px] font-medium text-indigo-700/90 text-center">
            Ensure all content assets respect copyright constraints before submitting drafts.
          </div>
        </div>

      </div>
    </div>
  );
}