export function QuranBookIcon({ className = "h-30 w-30" }: { className?: string }) {
  return (
    <div
      className={`flex items-center justify-center rounded-full bg-on-surface/5 p-4 ring-1 ring-on-surface/10 ${className}`}
    >
      <svg
        viewBox="0 0 80 80"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="h-full w-full"
        aria-hidden="true"
      >
        {/* Book spine / center fold */}
        <path d="M40 18v46" stroke="var(--sem-primary)" strokeWidth="1.5" opacity="0.4" />
        {/* Left page */}
        <path
          d="M14 20c0-2 1-3 3-3h21c1 0 2 1 2 2v44c0 1-1 2-2 2H17c-2 0-3-1-3-3V20z"
          fill="url(#book-left)"
          opacity="0.7"
        />
        {/* Right page */}
        <path
          d="M66 20c0-2-1-3-3-3H42c-1 0-2 1-2 2v44c0 1 1 2 2 2h21c2 0 3-1 3-3V20z"
          fill="url(#book-right)"
          opacity="0.7"
        />
        {/* Arabic-style text lines on left */}
        <rect x="19" y="26" width="14" height="1.5" rx="0.75" fill="white" opacity="0.2" />
        <rect x="19" y="31" width="12" height="1.5" rx="0.75" fill="white" opacity="0.15" />
        <rect x="19" y="36" width="14" height="1.5" rx="0.75" fill="white" opacity="0.2" />
        <rect x="19" y="41" width="10" height="1.5" rx="0.75" fill="white" opacity="0.15" />
        <rect x="19" y="46" width="14" height="1.5" rx="0.75" fill="white" opacity="0.2" />
        {/* Arabic-style text lines on right */}
        <rect x="47" y="26" width="14" height="1.5" rx="0.75" fill="white" opacity="0.2" />
        <rect x="47" y="31" width="12" height="1.5" rx="0.75" fill="white" opacity="0.15" />
        <rect x="47" y="36" width="14" height="1.5" rx="0.75" fill="white" opacity="0.2" />
        <rect x="47" y="41" width="10" height="1.5" rx="0.75" fill="white" opacity="0.15" />
        <rect x="47" y="46" width="14" height="1.5" rx="0.75" fill="white" opacity="0.2" />
        {/* Decorative star on cover */}
        <path
          d="M40 52l2 4 4.5.7-3.3 3.2.8 4.5L40 62l-4 2.4.8-4.5-3.3-3.2 4.5-.7L40 52z"
          fill="var(--sem-accent)"
          opacity="0.7"
        />
        {/* Tasbeeh beads (small arc) */}
        {[0, 1, 2, 3, 4].map((i) => (
          <circle
            key={i}
            cx={58 + 4 * Math.cos(((i * 30 - 60) * Math.PI) / 180)}
            cy={58 + 4 * Math.sin(((i * 30 - 60) * Math.PI) / 180)}
            r="1.5"
            fill="var(--sem-accent)"
            opacity={0.4 + i * 0.1}
          />
        ))}
        <defs>
          <linearGradient
            id="book-left"
            x1="14"
            y1="17"
            x2="40"
            y2="65"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="var(--sem-primary)" />
            <stop offset="1" stopColor="var(--sem-primary)" stopOpacity="0.6" />
          </linearGradient>
          <linearGradient
            id="book-right"
            x1="66"
            y1="17"
            x2="42"
            y2="65"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="var(--sem-primary)" stopOpacity="0.9" />
            <stop offset="1" stopColor="var(--sem-primary)" stopOpacity="0.5" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}
