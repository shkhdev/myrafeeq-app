import type { PrayerIconProps } from "./types";

export function IshaIcon({ size = 36, className }: PrayerIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 36 36"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      role="img"
      aria-label="Isha - Night"
    >
      <defs>
        <linearGradient id="isha-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#0a0a2e" />
          <stop offset="50%" stopColor="#1a1a4e" />
          <stop offset="100%" stopColor="#162447" />
        </linearGradient>
        <radialGradient id="isha-moonglow" cx="0.7" cy="0.28" r="0.25">
          <stop offset="0%" stopColor="#fffde0" stopOpacity="0.2" />
          <stop offset="100%" stopColor="#fffde0" stopOpacity="0" />
        </radialGradient>
        <clipPath id="isha-clip">
          <circle cx="18" cy="18" r="16" />
        </clipPath>
      </defs>

      {/* Base circle with sky gradient */}
      <circle cx="18" cy="18" r="16" fill="url(#isha-sky)" />

      <g clipPath="url(#isha-clip)">
        {/* Moon glow */}
        <circle cx="25" cy="10" r="8" fill="url(#isha-moonglow)" />

        {/* Crescent moon — yellow circle with dark overlay to create crescent */}
        <circle cx="24.5" cy="10" r="3.5" fill="#fffde0" opacity="0.9" />
        <circle cx="26" cy="9" r="3" fill="#0e0e36" />

        {/* Stars — varying sizes and opacities */}
        <circle cx="7" cy="7" r="0.7" fill="white" opacity="0.7" />
        <circle cx="12" cy="5" r="0.5" fill="white" opacity="0.5" />
        <circle cx="15" cy="12" r="0.4" fill="white" opacity="0.35" />
        <circle cx="6" cy="16" r="0.5" fill="white" opacity="0.45" />
        <circle cx="30" cy="18" r="0.4" fill="white" opacity="0.3" />
        <circle cx="10" cy="22" r="0.6" fill="white" opacity="0.5" />
        <circle cx="28" cy="6" r="0.4" fill="white" opacity="0.4" />
        <circle cx="18" cy="8" r="0.5" fill="white" opacity="0.25" />

        {/* Mosque silhouette with lit windows */}
        <g opacity="0.35">
          {/* Main dome */}
          <path d="M8 34 L8 28 Q12 24 16 28 L16 34 Z" fill="#080820" />
          {/* Secondary dome */}
          <path d="M17 34 L17 29 Q20 26.5 23 29 L23 34 Z" fill="#080820" />
          {/* Minaret */}
          <rect x="25" y="25" width="1.3" height="9" fill="#080820" />
          <rect x="25.1" y="23.5" width="1.1" height="2" rx="0.5" fill="#080820" />
          {/* Base */}
          <rect x="5" y="32" width="24" height="2" fill="#080820" />
        </g>
        {/* Warm window lights */}
        <circle cx="12" cy="31" r="0.7" fill="#ffd89b" opacity="0.18" />
        <circle cx="14.5" cy="31" r="0.7" fill="#ffd89b" opacity="0.15" />
        <circle cx="20" cy="31.5" r="0.6" fill="#ffd89b" opacity="0.12" />
      </g>
    </svg>
  );
}
