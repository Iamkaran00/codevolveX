import React, { useEffect, useRef } from "react";
import { NavLink } from "react-router-dom";
import { SiGithub, SiYoutube } from "react-icons/si";
import { FaLinkedinIn, FaTwitter } from "react-icons/fa";

const LINKS = {
  Platform: ["Courses", "Learning Paths", "Instructors", "Pricing"],
  Company: ["About Us", "Careers", "Blog", "Press"],
  Support: ["Help Centre", "Contact Us", "Community", "Status"],
  Legal: ["Privacy Policy", "Terms of Service", "Cookie Policy"],
};

const SOCIALS = [
  { Icon: FaTwitter, href: "#", label: "Twitter" },
  { Icon: FaLinkedinIn, href: "#", label: "LinkedIn" },
  { Icon: SiGithub, href: "#", label: "GitHub" },
  { Icon: SiYoutube, href: "#", label: "YouTube" },
];

export const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  const footerRef = useRef(null);
  const textRef = useRef(null);

  useEffect(() => {
    let animationFrameId;

    const handleScroll = () => {
      if (!footerRef.current || !textRef.current) return;
      
      const rect = footerRef.current.getBoundingClientRect();
      
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        // NEW MATH: Calculate based on the distance from the bottom of the screen.
        // When the footer hits the absolute bottom of your screen, this equals 0.
        const distanceToBottom = window.innerHeight - rect.bottom;
        
        // Multiply by 0.3 for the parallax speed. 
        const yOffset = distanceToBottom * 0.3; 
        
        textRef.current.style.transform = `translate(-50%, ${yOffset}px)`;
      }
    };

    const onScroll = () => {
      animationFrameId = requestAnimationFrame(handleScroll);
    };

    window.addEventListener("scroll", onScroll);
    handleScroll(); 

    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <footer 
      ref={footerRef} 
      className="relative bg-[#050505] font-['Inter',_sans-serif] overflow-hidden border-t border-white/[0.05] pt-20"
    >
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none z-0" />

      <div className="relative z-10 px-[5%] max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-8 mb-24 md:mb-40">
        <div className="lg:col-span-5 flex flex-col items-start pr-8">
          <NavLink
            to="/"
            className="inline-block text-2xl font-bold text-white tracking-tight mb-6 group font-['Orbitron',_sans-serif]"
          >
            codevolve
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-indigo-500 transition-all duration-300 group-hover:brightness-125">
              X
            </span>
          </NavLink>
          <p className="text-[15px] text-zinc-400 leading-relaxed max-w-[320px] mb-8 font-medium">
            The modern platform for developers who build, not just learn. Master
            the stack, ship real code, and elevate your engineering journey.
          </p>

          <div className="flex gap-4">
            {SOCIALS.map(({ Icon, href, label }) => (
              <a
                key={label}
                href={href}
                aria-label={label}
                className="group relative w-11 h-11 rounded-full bg-white/[0.02] border border-white/[0.05] flex items-center justify-center text-zinc-400 overflow-hidden transition-all duration-300 hover:border-indigo-500/50 hover:shadow-[0_0_20px_rgba(99,102,241,0.2)] hover:-translate-y-1"
              >
                <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/20 to-cyan-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <Icon
                  size={18}
                  className="relative z-10 transition-colors duration-300 group-hover:text-white"
                />
              </a>
            ))}
          </div>
        </div>

        <div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-4 gap-8">
          {Object.entries(LINKS).map(([heading, items]) => (
            <div key={heading} className="flex flex-col">
              <p className="text-xs font-bold tracking-[0.15em] text-white uppercase mb-6">
                {heading}
              </p>
              <ul className="space-y-4">
                {items.map((item) => (
                  <li key={item}>
                    <a
                      href="#"
                      className="group inline-flex items-center text-[14px] text-zinc-400 font-medium hover:text-white transition-colors duration-200"
                    >
                      <span className="relative overflow-hidden pb-0.5">
                        {item}
                        <span className="absolute bottom-0 left-0 w-full h-[1px] bg-cyan-400 -translate-x-[105%] group-hover:translate-x-0 transition-transform duration-300 ease-out" />
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Removed overflow-hidden from this div to prevent any clipping bugs */}
      <div 
        ref={textRef}
        className="absolute bottom-[60px] left-1/2 w-full flex justify-center pointer-events-none z-0"
        style={{ transform: "translate(80%, 150px)" }}
      >
        <span className="text-[16vw] leading-[0.8] font-extrabold text-transparent bg-clip-text bg-gradient-to-b from-white/20 to-transparent font-['Orbitron',_sans-serif] tracking-tighter whitespace-nowrap select-none">
          codevolveX
        </span>
      </div>

      <div className="relative z-20 border-t border-white/[0.05] bg-[#050505]/70 backdrop-blur-xl">
        <div className="px-[5%] py-6 max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-[13px] text-zinc-500 font-medium">
            © {currentYear}{" "}
            <span className="font-['Orbitron',_sans-serif] text-zinc-400">
              CodeVolveX
            </span>{" "}
            All rights reserved.
          </p>

          <div className="flex items-center gap-8">
            <div className="flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-white/[0.02] border border-white/[0.05]">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider">
                All systems operational
              </span>
            </div>

            <p className="text-[13px] text-zinc-500 font-medium hidden sm:block">
              Built with <span className="text-indigo-500">❤️‍🔥</span> for developers.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};