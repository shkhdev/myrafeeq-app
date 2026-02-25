import { useEffect, useRef } from "react";
import { updatePreferences } from "@/lib/api/preferences";
import { useAuthStore } from "@/stores/auth-store";
import { usePreferencesStore } from "@/stores/preferences-store";
import { useThemeStore } from "@/stores/theme-store";
import type { UpdatePreferencesRequest } from "@/types/api";

/**
 * Module-level flag to skip the next sync. Called externally by hydration code
 * (AuthProvider, CompletionScreen) to prevent echoing backend data back.
 *
 * This is intentionally module-level because pauseSync() is called from outside
 * React (store hydration callbacks) and must be synchronously accessible.
 */
let skipNextSync = false;

/** Call before hydrating stores from backend to prevent a redundant sync-back. */
export function pauseSync() {
  skipNextSync = true;
}

function buildRequest(): UpdatePreferencesRequest {
  const prefs = usePreferencesStore.getState();
  const theme = useThemeStore.getState().preference;
  const req: UpdatePreferencesRequest = {
    calculationMethod: prefs.calculationMethod,
    madhab: prefs.madhab,
    highLatitudeRule: prefs.highLatitudeRule,
    hijriCorrection: prefs.hijriCorrection,
    timeFormat: prefs.timeFormat,
    theme,
    notificationsEnabled: prefs.notificationsEnabled,
    reminderTiming: prefs.reminderTiming,
    prayerNotifications: prefs.prayerNotifications as unknown as Record<string, boolean>,
    manualAdjustments: prefs.adjustments as unknown as Record<string, number>,
  };
  if (prefs.city) {
    req.cityId = prefs.city.id;
  }
  return req;
}

/**
 * Subscribes to preferences-store and theme-store changes and syncs them
 * to the backend with a 500ms debounce. Mount once in AppProviders.
 */
export function usePreferencesSync() {
  const syncTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    function scheduleSync() {
      if (skipNextSync) {
        skipNextSync = false;
        return;
      }

      const { token } = useAuthStore.getState();
      if (!token) return;

      if (syncTimerRef.current) clearTimeout(syncTimerRef.current);
      syncTimerRef.current = setTimeout(() => {
        updatePreferences(buildRequest()).catch(() => {
          // biome-ignore lint/suspicious/noConsole: sync error logging
          console.warn("[PreferencesSync] Failed to sync preferences to backend");
        });
      }, 500);
    }

    const unsubPrefs = usePreferencesStore.subscribe(scheduleSync);
    const unsubTheme = useThemeStore.subscribe(scheduleSync);

    return () => {
      unsubPrefs();
      unsubTheme();
      if (syncTimerRef.current) clearTimeout(syncTimerRef.current);
    };
  }, []);
}
