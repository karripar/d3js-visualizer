"use client";
import React from "react";
import { useRouter } from "next/navigation";

type BackButtonProps = {
  to?: string; // default: "/"
  label?: string; // default: "Back to Home"
  className?: string;
  variant?: "solid" | "outline" | "ghost";
  onClick?: () => void;
  disabled?: boolean;
};

const stylesByVariant: Record<NonNullable<BackButtonProps["variant"]>, React.CSSProperties> = {
  solid: {
    backgroundColor: "#f3f4f6", // slate-100
    color: "#6b7280", // slate-700
    border: "1px solid #e5e7eb", // slate-200
    boxShadow: "0 1px 2px rgba(0,0,0,0.04)",
  },
  outline: {
    backgroundColor: "transparent",
    color: "#6b7280", // slate-700
    border: "1px solid #d1d5db", // slate-300
    boxShadow: "0 1px 2px rgba(0,0,0,0.03)",
  },
  ghost: {
    backgroundColor: "transparent",
    // slate 500
    color: "#6b7280",
    
    border: "1px solid transparent",
  },
};

export const BackButton: React.FC<BackButtonProps> = ({
  to = "/",
  label = "Back to Home",
  className,
  variant = "outline",
  onClick,
  disabled = false,
}) => {
  const router = useRouter();

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled) return;
    onClick?.();
    router.push(to);
  };

  const baseStyle: React.CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    gap: "8px",
    padding: "8px 12px",
    borderRadius: "8px",
    fontSize: "0.95rem",
    cursor: disabled ? "not-allowed" : "pointer",
    transition: "background-color 150ms ease, border-color 150ms ease, opacity 150ms ease",
    opacity: disabled ? 0.6 : 1,
    ...stylesByVariant[variant],
  };

  const hoverStyle: React.CSSProperties =
    variant === "solid"
      ? { backgroundColor: "#e5e7eb", borderColor: "#d1d5db" } // slate-200/300
      : { borderColor: "#cbd5e1", backgroundColor: "rgba(203,213,225,0.25)" }; // slate-300 bg

  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={handleClick}
      disabled={disabled}
      className={className}
      style={baseStyle}
      onMouseEnter={(e) => {
        Object.assign((e.currentTarget as HTMLButtonElement).style, hoverStyle);
      }}
      onMouseLeave={(e) => {
        Object.assign((e.currentTarget as HTMLButtonElement).style, baseStyle);
      }}
    >
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden="true"
        focusable="false"
      >
        <path
          d="M15 18l-6-6 6-6"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <span>{label}</span>
    </button>
  );
};

export default BackButton;