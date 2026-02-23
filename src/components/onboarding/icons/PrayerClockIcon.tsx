export function PrayerClockIcon({ className = "h-30 w-30" }: { className?: string }) {
  return (
    <div
      className={`flex items-center justify-center rounded-full bg-white/5 p-4 ring-1 ring-white/10 ${className}`}
    >
      <svg
        viewBox="0 0 80 80"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="h-full w-full"
        aria-hidden="true"
      >
        {/* Clock face */}
        <circle cx="38" cy="42" r="22" stroke="var(--sem-accent)" strokeWidth="2.5" opacity="0.8" />
        <circle cx="38" cy="42" r="18" fill="white" opacity="0.05" />
        {/* Hour marks */}
        {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((angle) => (
          <line
            key={angle}
            x1={38 + 16 * Math.cos((angle * Math.PI) / 180)}
            y1={42 + 16 * Math.sin((angle * Math.PI) / 180)}
            x2={38 + 18 * Math.cos((angle * Math.PI) / 180)}
            y2={42 + 18 * Math.sin((angle * Math.PI) / 180)}
            stroke="var(--sem-accent)"
            strokeWidth="1.5"
            strokeLinecap="round"
            opacity="0.5"
          />
        ))}
        {/* Hour hand */}
        <line
          x1="38"
          y1="42"
          x2="38"
          y2="30"
          stroke="var(--sem-accent)"
          strokeWidth="2.5"
          strokeLinecap="round"
          opacity="0.9"
        />
        {/* Minute hand */}
        <line
          x1="38"
          y1="42"
          x2="48"
          y2="36"
          stroke="var(--sem-accent)"
          strokeWidth="2"
          strokeLinecap="round"
          opacity="0.7"
        />
        {/* Center dot */}
        <circle cx="38" cy="42" r="2" fill="var(--sem-accent)" />
        {/* Bell notification */}
        <g transform="translate(52, 14)">
          <path
            d="M8 3a5 5 0 0 0-10 0v5c0 1-1 2-2 3h14c-1-1-2-2-2-3V3z"
            fill="var(--sem-primary)"
            opacity="0.9"
          />
          <circle cx="3" cy="13" r="2" fill="var(--sem-primary)" opacity="0.7" />
          {/* Notification dot */}
          <circle cx="9" cy="0" r="3" fill="#ef4444" opacity="0.9" />
        </g>
      </svg>
    </div>
  );
}
