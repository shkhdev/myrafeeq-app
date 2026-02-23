import { create } from "zustand";
import { persist } from "zustand/middleware";

import type { SupportedLocale } from "@/i18n/locale";
import { DEFAULT_LOCALE } from "@/i18n/locale";

interface LocaleState {
  locale: SupportedLocale;
  setLocale: (locale: SupportedLocale) => void;
}

export const useLocaleStore = create<LocaleState>()(
  persist(
    (set) => ({
      locale: DEFAULT_LOCALE,
      setLocale: (locale) => set({ locale }),
    }),
    { name: "myrafeeq-locale" },
  ),
);
