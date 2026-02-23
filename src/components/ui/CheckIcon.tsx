"use client";

interface CheckIconProps {
  size?: number;
  className?: string;
  strokeWidth?: number;
  role?: string;
  ariaLabel?: string;
  animated?: boolean;
}

export function CheckIcon({
  size = 20,
  className = "text-primary",
  strokeWidth = 2.5,
  role,
  ariaLabel,
  animated = false,
}: CheckIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      role={role}
      aria-label={ariaLabel}
      aria-hidden={!role}
    >
      <polyline
        points="20 6 9 17 4 12"
        style={
          animated
            ? {
                strokeDasharray: 24,
                strokeDashoffset: 0,
                animation: "checkmarkDraw 0.6s ease-out 0.3s both",
              }
            : undefined
        }
      />
    </svg>
  );
}
