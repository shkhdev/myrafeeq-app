import type { PrayerIconProps } from "./types";

export function DhuhrIcon({ size = 36, className }: PrayerIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 36 36"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      role="img"
      aria-label="Dhuhr - Noon"
    >
      <defs>
        <linearGradient id="dhuhr-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1e90ff" />
          <stop offset="100%" stopColor="#87CEEB" />
        </linearGradient>
        <radialGradient id="dhuhr-glow" cx="0.5" cy="0.3" r="0.35">
          <stop offset="0%" stopColor="#FFD700" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#FFD700" stopOpacity="0" />
        </radialGradient>
        <clipPath id="dhuhr-clip">
          <circle cx="18" cy="18" r="16" />
        </clipPath>
      </defs>

      {/* Base circle with sky gradient */}
      <circle cx="18" cy="18" r="16" fill="url(#dhuhr-sky)" />

      <g clipPath="url(#dhuhr-clip)">
        {/* Sun glow ring */}
        <circle cx="18" cy="11" r="8" fill="url(#dhuhr-glow)" />

        {/* Sun */}
        <circle cx="18" cy="11" r="4.5" fill="#FFD700" opacity="0.95" />

        {/* Sun rays - 8 evenly spaced */}
        {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => {
          const rad = (angle * Math.PI) / 180;
          const x1 = 18 + 6.5 * Math.cos(rad);
          const y1 = 11 + 6.5 * Math.sin(rad);
          const x2 = 18 + 9 * Math.cos(rad);
          const y2 = 11 + 9 * Math.sin(rad);
          return (
            <line
              key={angle}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke="#FFD700"
              strokeWidth="0.6"
              strokeLinecap="round"
              opacity="0.5"
            />
          );
        })}

        {/* Mosque silhouette - dual dome */}
        <g opacity="0.2">
          <path d="M8 34 L8 30 Q11 27 14 30 L14 34 Z" fill="#0a3060" />
          <path d="M16 34 L16 29 Q20 25.5 24 29 L24 34 Z" fill="#0a3060" />
          {/* Minaret */}
          <rect x="25" y="27" width="1.2" height="7" fill="#0a3060" />
          <circle cx="25.6" cy="26.5" r="0.5" fill="#0a3060" />
        </g>
      </g>
    </svg>
  );
}
