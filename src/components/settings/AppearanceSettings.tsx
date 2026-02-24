"use client";

import { useTranslations } from "next-intl";

import { useHaptic } from "@/hooks/useHaptic";
import type { SupportedLocale } from "@/i18n/locale";
import { SUPPORTED_LOCALES } from "@/i18n/locale";
import { useLocaleStore } from "@/stores/locale-store";
import { usePreferencesStore } from "@/stores/preferences-store";
import { type ThemePreference, useThemeStore } from "@/stores/theme-store";

import { SettingsSection } from "./SettingsSection";

const LOCALE_LABELS: Record<SupportedLocale, string> = {
  en: "English",
  ar: "\u0627\u0644\u0639\u0631\u0628\u064A\u0629",
  uz: "O\u2018zbek",
  ru: "\u0420\u0443\u0441\u0441\u043A\u0438\u0439",
};

const THEME_OPTIONS: ThemePreference[] = ["light", "dark", "system"];

export function AppearanceSettings() {
  const t = useTranslations("settings");
  const tCommon = useTranslations("common");
  const haptic = useHaptic();

  const preference = useThemeStore((s) => s.preference);
  const setPreference = useThemeStore((s) => s.setPreference);
  const locale = useLocaleStore((s) => s.locale);
  const setLocale = useLocaleStore((s) => s.setLocale);
  const timeFormat = usePreferencesStore((s) => s.timeFormat);
  const setTimeFormat = usePreferencesStore((s) => s.setTimeFormat);

  return (
    <SettingsSection title={t("appearance")}>
      {/* Theme selector */}
      <div className="border-b border-on-surface/5 px-4 py-3.5">
        <p className="mb-2 text-[15px] font-medium text-on-surface">{t("theme")}</p>
        <div className="flex gap-1.5 rounded-xl bg-on-surface/5 p-1">
          {THEME_OPTIONS.map((theme) => (
            <button
              key={theme}
              type="button"
              onClick={() => {
                setPreference(theme);
                haptic.selectionChanged();
              }}
              className={`flex-1 rounded-lg py-2 text-xs font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-on-surface/30 ${
                preference === theme
                  ? "bg-surface text-on-surface shadow-sm"
                  : "text-on-surface-muted hover:text-on-surface"
              }`}
            >
              {tCommon(`theme_${theme}`)}
            </button>
          ))}
        </div>
      </div>

      {/* Time format selector */}
      <div className="border-b border-on-surface/5 px-4 py-3.5">
        <p className="mb-2 text-[15px] font-medium text-on-surface">{t("timeFormat")}</p>
        <div className="flex gap-1.5 rounded-xl bg-on-surface/5 p-1">
          {(["12h", "24h"] as const).map((fmt) => (
            <button
              key={fmt}
              type="button"
              onClick={() => {
                setTimeFormat(fmt);
                haptic.selectionChanged();
              }}
              className={`flex-1 rounded-lg py-2 text-xs font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-on-surface/30 ${
                timeFormat === fmt
                  ? "bg-surface text-on-surface shadow-sm"
                  : "text-on-surface-muted hover:text-on-surface"
              }`}
            >
              {fmt === "12h" ? "12h" : "24h"}
            </button>
          ))}
        </div>
      </div>

      {/* Language selector */}
      <div className="px-4 py-3.5">
        <p className="mb-2 text-[15px] font-medium text-on-surface">{t("language")}</p>
        <div className="flex flex-wrap gap-1.5">
          {SUPPORTED_LOCALES.map((loc) => (
            <button
              key={loc}
              type="button"
              onClick={() => {
                setLocale(loc);
                haptic.selectionChanged();
              }}
              className={`rounded-lg px-3 py-2 text-xs font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-on-surface/30 ${
                locale === loc
                  ? "bg-primary/15 text-primary ring-1 ring-primary/30"
                  : "bg-on-surface/5 text-on-surface-muted hover:bg-on-surface/10"
              }`}
            >
              {LOCALE_LABELS[loc]}
            </button>
          ))}
        </div>
      </div>
    </SettingsSection>
  );
}
