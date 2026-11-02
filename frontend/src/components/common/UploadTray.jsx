import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { cancelUpload } from "../../services/operations/uploadManagerApi";
import { removeUpload } from "../../slices/upload.slice";
const mono = "font-['JetBrains_Mono',ui-monospace,monospace]";

const LABEL = {
  uploading: (u) => `uploading ${u.pct ?? 0}%`,
  verifying: () => "verifying…",
  uploaded: () => "uploaded ✓",
  failed: () => "failed ✗",
  cancelled: () => "cancelled",
};

export default function UploadTray() {
  const dispatch = useDispatch();
  const uploads = useSelector((state) => state.uploads ?? {});

  // warn before closing or refreshing the tab while a video is still going up
  const busy = Object.values(uploads).some(
    (u) => u.status === "uploading" || u.status === "verifying"
  );
  useEffect(() => {
    const onBeforeUnload = (e) => {
      if (busy) {
        e.preventDefault();
        e.returnValue = "";
      }
    };
    window.addEventListener("beforeunload", onBeforeUnload);
    return () => window.removeEventListener("beforeunload", onBeforeUnload);
  }, [busy]);

  // auto-dismiss finished uploads after a few seconds
  useEffect(() => {
    const timers = Object.entries(uploads)
      .filter(([, u]) => u.status === "uploaded" || u.status === "cancelled")
      .map(([id]) => setTimeout(() => dispatch(removeUpload(id)), 4000));
    return () => timers.forEach(clearTimeout);
  }, [uploads, dispatch]);

  const items = Object.entries(uploads);
  if (!items.length) return null;

  return (
    // z-[1100] puts it above your modals (z-[1000]), so it is visible while a modal is open
    <div
      className={`fixed bottom-4 right-4 z-[1100] w-80 overflow-hidden rounded-2xl border border-white/[0.09] bg-[#14130f] text-xs text-zinc-300 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.9)] ${mono}`}
    >
      <div className="flex items-center gap-2 border-b border-white/[0.07] px-4 py-2.5 text-[#ffb454]">
        <span className="h-px w-5 bg-[#ffb454]" />
        <span className="uppercase tracking-[0.2em]">uploads</span>
      </div>

      <ul className="max-h-72 overflow-y-auto">
        {items.map(([id, u]) => (
          <li key={id} className="border-b border-white/[0.05] px-4 py-3 last:border-b-0">
            <div className="flex items-center justify-between gap-3">
              <span className="truncate text-[#f3ece0]">{u.title || u.name}</span>
              <span
                className={
                  u.status === "failed"
                    ? "shrink-0 text-[#e0816f]"
                    : u.status === "uploaded"
                    ? "shrink-0 text-emerald-400"
                    : "shrink-0 text-[#ffb454]"
                }
              >
                {LABEL[u.status]?.(u)}
              </span>
            </div>

            {u.status === "uploading" && (
              <div className="mt-2 h-1 overflow-hidden rounded-full bg-white/10">
                <div
                  className="h-1 rounded-full bg-[#ffb454] transition-[width] duration-300"
                  style={{ width: `${u.pct ?? 0}%` }}
                />
              </div>
            )}

            {u.status === "failed" && u.error && (
              <p className="mt-1.5 break-words text-[#e0816f]/80">{u.error}</p>
            )}

            <div className="mt-2 flex gap-4 text-zinc-500">
              {(u.status === "uploading" || u.status === "failed") && (
                <button
                  type="button"
                  className="cursor-pointer transition-colors hover:text-zinc-200"
                  onClick={() => cancelUpload({ id, sectionId: u.sectionId, dispatch })}
                >
                  cancel
                </button>
              )}
              {(u.status === "failed" || u.status === "uploaded") && (
                <button
                  type="button"
                  className="cursor-pointer transition-colors hover:text-zinc-200"
                  onClick={() => dispatch(removeUpload(id))}
                >
                  dismiss
                </button>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}