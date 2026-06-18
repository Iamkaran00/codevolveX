import React from "react";

export default function ShinyText({ 
  text, 
  disabled = false, 
  speed = 3, 
  className = "" 
}) {
  return (
    <span
      className={`inline-block ${className}`}
      style={{
        backgroundImage: disabled 
          ? "none" 
          : "linear-gradient(120deg, rgba(255,255,255,0) 40%, rgba(255,255,255,0.8) 50%, rgba(255,255,255,0) 60%)",
        backgroundSize: "200% 100%",
        WebkitBackgroundClip: "text",
        backgroundClip: "text",
        animation: disabled ? "none" : `shine ${speed}s linear infinite`,
      }}
    >
      {text}
      
      {/* Inject Keyframes directly so you don't have to touch tailwind.config */}
      <style>{`
        @keyframes shine {
          0% { background-position: 100% 50%; }
          100% { background-position: -100% 50%; }
        }
      `}</style>
    </span>
  );
}