export function MosqueIcon({ className = "h-30 w-30" }: { className?: string }) {
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
        {/* Crescent moon */}
        <path
          d="M40 8C29 8 20 17 20 28c0 3.5 1 6.8 2.5 9.5C26.5 30 34 25 42 25c5 0 9.5 1.8 13 4.8C56.5 26 54 20 48 14c-2.5-2.5-5.2-4.5-8-6z"
          fill="url(#mosque-gradient)"
          opacity="0.9"
        />
        {/* Star */}
        <path
          d="M52 16l1.5 3 3.5.5-2.5 2.5.5 3.5L52 24l-3 1.5.5-3.5L47 19.5l3.5-.5L52 16z"
          fill="var(--sem-accent)"
          opacity="0.9"
        />
        {/* Mosque dome */}
        <path
          d="M25 52C25 42 32 34 40 34s15 8 15 18v6H25v-6z"
          fill="url(#mosque-gradient)"
          opacity="0.8"
        />
        {/* Minaret left */}
        <rect
          x="18"
          y="44"
          width="5"
          height="20"
          rx="1.5"
          fill="var(--sem-primary)"
          opacity="0.6"
        />
        <rect x="19" y="40" width="3" height="5" rx="1.5" fill="var(--sem-primary)" opacity="0.7" />
        {/* Minaret right */}
        <rect
          x="57"
          y="44"
          width="5"
          height="20"
          rx="1.5"
          fill="var(--sem-primary)"
          opacity="0.6"
        />
        <rect x="58" y="40" width="3" height="5" rx="1.5" fill="var(--sem-primary)" opacity="0.7" />
        {/* Door */}
        <path d="M36 58a4 4 0 0 1 8 0v6h-8v-6z" fill="white" opacity="0.15" />
        {/* Base line */}
        <rect x="14" y="63" width="52" height="2" rx="1" fill="var(--sem-primary)" opacity="0.3" />
        <defs>
          <linearGradient
            id="mosque-gradient"
            x1="40"
            y1="8"
            x2="40"
            y2="64"
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
