import * as Sentry from "@sentry/react";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef } from "react";
import { updatePreferences } from "@/lib/api/preferences";
import { useAuthStore } from "@/stores/auth-store";
import { usePreferencesStore } from "@/stores/preferences-store";
import { useThemeStore } from "@/stores/theme-store";
import type { UpdatePreferencesRequest } from "@/types/api";

/**
 * Module-level timestamp used to suppress sync-back after hydration.
 * Any store change within the grace window is silently ignored.
 *
 * A boolean flag was insufficient because hydrateFromBackend() updates two
 * stores (preferences + theme), triggering two subscription callbacks — the
 * first would consume a boolean flag, and the second would sync defaults.
 */
let skipUntil = 0;

/** Call before hydrating stores from backend to prevent a redundant sync-back. */
export function pauseSync() {
  skipUntil = Date.now() + 200;
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
    prayerNotifications: prefs.prayerNotifications,
    manualAdjustments: prefs.adjustments,
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
  const queryClient = useQueryClient();
  const syncTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const retryTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const retryCountRef = useRef(0);

  useEffect(() => {
    function doSync() {
      updatePreferences(buildRequest())
        .then(() => {
          retryCountRef.current = 0;
          queryClient.invalidateQueries({ queryKey: ["prayer-times"] });
        })
        .catch((error: unknown) => {
          Sentry.captureException(error, { tags: { context: "preferences.sync" } });
          // biome-ignore lint/suspicious/noConsole: sync error logging
          console.warn(
            "[PreferencesSync] Failed to sync:",
            error instanceof Error ? error.message : error,
          );
          if (retryCountRef.current < 3) {
            retryCountRef.current += 1;
            const delay = 1000 * 2 ** retryCountRef.current; // 2s, 4s, 8s
            retryTimerRef.current = setTimeout(doSync, delay);
          }
        });
    }

    function scheduleSync() {
      if (Date.now() < skipUntil) {
        return;
      }

      const { token } = useAuthStore.getState();
      if (!token) return;

      if (syncTimerRef.current) clearTimeout(syncTimerRef.current);
      if (retryTimerRef.current) clearTimeout(retryTimerRef.current);
      retryCountRef.current = 0;
      syncTimerRef.current = setTimeout(doSync, 500);
    }

    const unsubPrefs = usePreferencesStore.subscribe(scheduleSync);
    const unsubTheme = useThemeStore.subscribe(scheduleSync);

    return () => {
      unsubPrefs();
      unsubTheme();
      if (syncTimerRef.current) clearTimeout(syncTimerRef.current);
      if (retryTimerRef.current) clearTimeout(retryTimerRef.current);
    };
  }, []);
}
