import type { PrayerIconProps } from "./types";

export function FajrIcon({ size = 36, className }: PrayerIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 36 36"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      role="img"
      aria-label="Fajr - Pre-dawn"
    >
      <defs>
        <linearGradient id="fajr-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#4a1942" />
          <stop offset="50%" stopColor="#c2567a" />
          <stop offset="100%" stopColor="#f0a570" />
        </linearGradient>
        <radialGradient id="fajr-glow" cx="0.5" cy="1" r="0.6">
          <stop offset="0%" stopColor="#ffd89b" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#ffd89b" stopOpacity="0" />
        </radialGradient>
        <clipPath id="fajr-clip">
          <circle cx="18" cy="18" r="16" />
        </clipPath>
      </defs>

      {/* Base circle with sky gradient */}
      <circle cx="18" cy="18" r="16" fill="url(#fajr-sky)" />

      <g clipPath="url(#fajr-clip)">
        {/* Sun glow on horizon */}
        <circle cx="18" cy="34" r="12" fill="url(#fajr-glow)" />

        {/* Half sun rising */}
        <circle cx="18" cy="33" r="5" fill="#ffd89b" opacity="0.85" />

        {/* Light rays */}
        <line
          x1="18"
          y1="25"
          x2="18"
          y2="22"
          stroke="#ffd89b"
          strokeWidth="0.6"
          strokeLinecap="round"
          opacity="0.35"
        />
        <line
          x1="13"
          y1="27"
          x2="11.5"
          y2="24.5"
          stroke="#ffd89b"
          strokeWidth="0.5"
          strokeLinecap="round"
          opacity="0.25"
        />
        <line
          x1="23"
          y1="27"
          x2="24.5"
          y2="24.5"
          stroke="#ffd89b"
          strokeWidth="0.5"
          strokeLinecap="round"
          opacity="0.25"
        />

        {/* Fading stars */}
        <circle cx="10" cy="8" r="0.6" fill="white" opacity="0.45" />
        <circle cx="24" cy="6" r="0.5" fill="white" opacity="0.3" />
        <circle cx="28" cy="12" r="0.4" fill="white" opacity="0.2" />

        {/* Mosque silhouette on horizon */}
        <g opacity="0.18">
          {/* Dome */}
          <path d="M12 34 Q12 30 15 30 Q18 30 18 34 Z" fill="#1a0a18" />
          {/* Minaret */}
          <rect x="20" y="27" width="1.5" height="7" fill="#1a0a18" />
          <rect x="20.2" y="26" width="1.1" height="1.5" rx="0.5" fill="#1a0a18" />
        </g>
      </g>
    </svg>
  );
}
