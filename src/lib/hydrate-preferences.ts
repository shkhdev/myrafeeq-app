import { resolveLocale } from "@/i18n/locale";
import { useLocaleStore } from "@/stores/locale-store";
import { usePreferencesStore } from "@/stores/preferences-store";
import { useThemeStore } from "@/stores/theme-store";
import type { UserPreferencesResponse } from "@/types/api";
import { DEFAULT_ADJUSTMENTS } from "@/types/prayer";

/** Hydrate zustand stores from a backend preferences response. */
export function hydrateFromBackend(prefs: UserPreferencesResponse) {
  usePreferencesStore.getState().hydrate({
    city: prefs.city,
    latitude: prefs.city?.latitude ?? null,
    longitude: prefs.city?.longitude ?? null,
    calculationMethod: prefs.calculationMethod,
    madhab: prefs.madhab,
    highLatitudeRule: prefs.highLatitudeRule,
    hijriCorrection: prefs.hijriCorrection,
    timeFormat: prefs.timeFormat,
    notificationsEnabled: prefs.notificationsEnabled,
    reminderTiming: prefs.reminderTiming,
    prayerNotifications: prefs.prayerNotifications,
    adjustments: { ...DEFAULT_ADJUSTMENTS, ...prefs.manualAdjustments },
  });

  if (prefs.theme) {
    useThemeStore.getState().setPreference(prefs.theme);
  }

  if (prefs.locale) {
    useLocaleStore.getState().setLocale(resolveLocale(prefs.locale));
  }
}
