import React, { useEffect, useMemo, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AnimatePresence, motion, useScroll, useSpring } from "framer-motion";
import { FaShoppingCart } from "react-icons/fa";
import { HiArrowRight, HiMagnifyingGlass } from "react-icons/hi2";
import { useSelector } from "react-redux";
import { NavbarLinks } from "../../data/Nav-data";
import ProfileDropdown from "../core/auth/ProfileDropDown";

const EASE = [0.23, 1, 0.32, 1];

const display = "font-['Space_Grotesk',ui-sans-serif,system-ui,sans-serif]";
const mono = "font-['JetBrains_Mono',ui-monospace,monospace]";

const GRAIN = `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.8' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>")`;

const btnGhost =
  "inline-flex cursor-pointer items-center justify-center rounded-full border border-white/15 px-5 py-2 text-[14px] text-zinc-300 transition-all duration-500 hover:border-[#ffb454]/60 hover:bg-[#ffb454]/10 hover:text-[#ffb454]";

const btnPrimary =
  "group inline-flex cursor-pointer items-center justify-center gap-1.5 rounded-full bg-[#ffb454] px-5 py-2 text-[14px] font-semibold text-[#1d1a16] transition-all duration-500 hover:bg-[#ffc272] active:scale-[0.98]";

const Kbd = ({ children }) => (
  <kbd
    className={`rounded-md border border-white/15 bg-white/[0.04] px-1.5 py-0.5 text-[10px] text-zinc-400 ${mono}`}
  >
    {children}
  </kbd>
);

/* ------------------------------------------------------------------ */
/*  Command palette: also acts as the mobile menu                      */
/* ------------------------------------------------------------------ */

