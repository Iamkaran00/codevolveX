import "./IconBtn.css";
import React from "react";
export default function IconBtn({
  text,
  onclick,
  children,
  disabled,
  outline = false,
  customClasses,
  type,
}) {
  return (
    <button
      disabled={disabled}
      onClick={onclick}
      className={`icon-btn ${outline ? "outline-btn" : "filled-btn"} ${customClasses}`}
      type={type}
    >
      {children ? (
        <>
          <span className={outline ? "outline-text" : ""}>{text}</span>
          {children}
        </>
      ) : (
        text
      )}
    </button>
  );
}
