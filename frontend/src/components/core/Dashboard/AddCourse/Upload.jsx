import React, { useEffect, useRef, useState } from "react";
import { useDropzone } from "react-dropzone";
import { FiUploadCloud } from "react-icons/fi";
import { useSelector } from "react-redux";

import "video-react/dist/video-react.css";
import { Player } from "video-react";

export default function Upload({
  name,
  label,
  register,
  setValue,
  errors,
  video = false,
  viewData = null,
  editData = null,
}) {
  const { course } = useSelector((state) => state.course);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewSource, setPreviewSource] = useState(
    viewData ? viewData : editData ? editData : ""
  );
  const inputRef = useRef(null);

  const onDrop = (acceptedFiles) => {
    const file = acceptedFiles[0];
    if (file) {
      previewFile(file);
      setSelectedFile(file);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: !video
      ? { "image/*": [".jpeg", ".jpg", ".png"] }
      : { "video/*": [".mp4"] },
    onDrop,
  });

  const previewFile = (file) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      setPreviewSource(reader.result);
    };
  };

  useEffect(() => {
    register(name, { required: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [register]);

  useEffect(() => {
    setValue(name, selectedFile);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedFile, setValue]);

  return (
    <div className="flex flex-col gap-2">
      {/* Structural Label Layer */}
      <label className="text-xs font-bold uppercase tracking-wider text-slate-500" htmlFor={name}>
        {label} {!viewData && <sup className="text-red-500">*</sup>}
      </label>
      
      {/* 
        INTERACTIVE DRAG & DROP CONTAINER FRAME
        Dynamically shifts background color and transitions border bounds to Indigo on active file drag overhead
      */}
      <div
        className={`flex min-h-[250px] cursor-pointer items-center justify-center rounded-2xl border-2 border-dashed transition-all duration-200 overflow-hidden
          ${isDragActive 
            ? "border-indigo-500 bg-indigo-50/30" 
            : "border-slate-200 bg-slate-50/50 hover:border-indigo-400 hover:bg-white"
          }`}
      >
        {previewSource ? (
          /* PREVIEW DISPATCH CANVAS LAYER */
          <div className="flex w-full flex-col p-5">
            {!video ? (
              <img
                src={previewSource}
                alt="Preview Canvas"
                className="max-h-[350px] w-full rounded-xl object-cover shadow-sm border border-slate-100"
              />
            ) : (
              <div className="rounded-xl overflow-hidden shadow-sm border border-slate-100 bg-black">
                <Player aspectRatio="16:9" playsInline src={previewSource} />
              </div>
            )}
            
            {/* Cancel Action Override Button */}
            {!viewData && (
              <button
                type="button"
                onClick={() => {
                  setPreviewSource("");
                  setSelectedFile(null);
                  setValue(name, null);
                }}
                className="mt-4 self-center text-xs font-bold text-red-500 hover:text-red-700 hover:underline underline-offset-4"
              >
                Remove File and Replace
              </button>
            )}
          </div>
        ) : (
          /* BLANK BASELINE DROPZONE CANVAS */
          <div
            className="flex w-full flex-col items-center p-6 text-center select-none"
            {...getRootProps()}
          >
            <input {...getInputProps()} ref={inputRef} />
            
            {/* Circular Cloud Icon Node */}
            <div className="grid h-14 w-14 place-items-center rounded-full bg-indigo-50 border border-indigo-100 text-indigo-600 shadow-sm transition-transform group-hover:scale-105">
              <FiUploadCloud className="text-2xl" />
            </div>
            
            <p className="mt-4 max-w-[260px] text-sm font-medium text-slate-600 leading-relaxed">
              Drag and drop an {!video ? "image asset" : "MP4 video clip"}, or click to{" "}
              <span className="font-bold text-indigo-600 underline decoration-indigo-200 decoration-2 underline-offset-2">Browse</span> files
            </p>
            
            {/* Metadata Dimension Standards Labels */}
            <ul className="mt-8 flex items-center justify-center gap-x-8 text-[11px] font-bold uppercase tracking-wider text-slate-400 border-t border-slate-200/60 pt-4 w-11/12 max-w-sm">
              <li>Aspect Ratio 16:9</li>
              <li className="list-disc">Max Size 50MB</li>
            </ul>
          </div>
        )}
      </div>

      {/* Validation Failure Warnings */}
      {errors[name] && (
        <span className="text-xs font-semibold tracking-wide text-red-500 mt-0.5">
          {label} attachment is required to process this asset module.
        </span>
      )}
    </div>
  );
}