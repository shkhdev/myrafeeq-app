import { create } from "zustand";

import type { SupportedLocale } from "@/i18n/locale";
import { DEFAULT_LOCALE } from "@/i18n/locale";

interface LocaleState {
  locale: SupportedLocale;
  setLocale: (locale: SupportedLocale) => void;
}

export const useLocaleStore = create<LocaleState>()((set) => ({
  locale: DEFAULT_LOCALE,
  setLocale: (locale) => set({ locale }),
}));
