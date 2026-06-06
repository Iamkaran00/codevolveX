import React from "react";
import { NavLink } from "react-router-dom";
import { SiGithub, SiYoutube } from "react-icons/si";
import { FaLinkedinIn, FaTwitter } from "react-icons/fa";

const LINKS = {
  Platform: ["Courses", "Learning Paths", "Instructors", "Pricing"],
  Company:  ["About Us", "Careers", "Blog", "Press"],
  Support:  ["Help Centre", "Contact Us", "Community", "Status"],
  Legal:    ["Privacy Policy", "Terms of Service", "Cookie Policy"],
};

const SOCIALS = [
  { Icon: FaTwitter,    href: "#", label: "Twitter"  },
  { Icon: FaLinkedinIn, href: "#", label: "LinkedIn" },
  { Icon: SiGithub,     href: "#", label: "GitHub"   },
  { Icon: SiYoutube,    href: "#", label: "YouTube"  },
];

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative bg-[#050505] font-['Inter',_sans-serif] overflow-hidden border-t border-white/[0.05]">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-indigo-900/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="relative z-10 px-[5%] py-20 max-w-7xl mx-auto grid grid-cols-2 lg:grid-cols-6 gap-12 lg:gap-8">
        
        <div className="col-span-2 lg:col-span-2 pr-8">
          <NavLink to="/" className="inline-block  text-2xl font-extrabold text-white tracking-tight mb-4 group font-orbitron">
            code<span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-indigo-500 transition-all duration-300 group-hover:brightness-125">volveX</span>
          </NavLink>
          <p className="text-[14px] text-zinc-400 leading-relaxed max-w-[260px] mb-8 font-medium">
            The modern platform for developers who build, not just learn. Master the stack and ship real code.
          </p>
          
          <div className="flex gap-3">
            {SOCIALS.map(({ Icon, href, label }) => (
              <a
                key={label}
                href={href}
                aria-label={label}
                className="group relative w-10 h-10 rounded-xl bg-white/[0.03] border border-white/[0.08] flex items-center justify-center text-zinc-400 overflow-hidden transition-all duration-300 hover:border-indigo-500/50 hover:shadow-[0_0_20px_rgba(99,102,241,0.2)]"
              >
                {/* Hover gradient background */}
                <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/20 to-cyan-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <Icon size={16} className="relative z-10 transition-colors duration-300 group-hover:text-white" />
              </a>
            ))}
          </div>
        </div>

        {/* Link columns */}
        {Object.entries(LINKS).map(([heading, items]) => (
          <div key={heading} className="col-span-1">
            <p className="text-xs font-bold tracking-[0.15em] text-white uppercase mb-6">
              {heading}
            </p>
            <ul className="space-y-3.5">
              {items.map((item) => (
                <li key={item}>
                  <a
                    href="#"
                    className="group inline-flex items-center text-[14px] text-zinc-400 font-medium hover:text-white transition-colors duration-200"
                  >
                    <span className="relative overflow-hidden">
                      {item}
                      {/* Animated underline effect */}
                      <span className="absolute bottom-0 left-0 w-full h-[1px] bg-cyan-400 -translate-x-[101%] group-hover:translate-x-0 transition-transform duration-300 ease-out" />
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Bottom bar */}
      <div className="relative z-10 border-t border-white/[0.05] bg-white/[0.01]">
        <div className="px-[5%] py-6 max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-[13px] text-zinc-500 font-medium">
            © {currentYear} <span className="font-['Orbitron']">CodeVolveX</span> All rights reserved.
          </p>
          
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.03] border border-white/[0.05]">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="text-[11px] font-mono text-zinc-400 uppercase tracking-wide">
                All systems operational
              </span>
            </div>
            
            <p className="text-[13px] text-zinc-500 font-medium hidden sm:block">
              Built with <span className="text-rose-500">❤️</span> for developers.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};