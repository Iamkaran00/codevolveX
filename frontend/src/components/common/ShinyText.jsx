import React from "react";

export default function ShinyText({
  text,
  disabled = false,
  speed = 3,
  className = "",
  baseColor = "#8b857a",
  shineColor = "#ffd08a",
}) {
  // Moving highlight layered over a solid base colour, both clipped to the text.
  const shine = `linear-gradient(120deg, transparent 40%, ${shineColor} 50%, transparent 60%)`;
  const base = `linear-gradient(${baseColor}, ${baseColor})`;

  return (
    <span
      className={`inline-block ${className}`}
      style={
        disabled
          ? undefined
          : {
              backgroundImage: `${shine}, ${base}`,
              backgroundSize: "200% 100%, 100% 100%",
              backgroundRepeat: "no-repeat",
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              WebkitTextFillColor: "transparent",
              color: "transparent",
              animation: `cx-shine ${speed}s linear infinite`,
            }
      }
    >
      {text}

      {/* Keyframes injected here so tailwind.config doesn't need to change */}
      <style>{`
        @keyframes cx-shine {
          0%   { background-position: 100% 50%, 0 0; }
          100% { background-position: -100% 50%, 0 0; }
        }
      `}</style>
    </span>
  );
}