function Palette({ open, onClose, items }) {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [sel, setSel] = useState(0);
  const inputRef = useRef(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items;
    return items.filter(
      (it) =>
        it.label.toLowerCase().includes(q) ||
        (it.hint ?? "").toLowerCase().includes(q) ||
        it.group.toLowerCase().includes(q)
    );
  }, [items, query]);

  useEffect(() => {
    if (open) {
      setQuery("");
      setSel(0);
      const t = setTimeout(() => inputRef.current?.focus(), 60);
      return () => clearTimeout(t);
    }
    return undefined;
  }, [open]);

  useEffect(() => setSel(0), [query]);

  const go = (item) => {
    if (!item) return;
    onClose();
    navigate(item.path);
  };

  const onKeyDown = (e) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSel((s) => (filtered.length ? (s + 1) % filtered.length : 0));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSel((s) => (filtered.length ? (s - 1 + filtered.length) % filtered.length : 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      go(filtered[sel]);
    } else if (e.key === "Escape") {
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          onMouseDown={onClose}
          className="fixed inset-0 z-[60] overflow-y-auto bg-[#100f0d]/75 px-4 backdrop-blur-md"
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Jump to"
            onMouseDown={(e) => e.stopPropagation()}
            initial={{ opacity: 0, y: -20, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.97 }}
            transition={{ duration: 0.5, ease: EASE }}
            className="relative mx-auto mt-[10vh] w-full max-w-xl overflow-hidden rounded-3xl border border-white/[0.1] bg-[#14130f] shadow-[0_40px_100px_-20px_rgba(0,0,0,0.9)]"
          >
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 opacity-[0.06] mix-blend-overlay"
              style={{ backgroundImage: GRAIN }}
            />
            <div
              aria-hidden
              className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-[#ffb454]/[0.08] blur-3xl"
            />

            {/* prompt */}
            <div className="relative flex items-center gap-3 border-b border-white/[0.07] px-6 py-5">
              <span className={`text-lg text-[#ffb454] ${mono}`}>$</span>
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={onKeyDown}
                placeholder="jump to a page..."
                aria-label="Jump to a page"
                autoComplete="off"
                spellCheck={false}
                className={`min-w-0 flex-1 bg-transparent text-base text-[#f3ece0] caret-[#ffb454] outline-none placeholder:text-zinc-600 ${mono}`}
              />
              <button onClick={onClose} aria-label="Close">
                <Kbd>esc</Kbd>
              </button>
            </div>

            {/* results */}
            <ul className="relative max-h-[50vh] overflow-y-auto p-2" role="listbox">
              {filtered.length === 0 && (
                <li className={`px-5 py-10 text-center text-sm text-zinc-500 ${mono}`}>
                  command not found: {query}
                </li>
              )}

              {filtered.map((item, i) => {
                const showGroup = i === 0 || filtered[i - 1].group !== item.group;
                const active = i === sel;
                return (
                  <li key={item.id} role="option" aria-selected={active}>
                    {showGroup && (
                      <p
                        className={`px-4 pb-1.5 pt-4 text-[10px] uppercase tracking-[0.25em] text-zinc-600 ${mono}`}
                      >
                        {item.group}
                      </p>
                    )}
                    <button
                      onMouseEnter={() => setSel(i)}
                      onClick={() => go(item)}
                      className="relative flex w-full cursor-pointer items-center justify-between gap-4 rounded-2xl px-4 py-3 text-left"
                    >
                      {active && (
                        <motion.span
                          layoutId="pal-sel"
                          transition={{ type: "spring", stiffness: 420, damping: 34 }}
                          className="absolute inset-0 rounded-2xl border border-[#ffb454]/30 bg-[#ffb454]/[0.07]"
                        />
                      )}
                      <span
                        className={`relative text-[17px] font-medium tracking-tight transition-colors duration-300 ${display} ${
                          active ? "text-[#ffb454]" : "text-[#f3ece0]"
                        }`}
                      >
                        {item.label}
                      </span>
                      <span className="relative flex items-center gap-3">
                        {item.hint && (
                          <span className={`hidden text-[11px] text-zinc-600 sm:block ${mono}`}>
                            {item.hint}
                          </span>
                        )}
                        <HiArrowRight
                          className={`transition-all duration-500 ${
                            active ? "translate-x-0 text-[#ffb454] opacity-100" : "-translate-x-2 opacity-0"
                          }`}
                        />
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>

            {/* footer */}
            <div className="relative hidden items-center gap-5 border-t border-white/[0.07] px-6 py-3.5 sm:flex">
              <span className={`flex items-center gap-2 text-[11px] text-zinc-600 ${mono}`}>
                <Kbd>↑</Kbd>
                <Kbd>↓</Kbd> navigate
              </span>
              <span className={`flex items-center gap-2 text-[11px] text-zinc-600 ${mono}`}>
                <Kbd>↵</Kbd> open
              </span>
              <span className={`ml-auto text-[11px] text-zinc-700 ${mono}`}>codevolveX</span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ------------------------------------------------------------------ */
/*  Pill: one half of the split navbar                                 */
/*                                                                     */
/*  The decorative layer (grain, cursor light, scroll line) lives in   */
/*  its OWN clipped box. The pill itself is NOT overflow-hidden, so    */
/*  dropdowns (profile menu) can open outside of it.                   */
/* ------------------------------------------------------------------ */

function Pill({ compact, progress, className = "", children }) {
  const ref = useRef(null);

  // amber light that follows the cursor across the pill
  const onMove = (e) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    el.style.setProperty("--mx", `${e.clientX - r.left}px`);
    el.style.setProperty("--my", `${e.clientY - r.top}px`);
  };

  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      className={`pointer-events-auto group relative flex items-center rounded-full border backdrop-blur-xl transition-all duration-700 ease-in-out ${
        compact
          ? "h-14 border-white/[0.12] bg-[#16140f]/90 shadow-[0_18px_40px_-16px_rgba(0,0,0,0.9)]"
          : "h-16 border-white/10 bg-[#16140f]/70 shadow-[0_20px_40px_-20px_rgba(0,0,0,0.8)]"
      } ${className}`}
    >
      {/* clipped decoration layer */}
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden rounded-full">
        <div
          className="absolute inset-0 opacity-[0.05] mix-blend-overlay"
          style={{ backgroundImage: GRAIN }}
        />
        <div
          className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          style={{
            background:
              "radial-gradient(220px circle at var(--mx, 50%) var(--my, 50%), rgba(255,180,84,0.10), transparent 70%)",
          }}
        />
        <motion.span
          style={{ scaleX: progress }}
          className="absolute bottom-0 left-0 h-[2px] w-full origin-left bg-gradient-to-r from-[#ff8a3d] to-[#ffb454]"
        />
      </div>

      {children}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Navbar                                                             */
/* ------------------------------------------------------------------ */

export const Navbar = () => {
  const { token } = useSelector((state) => state.auth);
  const { user } = useSelector((state) => state.profile);
  const { totalItems } = useSelector((state) => state.cart);
  const location = useLocation();

  const [compact, setCompact] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [hovered, setHovered] = useState(null);
  const [isMac, setIsMac] = useState(false);

  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 28, mass: 0.3 });

  // the catalog dropdown is gone: link straight to the catalogue instead
  const links = useMemo(() => {
    const rest = (NavbarLinks || []).filter((l) => l.title !== "Catalog");
    if (rest.some((l) => l.path === "/catalogue")) return rest;
    return [...rest.slice(0, 1), { title: "Courses", path: "/catalogue" }, ...rest.slice(1)];
  }, []);

  const isActive = (path) =>
    !!path &&
    (path === "/" ? location.pathname === "/" : location.pathname.startsWith(path));

  const activeIndex = links.findIndex((l) => isActive(l.path));
  const lensIndex = hovered ?? activeIndex; // where the sliding highlight sits

  const dashboardPath =
    user?.accountType === "Student"
      ? "/dashboard/enrolled-courses"
      : "/dashboard/instructor";
  const showCart = token && user?.accountType !== "Instructor";

  // Dashboard now lives in the command palette (and the profile dropdown)
  const items = useMemo(() => {
    const list = links.map((l) => ({
      id: `go-${l.path}`,
      label: l.title,
      hint: l.path,
      group: "Go to",
      path: l.path,
    }));
    if (user) {
      list.push({ id: "dash", label: "Dashboard", hint: dashboardPath, group: "Account", path: dashboardPath });
      list.push({ id: "profile", label: "My profile", hint: "/my-profile", group: "Account", path: "/my-profile" });
    }
    if (showCart) {
      list.push({
        id: "cart",
        label: "Cart",
        hint: `${totalItems} ${totalItems === 1 ? "item" : "items"}`,
        group: "Account",
        path: "/dashboard/mycart",
      });
    }
    if (token === null) {
      list.push({ id: "login", label: "Login", hint: "/login", group: "Account", path: "/login" });
      list.push({ id: "signup", label: "Create account", hint: "/signup", group: "Account", path: "/signup" });
    }
    return list;
  }, [links, user, token, showCart, totalItems, dashboardPath]);

  useEffect(() => {
    setIsMac(/mac/i.test(navigator.platform || ""));
  }, []);

  // sticky: the bar never hides, it only tightens once you scroll
  useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        setCompact(window.scrollY > 50);
        ticking = false;
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Ctrl/Cmd + K, or "/" , opens the palette
  useEffect(() => {
    const onKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setPaletteOpen((v) => !v);
        return;
      }
      const t = e.target;
      const typing =
        t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.isContentEditable);
      if (e.key === "/" && !typing) {
        e.preventDefault();
        setPaletteOpen(true);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    setPaletteOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    document.body.style.overflow = paletteOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [paletteOpen]);

  return (
    <>
      <div className="pointer-events-none fixed left-0 top-4 z-50 flex w-full justify-center px-3">
        <div
          className={`flex w-full items-center justify-between gap-3 transition-[max-width] duration-700 ease-in-out ${
            compact ? "max-w-6xl" : "max-w-[1400px]"
          }`}
        >
         
          <Pill compact={compact} progress={progress} className="z-10 gap-2 pl-2 pr-3 sm:pr-4">
            <Link
              to="/"
              aria-label="codevolveX home"
              className="group/brand relative flex shrink-0 items-center gap-2.5 rounded-full py-1 pl-1 pr-2"
            >
              
              <span className={`text-xl font-semibold tracking-tight text-[#f3ece0] ${display}`}>
                codevolve<span className="text-[#ffb454]">X</span>
              </span>
            </Link>

            <span aria-hidden className="mx-1 hidden h-6 w-px bg-white/10 md:block" />

            <nav className="relative hidden md:block" aria-label="Main">
              <ul className="flex items-center" onMouseLeave={() => setHovered(null)}>
                {links.map((link, i) => {
                  const active = isActive(link.path);
                  const lens = i === lensIndex;
                  return (
                    <li key={link.title}>
                      <Link
                        to={link.path}
                        onMouseEnter={() => setHovered(i)}
                        onFocus={() => setHovered(i)}
                        onBlur={() => setHovered(null)}
                        className="relative block rounded-full px-4 py-2 outline-none"
                      >
                        {lens && (
                          <motion.span
                            layoutId="nav-lens"
                            transition={{ type: "spring", stiffness: 380, damping: 32 }}
                            className="absolute inset-0 rounded-full border border-white/10 bg-white/[0.07]"
                          >
                            <span className="absolute bottom-[5px] left-1/2 h-[2px] w-4 -translate-x-1/2 rounded-full bg-[#ffb454] shadow-[0_0_8px_1px_rgba(255,180,84,0.7)]" />
                          </motion.span>
                        )}
                        <span
                          className={`relative text-[14px] transition-colors duration-300 ${
                            active || lens ? "text-[#f3ece0]" : "text-zinc-500"
                          }`}
                        >
                          {link.title}
                        </span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </nav>
          </Pill>

         
          <Pill compact={compact} progress={progress} className="z-20 gap-x-2 px-2.5 sm:gap-x-3 sm:px-3">
            <button
              onClick={() => setPaletteOpen(true)}
              aria-label="Open menu and search"
              className="group/chip relative hidden h-10 cursor-pointer items-center gap-3 rounded-full border border-white/10 pl-4 pr-2.5 transition-all duration-500 hover:border-[#ffb454]/50 lg:flex"
            >
              <HiMagnifyingGlass className="text-zinc-500 transition-colors duration-500 group-hover/chip:text-[#ffb454]" />
              <span className={`text-xs text-zinc-500 ${mono}`}>jump to...</span>
              <Kbd>{isMac ? "⌘K" : "Ctrl K"}</Kbd>
            </button>

            <button
              onClick={() => setPaletteOpen(true)}
              aria-label="Open menu and search"
              className={`relative flex h-10 cursor-pointer items-center gap-2 rounded-full border border-white/10 px-4 text-xs text-zinc-300 transition-all duration-500 hover:border-[#ffb454]/50 hover:text-[#ffb454] lg:hidden ${mono}`}
            >
              <HiMagnifyingGlass />
              <span className="hidden sm:inline md:hidden">Menu</span>
              <span className="hidden md:inline">Jump</span>
            </button>

            {token &&user &&  showCart && (
              <Link
                to="/dashboard/mycart"
                aria-label="Cart"
                className="group/cart relative flex h-10 w-10 items-center justify-center rounded-full border border-white/10 transition-all duration-500 hover:border-[#ffb454]/50"
              >
                <FaShoppingCart className="text-[15px] text-zinc-400 transition-colors duration-500 group-hover/cart:text-[#ffb454]" />
                <AnimatePresence>
                  {totalItems > 0 && (
                    <motion.span
                      key={totalItems}
                      initial={{ scale: 0.4, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.4, opacity: 0 }}
                      transition={{ type: "spring", stiffness: 500, damping: 18 }}
                      className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-[#ffb454] px-1 text-[10px] font-bold text-[#1d1a16] ring-2 ring-[#16140f]"
                    >
                      {totalItems}
                    </motion.span>
                  )}
                </AnimatePresence>
              </Link>
            )}

            {!user && (
              <div className="relative hidden items-center gap-x-2 md:flex">
                <Link to="/login">
                  <button className={btnGhost}>Login</button>
                </Link>
                <Link to="/signup">
                  <button className={btnPrimary}>
                    Get started
                    <HiArrowRight className="h-3.5 w-3.5 transition-transform duration-500 group-hover:translate-x-0.5" />
                  </button>
                </Link>
              </div>
            )}

            {token && (
              <div className="relative">
                <ProfileDropdown />
              </div>
            )}
          </Pill>
        </div>
      </div>

      <Palette open={paletteOpen} onClose={() => setPaletteOpen(false)} items={items} />
    </>
  );
};