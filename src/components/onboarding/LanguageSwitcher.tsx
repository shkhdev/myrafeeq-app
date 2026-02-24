import { useEffect, useRef, useState } from "react";
import { useTranslations } from "use-intl";

import { useHaptic } from "@/hooks/useHaptic";
import type { SupportedLocale } from "@/i18n/locale";
import { SUPPORTED_LOCALES } from "@/i18n/locale";
import { useLocaleStore } from "@/stores/locale-store";

const LOCALE_LABELS: Record<SupportedLocale, string> = {
  en: "English",
  ar: "\u0627\u0644\u0639\u0631\u0628\u064A\u0629",
  uz: "O\u2018zbek",
  ru: "\u0420\u0443\u0441\u0441\u043A\u0438\u0439",
};

export function LanguageSwitcher() {
  const t = useTranslations("common");
  const [isOpen, setIsOpen] = useState(false);
  const locale = useLocaleStore((s) => s.locale);
  const setLocale = useLocaleStore((s) => s.setLocale);
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
        aria-label={t("changeLanguage")}
      >
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
          <circle cx="12" cy="12" r="10" />
          <path d="M2 12h20" />
          <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute start-0 top-full z-50 mt-2 min-w-40 rounded-xl bg-surface-secondary p-1 shadow-elevated ring-1 ring-on-surface/10">
          {SUPPORTED_LOCALES.map((loc) => (
            <button
              key={loc}
              type="button"
              onClick={() => {
                setLocale(loc);
                haptic.selectionChanged();
                setIsOpen(false);
              }}
              className={`flex h-11 w-full items-center rounded-lg px-3 text-sm transition-colors ${
                locale === loc
                  ? "bg-primary/15 font-semibold text-primary"
                  : "text-on-surface/80 hover:bg-on-surface/5"
              } focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-on-surface/30`}
            >
              {LOCALE_LABELS[loc]}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
