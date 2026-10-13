import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { NavbarLinks } from "../../data/Nav-data";
import { FaShoppingCart } from "react-icons/fa";
import { MdKeyboardArrowDown } from "react-icons/md";
import { useSelector } from "react-redux";
import { categories } from "../../services/apis";
import { apiConnector } from "../../services/apiconnector";
import ProfileDropdown from "../core/auth/ProfileDropDown";

const display = "font-['Space_Grotesk',ui-sans-serif,system-ui,sans-serif]";

const btnGhost =
  "inline-flex items-center justify-center rounded-full border border-white/15 px-4 py-2 text-[14px] text-zinc-300 transition-all duration-500 hover:border-[#ffb454]/60 hover:bg-[#ffb454]/10 hover:text-[#ffb454]";

const btnPrimary =
  "inline-flex items-center justify-center rounded-full bg-[#ffb454] px-5 py-2 text-[14px] font-semibold text-[#1d1a16] transition-all duration-500 hover:bg-[#ffc272] active:scale-[0.98]";

export const Navbar = () => {
  const { token } = useSelector((state) => state.auth);
  const { user } = useSelector((state) => state.profile);
  const { totalItems } = useSelector((state) => state.cart);
  const location = useLocation();

  const [subLinks, setSubLinks] = useState([]);
  const [isScrolled, setIsScrolled] = useState(false);

  // Fetch Dropdown Links
  const fetchSubLinks = async () => {
    try {
      const result = await apiConnector("GET", categories.CATEGORIES_API);
      setSubLinks(result.data.allCategory);
    } catch (error) {
      console.log("Could not fetch the category list");
    }
  };

  useEffect(() => {
    fetchSubLinks();

    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          setIsScrolled(window.scrollY > 50);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const matchRoute = (route) => {
    return route === location.pathname;
  };

  return (
    <div
      className={`fixed z-50 flex w-full justify-center transition-all duration-700 ease-in-out ${
        isScrolled ? "top-4" : "top-0"
      }`}
    >
      <div
        className={`flex h-16 items-center justify-between px-6 transition-all duration-700 ease-in-out ${
          isScrolled
            ? "w-[95%] max-w-7xl rounded-full border border-white/10 bg-[#16140f]/80 shadow-[0_20px_40px_-20px_rgba(0,0,0,0.8)] backdrop-blur-xl md:w-[80%]"
            : "w-full border-b border-white/[0.07] bg-[#100f0d]/85 backdrop-blur-md"
        }`}
      >
        <Link to="/">
          <p
            className={`text-2xl font-semibold tracking-tight text-[#f3ece0] ${display}`}
          >
            codevolve<span className="text-[#ffb454]">X</span>
          </p>
        </Link>

        <nav className="hidden md:block">
          <ul className="flex items-center gap-x-8 text-[15px] text-zinc-400">
            {NavbarLinks.map((link, index) => (
              <li key={index} className="group relative">
                {link.title === "Catalog" ? (
                  <>
                    <div className="flex cursor-pointer items-center gap-1 py-2 transition-colors duration-500 group-hover:text-[#f3ece0]">
                      <p>{link.title}</p>
                      <MdKeyboardArrowDown className="text-lg transition-transform duration-500 group-hover:-rotate-180" />
                    </div>

                    {/* pt-3 bridges the hover gap so the menu doesn't flicker shut */}
                    <div className="invisible absolute left-1/2 top-full z-50 w-[260px] -translate-x-1/2 translate-y-1 pt-3 opacity-0 transition-all duration-500 group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100">
                      <div className="flex flex-col rounded-2xl border border-white/10 bg-[#171511]/95 p-2 shadow-[0_30px_60px_-20px_rgba(0,0,0,0.8)] backdrop-blur-xl">
                        {subLinks?.length ? (
                          subLinks.map((subLink, i) => (
                            <Link
                              to={subLink.link}
                              key={i}
                              className="rounded-xl px-4 py-2.5 text-zinc-400 transition-all duration-300 hover:bg-white/[0.05] hover:text-[#ffb454]"
                            >
                              <p className="text-[14px]">{subLink.name}</p>
                            </Link>
                          ))
                        ) : (
                          <p className="p-4 text-center text-sm text-zinc-600">
                            Loading...
                          </p>
                        )}
                      </div>
                    </div>
                  </>
                ) : (
                  <Link to={link?.path} className="relative block py-2">
                    <p
                      className={`transition-colors duration-500 ${
                        matchRoute(link?.path)
                          ? "text-[#f3ece0]"
                          : "hover:text-[#f3ece0]"
                      }`}
                    >
                      {link.title}
                    </p>
                    {matchRoute(link?.path) && (
                      <span className="absolute -bottom-0.5 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-[#ffb454]" />
                    )}
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-x-4">
          {token && user?.accountType !== "Instructor" && (
            <Link to="/dashboard/mycart" className="group relative p-2">
              <FaShoppingCart className="cursor-pointer text-xl text-zinc-400 transition-colors duration-500 group-hover:text-[#ffb454]" />
              {totalItems > 0 && (
                <span className="absolute right-0 top-0 grid h-5 w-5 place-items-center rounded-full bg-[#ffb454] text-[10px] font-bold text-[#1d1a16] ring-2 ring-[#100f0d]">
                  {totalItems}
                </span>
              )}
            </Link>
          )}

          {token === null && (
            <div className="flex items-center gap-x-3">
              <Link to="/login">
                <button className={`cursor-pointer ${btnGhost}`}>Login</button>
              </Link>
              <Link to="/signup">
                <button className={`cursor-pointer ${btnPrimary}`}>
                  Create Account
                </button>
              </Link>
            </div>
          )}

          {user != null &&
            (user?.accountType === "Student" ? (
              <Link to="/dashboard/enrolled-courses">
                <button className={`cursor-pointer ${btnGhost}`}>
                  Dashboard
                </button>
              </Link>
            ) : (
              <Link to="/dashboard/instructor">
                <button className={`cursor-pointer ${btnGhost}`}>
                  Dashboard
                </button>
              </Link>
            ))}

          {token != null && <ProfileDropdown />}
        </div>
      </div>
    </div>
  );
};