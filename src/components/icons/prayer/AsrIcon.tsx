import type { PrayerIconProps } from "./types";

export function AsrIcon({ size = 36, className }: PrayerIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 36 36"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      role="img"
      aria-label="Asr - Afternoon"
    >
      <defs>
        <linearGradient id="asr-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#4a90d9" />
          <stop offset="55%" stopColor="#87CEEB" />
          <stop offset="100%" stopColor="#f0c27f" />
        </linearGradient>
        <radialGradient id="asr-glow" cx="0.7" cy="0.55" r="0.35">
          <stop offset="0%" stopColor="#FFA500" stopOpacity="0.25" />
          <stop offset="100%" stopColor="#FFA500" stopOpacity="0" />
        </radialGradient>
        <clipPath id="asr-clip">
          <circle cx="18" cy="18" r="16" />
        </clipPath>
      </defs>

      {/* Base circle with sky gradient */}
      <circle cx="18" cy="18" r="16" fill="url(#asr-sky)" />

      <g clipPath="url(#asr-clip)">
        {/* Sun glow */}
        <circle cx="24" cy="18" r="10" fill="url(#asr-glow)" />

        {/* Sun - lower and off-center right */}
        <circle cx="24" cy="18" r="4" fill="#FFA500" opacity="0.9" />

        {/* Wispy cloud */}
        <ellipse cx="11" cy="14" rx="5" ry="1.5" fill="white" opacity="0.25" />
        <ellipse cx="13" cy="13.2" rx="3" ry="1.2" fill="white" opacity="0.2" />

        {/* Mosque silhouette with elongated shadow */}
        <g opacity="0.2">
          {/* Building */}
          <path d="M7 34 L7 29 Q9.5 26.5 12 29 L12 34 Z" fill="#2a4060" />
          <rect x="12.5" y="27" width="1.2" height="7" fill="#2a4060" />
          <circle cx="13.1" cy="26.5" r="0.5" fill="#2a4060" />
          {/* Elongated afternoon shadow */}
          <path d="M7 34 L14 34 L22 34 L7 32 Z" fill="#2a4060" opacity="0.4" />
        </g>
      </g>
    </svg>
  );
}
