export function LocationIcon({ className = "h-30 w-30" }: { className?: string }) {
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
        {/* Location pin — large and clean */}
        <path
          d="M40 6C27 6 17 16 17 29c0 17 23 40 23 40s23-23 23-40C63 16 53 6 40 6z"
          fill="url(#loc-grad)"
          opacity="0.9"
        />
        {/* Inner highlight circle */}
        <circle cx="40" cy="29" r="11" fill="white" opacity="0.15" />
        {/* Center dot */}
        <circle cx="40" cy="29" r="5" fill="white" opacity="0.4" />
        {/* Pulse ring */}
        <circle
          cx="40"
          cy="29"
          r="15"
          stroke="var(--sem-primary)"
          strokeWidth="1"
          fill="none"
          opacity="0.2"
        />
        {/* Compass hints */}
        <circle
          cx="40"
          cy="66"
          r="5"
          stroke="var(--sem-primary)"
          strokeWidth="0.8"
          fill="none"
          opacity="0.25"
        />
        <path d="M40 61l1.2 3.5H38.8L40 61z" fill="var(--sem-primary)" opacity="0.5" />
        <defs>
          <linearGradient
            id="loc-grad"
            x1="40"
            y1="6"
            x2="40"
            y2="69"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="var(--sem-primary)" />
            <stop offset="1" stopColor="var(--sem-primary)" stopOpacity="0.35" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}
