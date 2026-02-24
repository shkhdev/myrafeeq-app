import { useEffect, useRef, useState } from "react";
import { useTranslations } from "use-intl";

import { useHaptic } from "@/hooks/useHaptic";
import { type ThemePreference, useThemeStore } from "@/stores/theme-store";

const THEME_OPTIONS: ThemePreference[] = ["light", "dark", "system"];

export function ThemeSwitcher() {
  const t = useTranslations("common");
  const [isOpen, setIsOpen] = useState(false);
  const preference = useThemeStore((s) => s.preference);
  const setPreference = useThemeStore((s) => s.setPreference);
  const haptic = useHaptic();
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("pointerdown", handleClickOutside);
    return () => document.removeEventListener("pointerdown", handleClickOutside);
  }, [isOpen]);

  return (
    <div className="relative" ref={menuRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex h-11 w-11 items-center justify-center rounded-full text-on-surface-muted transition-colors hover:text-on-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-on-surface/30"
        aria-label={t("changeTheme")}
      >
        {preference === "light" ? (
          <SunIcon />
        ) : preference === "dark" ? (
          <MoonIcon />
        ) : (
          <SystemIcon />
        )}
      </button>

      {isOpen && (
        <div className="absolute start-0 top-full z-50 mt-2 min-w-40 rounded-xl bg-surface-secondary p-1 shadow-elevated ring-1 ring-on-surface/10">
          {THEME_OPTIONS.map((theme) => (
            <button
              key={theme}
              type="button"
              onClick={() => {
                setPreference(theme);
                haptic.selectionChanged();
                setIsOpen(false);
              }}
              className={`flex h-11 w-full items-center gap-2.5 rounded-lg px-3 text-sm transition-colors ${
                preference === theme
                  ? "bg-primary/15 font-semibold text-primary"
                  : "text-on-surface/80 hover:bg-on-surface/5"
              } focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-on-surface/30`}
            >
              <span className="flex h-5 w-5 items-center justify-center" aria-hidden="true">
                {theme === "light" ? <SunIcon /> : theme === "dark" ? <MoonIcon /> : <SystemIcon />}
              </span>
              {t(`theme_${theme}`)}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function SunIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2" />
      <path d="M12 20v2" />
      <path d="m4.93 4.93 1.41 1.41" />
      <path d="m17.66 17.66 1.41 1.41" />
      <path d="M2 12h2" />
      <path d="M20 12h2" />
      <path d="m6.34 17.66-1.41 1.41" />
      <path d="m19.07 4.93-1.41 1.41" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
    </svg>
  );
}

function SystemIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="2" y="3" width="20" height="14" rx="2" />
      <path d="M8 21h8" />
      <path d="M12 17v4" />
    </svg>
  );
}
