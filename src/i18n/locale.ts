export const SUPPORTED_LOCALES = ["en", "ar", "uz", "ru"] as const;
export type SupportedLocale = (typeof SUPPORTED_LOCALES)[number];

export const DEFAULT_LOCALE: SupportedLocale = "en";

export const RTL_LOCALES: readonly SupportedLocale[] = ["ar"];

export function resolveLocale(languageCode: string | undefined): SupportedLocale {
  if (!languageCode) return DEFAULT_LOCALE;
  const code = languageCode.toLowerCase();
  if (code === "ar" || code.startsWith("ar_") || code.startsWith("ar-")) return "ar";
  if (SUPPORTED_LOCALES.includes(code as SupportedLocale)) {
    return code as SupportedLocale;
  }
  return DEFAULT_LOCALE;
}

export function isRTL(locale: SupportedLocale): boolean {
  return RTL_LOCALES.includes(locale);
}
