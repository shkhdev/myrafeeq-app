import type { PrayerIconProps } from "./types";

export function MaghribIcon({ size = 36, className }: PrayerIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 36 36"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      role="img"
      aria-label="Maghrib - Sunset"
    >
      <defs>
        <linearGradient id="maghrib-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#2d1b69" />
          <stop offset="30%" stopColor="#c2185b" />
          <stop offset="65%" stopColor="#ff6f00" />
          <stop offset="100%" stopColor="#ffab40" />
        </linearGradient>
        <radialGradient id="maghrib-glow" cx="0.5" cy="0.85" r="0.45">
          <stop offset="0%" stopColor="#FF6F00" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#FF6F00" stopOpacity="0" />
        </radialGradient>
        <clipPath id="maghrib-clip">
          <circle cx="18" cy="18" r="16" />
        </clipPath>
      </defs>

      {/* Base circle with sky gradient */}
      <circle cx="18" cy="18" r="16" fill="url(#maghrib-sky)" />

      <g clipPath="url(#maghrib-clip)">
        {/* Sun glow on horizon */}
        <circle cx="18" cy="30" r="14" fill="url(#maghrib-glow)" />

        {/* Setting sun - half hidden */}
        <circle cx="18" cy="30" r="4.5" fill="#FF6F00" opacity="0.9" />

        {/* Early stars */}
        <circle cx="8" cy="7" r="0.5" fill="white" opacity="0.5" />
        <circle cx="27" cy="9" r="0.4" fill="white" opacity="0.35" />

        {/* Mosque silhouette — prominent against fiery sky */}
        <g opacity="0.65">
          {/* Main dome */}
          <path d="M10 34 L10 27 Q14 23 18 27 L18 34 Z" fill="#1a0a28" />
          {/* Secondary dome */}
          <path d="M19 34 L19 28 Q22 25.5 25 28 L25 34 Z" fill="#1a0a28" />
          {/* Minaret with crescent finial */}
          <rect x="27" y="23" width="1.4" height="11" fill="#1a0a28" />
          <rect x="27.2" y="21.5" width="1" height="2" rx="0.5" fill="#1a0a28" />
          {/* Crescent finial */}
          <circle cx="27.7" cy="20.5" r="1" fill="#1a0a28" />
          <circle cx="28.1" cy="20.3" r="0.75" fill="url(#maghrib-sky)" />
          {/* Base wall */}
          <rect x="6" y="31" width="24" height="3" fill="#1a0a28" />
        </g>
      </g>
    </svg>
  );
}
