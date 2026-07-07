 
import React, { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { NavbarLinks } from "../../data/Nav-data";
import { FaShoppingCart } from "react-icons/fa";
import { MdKeyboardArrowDown } from "react-icons/md";
import { useSelector } from "react-redux";
import { categories } from "../../services/apis";
import { apiConnector } from "../../services/apiconnector";
import ProfileDropdown from "../core/auth/ProfileDropDown";
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
      className={`fixed z-50 w-full flex justify-center transition-all duration-500 ease-in-out ${
        isScrolled ? "top-4" : "top-0"
      }`}
    >
      <div
        className={`flex items-center justify-between px-6 transition-all duration-500 ease-in-out h-16 ${
          isScrolled
            ? "w-[95%] md:w-[80%] max-w-7xl rounded-full bg-white/70 backdrop-blur-xl border border-white/50 shadow-[0_4px_30px_rgba(0,0,0,0.05)]"
            : "w-full bg-white/95 backdrop-blur-md border-b border-gray-200"
        }`}
      >
       
        <Link to="/">
          <p className="text-2xl font-bold tracking-tighter text-gray-900">
            codevolve<span className="text-blue-600">X</span>
          </p>
        </Link>

        <nav className="hidden md:block">
          <ul className="flex items-center gap-x-8 text-[15px] font-medium text-gray-700">
            {NavbarLinks.map((link, index) => (
              <li key={index} className="group relative">
                {link.title === "Catalog" ? (
                  <>
                    <div className="flex items-center gap-1 cursor-pointer hover:text-blue-600 transition-colors py-2">
                      <p>{link.title}</p>
                      <MdKeyboardArrowDown className="text-lg transition-transform duration-300 group-hover:-rotate-180" />
                    </div>

                     
                    <div className="invisible absolute left-[50%] top-[120%] flex flex-col rounded-2xl bg-white/80 backdrop-blur-xl border border-white/60 shadow-[0_10px_40px_rgba(0,0,0,0.08)] p-3 opacity-0 transition-all duration-300 group-hover:visible group-hover:opacity-100 group-hover:top-[100%] w-[260px] -translate-x-1/2 z-50">
                      {subLinks?.length ? (
                        subLinks.map((subLink, i) => (
                          <Link
                            to={subLink.link}
                            key={i}
                            className="rounded-xl py-2.5 px-4 text-gray-600 hover:bg-blue-50 hover:text-blue-600 transition-all duration-200"
                          >
                            <p className="font-medium text-[14px]">{subLink.name}</p>
                          </Link>
                        ))
                      ) : (
                        <p className="text-center text-sm p-4 text-gray-500">Loading...</p>
                      )}
                    </div>
                  </>
                ) : (
                  <Link to={link?.path} className="py-2 block">
                    <p
                      className={`transition-colors duration-200 ${
                        matchRoute(link?.path)
                          ? "text-blue-600 font-semibold"
                          : "hover:text-blue-600"
                      }`}
                    >
                      {link.title}
                    </p>
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </nav>

       
        <div className="flex items-center gap-x-4">
          {token && user?.accountType !== "Instructor" && (
            <Link to="/dashboard/mycart" className="relative group p-2">
              <FaShoppingCart className="text-xl text-gray-600 cursor-pointer group-hover:text-blue-600 transition-colors" />
              {totalItems > 0 && (
                <span className="absolute top-0 right-0 grid h-5 w-5 place-items-center rounded-full bg-blue-600 text-[10px] font-bold text-white shadow-sm ring-2 ring-white">
                  {totalItems}
                </span>
              )}
            </Link>
          )  }

          {token === null && (
            <div className="flex items-center gap-x-3">
               
              <Link to="/login">
                <button className="px-5 py-2 text-[14px]  cursor-pointer font-medium text-white bg-gray-900 rounded-full shadow-sm hover:bg-gray-800 transition-all hover:shadow-md hover:-translate-y-[1px]">
                 Login
                </button>
              </Link>
              <Link to="/signup">
                <button className="px-5 py-2 cursor-pointer text-[14px] font-medium text-white bg-gray-900 rounded-full shadow-sm hover:bg-gray-800 transition-all hover:shadow-md hover:-translate-y-[1px]">
                  Create Account
                </button>
              </Link>
            </div>
          )}
          {user!=null && ( ( user?.accountType === 'Student') ? (
            <Link to = '/dashboard/enrolled-courses' >
       <button className="px-4 py-2  cursor-pointer text-[14px] font-medium text-gray-700 bg-gray-100/50 backdrop-blur-sm border border-gray-200 rounded-full hover:bg-gray-200/50 transition-colors">
              Dashboard
            </button>

            </Link>
           
          ) : (<Link to = '/dashboard/instructor' >
       <button className="px-4 py-2 text-[14px] font-medium text-gray-700 bg-gray-100/50 backdrop-blur-sm border border-gray-200 rounded-full hover:bg-gray-200/50 transition-colors">
              Dashboard
            </button>

            </Link>))}
          {token != null && <ProfileDropdown/>}
        </div>
      </div>
    </div>
  );
};