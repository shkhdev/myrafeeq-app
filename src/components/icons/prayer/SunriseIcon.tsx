import type { PrayerIconProps } from "./types";

export function SunriseIcon({ size = 36, className }: PrayerIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 36 36"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      role="img"
      aria-label="Sunrise"
    >
      <defs>
        <linearGradient id="sunrise-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#87CEEB" />
          <stop offset="55%" stopColor="#fdb99b" />
          <stop offset="100%" stopColor="#ffdd94" />
        </linearGradient>
        <radialGradient id="sunrise-glow" cx="0.5" cy="0.82" r="0.45">
          <stop offset="0%" stopColor="#FFD700" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#FFD700" stopOpacity="0" />
        </radialGradient>
        <clipPath id="sunrise-clip">
          <circle cx="18" cy="18" r="16" />
        </clipPath>
      </defs>

      {/* Base circle with sky gradient */}
      <circle cx="18" cy="18" r="16" fill="url(#sunrise-sky)" />

      <g clipPath="url(#sunrise-clip)">
        {/* Sun glow */}
        <circle cx="18" cy="30" r="14" fill="url(#sunrise-glow)" />

        {/* Sun - half risen above horizon */}
        <circle cx="18" cy="29" r="6" fill="#FFD700" opacity="0.9" />

        {/* Sun rays */}
        <line
          x1="18"
          y1="20"
          x2="18"
          y2="17"
          stroke="#FFD700"
          strokeWidth="0.7"
          strokeLinecap="round"
          opacity="0.45"
        />
        <line
          x1="12"
          y1="22"
          x2="10"
          y2="20"
          stroke="#FFD700"
          strokeWidth="0.6"
          strokeLinecap="round"
          opacity="0.35"
        />
        <line
          x1="24"
          y1="22"
          x2="26"
          y2="20"
          stroke="#FFD700"
          strokeWidth="0.6"
          strokeLinecap="round"
          opacity="0.35"
        />
        <line
          x1="9.5"
          y1="27"
          x2="7.5"
          y2="26"
          stroke="#FFD700"
          strokeWidth="0.5"
          strokeLinecap="round"
          opacity="0.25"
        />
        <line
          x1="26.5"
          y1="27"
          x2="28.5"
          y2="26"
          stroke="#FFD700"
          strokeWidth="0.5"
          strokeLinecap="round"
          opacity="0.25"
        />
        <line
          x1="14"
          y1="21"
          x2="12"
          y2="18.5"
          stroke="#FFD700"
          strokeWidth="0.5"
          strokeLinecap="round"
          opacity="0.3"
        />

        {/* Landscape silhouette */}
        <path
          d="M2 34 L2 31 Q8 29 14 30 Q20 28 26 30 Q32 29 34 31 L34 34 Z"
          fill="#5a4a3a"
          opacity="0.15"
        />
      </g>
    </svg>
  );
}
