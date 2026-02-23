export function BellIcon({ className = "h-30 w-30" }: { className?: string }) {
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
        {/* Main bell */}
        <path
          d="M40 12a18 18 0 0 0-18 18v12c0 3-2 6-4 8h44c-2-2-4-5-4-8V30a18 18 0 0 0-18-18z"
          fill="url(#bell-gradient)"
          opacity="0.85"
        />
        {/* Bell clapper */}
        <path
          d="M35 52a5 5 0 0 0 10 0"
          stroke="var(--sem-primary)"
          strokeWidth="2"
          strokeLinecap="round"
          opacity="0.7"
        />
        {/* Bell top knob */}
        <circle cx="40" cy="12" r="3" fill="var(--sem-accent)" opacity="0.8" />
        {/* Sparkle 1 */}
        <g transform="translate(58, 16)" opacity="0.6">
          <line
            x1="0"
            y1="-4"
            x2="0"
            y2="4"
            stroke="var(--sem-accent)"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <line
            x1="-4"
            y1="0"
            x2="4"
            y2="0"
            stroke="var(--sem-accent)"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </g>
        {/* Sparkle 2 */}
        <g transform="translate(18, 20)" opacity="0.4">
          <line
            x1="0"
            y1="-3"
            x2="0"
            y2="3"
            stroke="var(--sem-accent)"
            strokeWidth="1"
            strokeLinecap="round"
          />
          <line
            x1="-3"
            y1="0"
            x2="3"
            y2="0"
            stroke="var(--sem-accent)"
            strokeWidth="1"
            strokeLinecap="round"
          />
        </g>
        {/* Sparkle 3 */}
        <g transform="translate(62, 36)" opacity="0.5">
          <line
            x1="0"
            y1="-2.5"
            x2="0"
            y2="2.5"
            stroke="var(--sem-accent)"
            strokeWidth="1"
            strokeLinecap="round"
          />
          <line
            x1="-2.5"
            y1="0"
            x2="2.5"
            y2="0"
            stroke="var(--sem-accent)"
            strokeWidth="1"
            strokeLinecap="round"
          />
        </g>
        {/* Sound waves */}
        <path
          d="M15 35c-3-2-5-5-5-9"
          stroke="var(--sem-primary)"
          strokeWidth="1.5"
          strokeLinecap="round"
          opacity="0.3"
        />
        <path
          d="M65 35c3-2 5-5 5-9"
          stroke="var(--sem-primary)"
          strokeWidth="1.5"
          strokeLinecap="round"
          opacity="0.3"
        />
        {/* Crescent accent */}
        <path
          d="M40 64c-2 0-3.5 1-4 2.5 1-0.5 2-0.5 3 0s2 0.5 3 0c-0.5-1.5-2-2.5-4-2.5z"
          fill="var(--sem-accent)"
          opacity="0.4"
        />
        <defs>
          <linearGradient
            id="bell-gradient"
            x1="40"
            y1="12"
            x2="40"
            y2="52"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="var(--sem-primary)" />
            <stop offset="1" stopColor="var(--sem-primary)" stopOpacity="0.5" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}
