import React, { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { MdWifiOff, MdWifi, MdRefresh } from "react-icons/md";

const EASE = [0.23, 1, 0.32, 1];

const display = "font-['Space_Grotesk',ui-sans-serif,system-ui,sans-serif]";
const mono = "font-['JetBrains_Mono',ui-monospace,monospace]";

// Pings a tiny, always-up endpoint on the real internet. With mode "no-cors" the
// promise resolves if the request got out, and rejects if there's no connection.
// (Pinging your own site isn't enough: on localhost it works even with no internet.)
const PING_URL = "https://www.gstatic.com/generate_204";

async function reallyOnline() {
  if (typeof navigator !== "undefined" && navigator.onLine === false) return false;

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 4000);
  try {
    await fetch(`${PING_URL}?_=${Date.now()}`, {
      method: "GET",
      mode: "no-cors",
      cache: "no-store",
      signal: controller.signal,
    });
    return true;
  } catch {
    return false;
  } finally {
    clearTimeout(timeout);
  }
}

export default function OfflineBanner() {
  const [status, setStatus] = useState("online"); // "online" | "offline" | "back"
  const [checking, setChecking] = useState(false);
  const timer = useRef(null);
  const failures = useRef(0);

  const goOffline = useCallback(() => {
    clearTimeout(timer.current);
    setStatus("offline");
  }, []);

  const goOnline = useCallback(() => {
    failures.current = 0;
    setStatus((prev) => {
      if (prev !== "offline") return prev;
      clearTimeout(timer.current);
      timer.current = setTimeout(() => setStatus("online"), 3200);
      return "back";
    });
  }, []);

  // instant reaction to the browser's own events
  useEffect(() => {
    if (!navigator.onLine) setStatus("offline");

    const onOffline = () => goOffline();
    const onOnline = async () => {
      // the browser says we're back, but double-check before celebrating
      if (await reallyOnline()) goOnline();
    };

    window.addEventListener("offline", onOffline);
    window.addEventListener("online", onOnline);
    return () => {
      window.removeEventListener("offline", onOffline);
      window.removeEventListener("online", onOnline);
      clearTimeout(timer.current);
    };
  }, [goOffline, goOnline]);

  // heartbeat: catches the cases where the browser never fires an event
  // (router unplugged, Wi-Fi connected but no internet, and so on)
  useEffect(() => {
    let stopped = false;

    const beat = async () => {
      if (stopped) return;
      const ok = await reallyOnline();
      if (stopped) return;
      if (ok) {
        goOnline();
      } else {
        failures.current += 1;
        if (failures.current >= 2 || !navigator.onLine) goOffline();
      }
    };

    beat();
    const id = setInterval(beat, status === "offline" ? 3000 : 4000);

    const onFocus = () => beat();
    window.addEventListener("focus", onFocus);
    document.addEventListener("visibilitychange", onFocus);

    return () => {
      stopped = true;
      clearInterval(id);
      window.removeEventListener("focus", onFocus);
      document.removeEventListener("visibilitychange", onFocus);
    };
  }, [status, goOffline, goOnline]);

  const retry = useCallback(async () => {
    setChecking(true);
    const ok = await reallyOnline();
    setChecking(false);
    if (ok) goOnline();
  }, [goOnline]);

  const offline = status === "offline";

  return (
    <AnimatePresence>
      {status !== "online" && (
        <motion.div
          role="status"
          aria-live="polite"
          initial={{ opacity: 0, y: 40, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 40, scale: 0.96 }}
          transition={{ duration: 0.6, ease: EASE }}
          className="fixed bottom-5 left-1/2 z-[2000] w-[calc(100%-2rem)] max-w-md -translate-x-1/2"
        >
          <div
            className={`relative flex items-center gap-4 overflow-hidden rounded-2xl border bg-[#14130f]/95 p-4 shadow-[0_24px_60px_-20px_rgba(0,0,0,0.9)] backdrop-blur-xl transition-colors duration-700 ${
              offline ? "border-[#e0816f]/40" : "border-[#ffb454]/50"
            }`}
          >
            <span
              className={`relative flex h-11 w-11 shrink-0 items-center justify-center rounded-full border ${
                offline
                  ? "border-[#e0816f]/40 text-[#e0816f]"
                  : "border-[#ffb454]/50 text-[#ffb454]"
              }`}
            >
              {offline && (
                <span
                  aria-hidden
                  className="absolute inset-0 animate-ping rounded-full bg-[#e0816f]/20"
                />
              )}
              {offline ? (
                <MdWifiOff size={20} className="relative" />
              ) : (
                <MdWifi size={20} className="relative" />
              )}
            </span>

            <div className="min-w-0 flex-1">
              <p className={`text-[15px] font-semibold tracking-tight text-[#f3ece0] ${display}`}>
                {offline ? "You're offline" : "Back online"}
              </p>
              <p className="mt-0.5 text-[13px] leading-snug text-zinc-500">
                {offline
                  ? "Please connect to the internet to keep using the site."
                  : "Connection restored. You're good to go."}
              </p>
            </div>

            {offline && (
              <button
                onClick={retry}
                disabled={checking}
                className={`flex shrink-0 cursor-pointer items-center gap-2 rounded-full border border-white/15 px-4 py-2 text-xs text-zinc-300 transition-all duration-500 hover:border-[#ffb454]/60 hover:text-[#ffb454] disabled:cursor-wait disabled:opacity-60 ${mono}`}
              >
                <MdRefresh className={checking ? "animate-spin" : ""} />
                {checking ? "Checking" : "Retry"}
              </button>
            )}

            {/* countdown line when the "back online" message is about to go away */}
            {!offline && (
              <motion.span
                aria-hidden
                initial={{ scaleX: 1 }}
                animate={{ scaleX: 0 }}
                transition={{ duration: 3.2, ease: "linear" }}
                className="absolute bottom-0 left-0 h-px w-full origin-left bg-[#ffb454]"
              />
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}