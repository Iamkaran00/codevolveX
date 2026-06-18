import React from "react";
import { motion } from "framer-motion";
import { TbBulb, TbShieldCheck } from "react-icons/tb";

import RenderSteps from "./RenderSteps";
import SpotlightCard from "../../../common/Spotlight";
import ShinyText from "../../../common/ShinyText";

export default function AddCourse() {
  return (
    <div className="w-full min-h-screen bg-[#FAFAFC] pb-16 pt-6 font-sans">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full flex flex-col gap-8">
        
        <div className="flex flex-col items-start gap-x-12 gap-y-10 xl:flex-row w-full">
          
     
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="flex flex-1 flex-col w-full"
          >
            <div className="mb-8 border-b border-slate-200/80 pb-6">
              <h1 className="text-4xl font-bold tracking-tight text-slate-900">
                <ShinyText text="Add Course" disabled={false} speed={3} className="!text-indigo-600 " />
              </h1>
              <p className="mt-2 text-1xl text-slate-500 font-medium max-w-lg leading-relaxed">
                Launch a brand new learning path by configuring information modules, sections, and publishing variables.
              </p>
            </div>
            
            <div className="w-full">
              <RenderSteps />
            </div>
          </motion.div>

          <SpotlightCard 
            className="sticky top-10 hidden max-w-[400px] w-full rounded-3xl border border-slate-200/60 bg-white p-8 shadow-[0_4px_24px_-8px_rgba(0,0,0,0.05)] xl:flex flex-col shrink-0"
            spotlightColor="rgba(99, 102, 241, 0.08)"
          >
            <div className="flex items-center gap-x-3 mb-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 border border-amber-100/50 text-amber-500 shadow-sm">
                <TbBulb className="text-xl" />
              </div>
              <p className="text-lg font-bold text-slate-900 tracking-tight">
                Course Upload Tips
              </p>
            </div>
            
            <ul className="flex flex-col gap-y-4 text-sm font-medium text-slate-500 leading-relaxed">
              <li className="flex items-start gap-x-3 group">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-slate-300 transition-colors group-hover:bg-indigo-500" />
                <span>Set the <strong className="text-slate-800 font-bold">Course Price</strong> options clearly or assign free configurations.</span>
              </li>
              <li className="flex items-start gap-x-3 group">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-slate-300 transition-colors group-hover:bg-indigo-500" />
                <span>Standard metrics for modern course thumbnail resolution targets stand at <strong className="text-slate-800 font-bold">1024x576</strong>.</span>
              </li>
              <li className="flex items-start gap-x-3 group">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-slate-300 transition-colors group-hover:bg-indigo-500" />
                <span>The dedicated upload video stream section controls the dynamic course landing page trailer clip.</span>
              </li>
              <li className="flex items-start gap-x-3 group">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-slate-300 transition-colors group-hover:bg-indigo-500" />
                <span>The interactive <strong className="text-indigo-600 font-bold">Course Builder</strong> workspace handles timelines, milestones, and syllabus arrangements.</span>
              </li>
              <li className="flex items-start gap-x-3 group">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-slate-300 transition-colors group-hover:bg-indigo-500" />
                <span>Add sequential lectures inside builder clusters to establish videos, documents, or custom coding assignments.</span>
              </li>
              <li className="flex items-start gap-x-3 group">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-slate-300 transition-colors group-hover:bg-indigo-500" />
                <span>Information saved under supplementary forms formats dynamically inside the unified public description grids.</span>
              </li>
            </ul>

            <div className="mt-8 flex items-start gap-x-3 rounded-2xl bg-indigo-50/50 border border-indigo-100/60 p-4">
              <TbShieldCheck className="text-indigo-500 text-xl shrink-0 mt-0.5" />
              <p className="text-[12px] font-semibold text-indigo-800/90 leading-relaxed">
                Ensure all content assets respect copyright constraints before submitting drafts to the public catalog.
              </p>
            </div>
          </SpotlightCard>

        </div>
      </div>
    </div>
  );
}