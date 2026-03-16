import React from "react";

export default function ChevronDownIcon({ className = "w-4 h-4", ...props }) {
  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      {...props}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M17 13l-5 5m0 0l-5-5m5 5V6"
      />
    </svg>
  );
}