import { usePreferencesStore } from "@/stores/preferences-store";
import { useThemeStore } from "@/stores/theme-store";
import type { UserPreferencesResponse } from "@/types/api";

/** Hydrate zustand stores from a backend preferences response. */
export function hydrateFromBackend(prefs: UserPreferencesResponse) {
  usePreferencesStore.getState().hydrate({
    city: prefs.city,
    calculationMethod: prefs.calculationMethod,
    madhab: prefs.madhab,
    highLatitudeRule: prefs.highLatitudeRule,
    hijriCorrection: prefs.hijriCorrection,
    timeFormat: prefs.timeFormat,
    notificationsEnabled: prefs.notificationsEnabled,
    reminderTiming: prefs.reminderTiming,
    prayerNotifications: prefs.prayerNotifications,
    adjustments: prefs.manualAdjustments,
  });

  if (prefs.theme) {
    useThemeStore.getState().setPreference(prefs.theme);
  }
}
