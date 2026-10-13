import React, { useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import { FiUploadCloud } from "react-icons/fi";
import { useSelector } from "react-redux";

import "video-react/dist/video-react.css";
import { Player } from "video-react";

/* ---------- design tokens (shared with the rest of the site) ---------- */
const display = "font-['Space_Grotesk',ui-sans-serif,system-ui,sans-serif]";
const mono = "font-['JetBrains_Mono',ui-monospace,monospace]";

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
    disabled: !!viewData, // view-only mode: no interaction
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
  }, [register, name]);

  useEffect(() => {
    setValue(name, selectedFile);
  }, [selectedFile, setValue, name]);

  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={name} className={`text-sm font-medium text-[#f3ece0] ${display}`}>
        {label}{" "}
        {!viewData && (
          <span aria-hidden className="text-[#ffb454]">
            *
          </span>
        )}
      </label>

      {/* root props on the outer container so the whole zone reacts to drops and clicks */}
      <div
        {...getRootProps()}
        className={`group flex min-h-[250px] cursor-pointer items-center justify-center overflow-hidden rounded-2xl border border-dashed transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ffb454]/70 ${
          isDragActive
            ? "border-[#ffb454] bg-[#ffb454]/10"
            : errors[name]
            ? "border-red-400/60 bg-white/[0.02]"
            : "border-white/15 bg-white/[0.02] hover:border-[#ffb454]/50 hover:bg-white/[0.04]"
        }`}
      >
        {/* hidden input must stay directly inside the root props wrapper */}
        <input {...getInputProps({ id: name })} />

        {previewSource ? (
          <div className="flex w-full flex-col p-5">
            {!video ? (
              <img
                src={previewSource}
                alt="Selected thumbnail preview"
                className="max-h-[350px] w-full rounded-xl border border-white/10 object-cover"
              />
            ) : (
              <div
                className="overflow-hidden rounded-xl border border-white/10 bg-black"
                onClick={(e) => e.stopPropagation()}
              >
                {/* stopPropagation keeps the file browser from opening when pressing play */}
                <Player aspectRatio="16:9" playsInline src={previewSource} />
              </div>
            )}

            {!viewData && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation(); // don't reopen the file selector when clearing
                  setPreviewSource("");
                  setSelectedFile(null);
                  setValue(name, null);
                }}
                className="mt-4 cursor-pointer self-center rounded-full px-4 py-1.5 text-xs text-zinc-400 underline-offset-4 transition-colors duration-300 hover:text-red-400 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ffb454]/70"
              >
                Remove and replace
              </button>
            )}
          </div>
        ) : (
          <div className="flex w-full select-none flex-col items-center p-6 text-center">
            <div className="grid h-14 w-14 place-items-center rounded-full border border-[#ffb454]/40 bg-[#ffb454]/10 text-[#ffb454] transition-transform duration-500 group-hover:scale-105">
              <FiUploadCloud className="text-2xl" />
            </div>

            <p className="mt-4 max-w-[260px] text-sm leading-relaxed text-zinc-400">
              Drag and drop {!video ? "an image" : "an MP4 video"}, or click to{" "}
              <span className="text-[#ffb454] underline decoration-[#ffb454]/40 underline-offset-4">
                browse files
              </span>
            </p>

            <p className={`mt-6 w-11/12 max-w-sm border-t border-white/[0.07] pt-4 text-xs text-zinc-600 ${mono}`}>
              16:9 ratio, up to 50 MB
            </p>
          </div>
        )}
      </div>

      {errors[name] && (
        <p role="alert" className="text-xs text-red-400">
          Add {video ? "a video" : "an image"} to continue.
        </p>
      )}
    </div>
  );
}