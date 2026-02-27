import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef } from "react";
import { updatePreferences } from "@/lib/api/preferences";
import { isAppError } from "@/lib/errors";
import { reportError } from "@/lib/sentry";
import { useAuthStore } from "@/stores/auth-store";
import { useLocaleStore } from "@/stores/locale-store";
import { usePreferencesStore } from "@/stores/preferences-store";
import { useThemeStore } from "@/stores/theme-store";
import type { UpdatePreferencesRequest } from "@/types/api";

let skipUntil = 0;

/** Call before hydrating stores from backend to prevent a redundant sync-back. */
export function pauseSync() {
  skipUntil = Date.now() + 200;
}

/** Serialisable snapshot of syncable state for diffing. */
interface SyncSnapshot {
  cityId: string | null;
  calculationMethod: string;
  madhab: string;
  highLatitudeRule: string;
  hijriCorrection: number;
  timeFormat: string;
  theme: string;
  locale: string;
  notificationsEnabled: boolean;
  reminderTiming: string;
  prayerNotifications: string; // JSON-stringified for comparison
  manualAdjustments: string; // JSON-stringified for comparison
}

function takeSnapshot(): SyncSnapshot {
  const prefs = usePreferencesStore.getState();
  return {
    cityId: prefs.city?.id ?? null,
    calculationMethod: prefs.calculationMethod,
    madhab: prefs.madhab,
    highLatitudeRule: prefs.highLatitudeRule,
    hijriCorrection: prefs.hijriCorrection,
    timeFormat: prefs.timeFormat,
    theme: useThemeStore.getState().preference,
    locale: useLocaleStore.getState().locale,
    notificationsEnabled: prefs.notificationsEnabled,
    reminderTiming: prefs.reminderTiming,
    prayerNotifications: JSON.stringify(prefs.prayerNotifications),
    manualAdjustments: JSON.stringify(prefs.adjustments),
  };
}

/** Build a partial request containing only fields that changed since the last sync. */
function buildDiff(prev: SyncSnapshot, curr: SyncSnapshot): UpdatePreferencesRequest | null {
  const req: UpdatePreferencesRequest = {};
  const prefs = usePreferencesStore.getState();

  if (curr.cityId !== prev.cityId && curr.cityId !== null) req.cityId = curr.cityId;
  if (curr.calculationMethod !== prev.calculationMethod) req.calculationMethod = curr.calculationMethod;
  if (curr.madhab !== prev.madhab) req.madhab = curr.madhab;
  if (curr.highLatitudeRule !== prev.highLatitudeRule) req.highLatitudeRule = curr.highLatitudeRule;
  if (curr.hijriCorrection !== prev.hijriCorrection) req.hijriCorrection = curr.hijriCorrection;
  if (curr.timeFormat !== prev.timeFormat) req.timeFormat = curr.timeFormat;
  if (curr.theme !== prev.theme) req.theme = curr.theme;
  if (curr.locale !== prev.locale) req.locale = curr.locale;
  if (curr.notificationsEnabled !== prev.notificationsEnabled)
    req.notificationsEnabled = curr.notificationsEnabled;
  if (curr.reminderTiming !== prev.reminderTiming) req.reminderTiming = curr.reminderTiming;
  if (curr.prayerNotifications !== prev.prayerNotifications)
    req.prayerNotifications = prefs.prayerNotifications;
  if (curr.manualAdjustments !== prev.manualAdjustments) req.manualAdjustments = prefs.adjustments;

  return Object.keys(req).length > 0 ? req : null;
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
  const lastSyncedRef = useRef<SyncSnapshot>(takeSnapshot());

  useEffect(() => {
    // Capture baseline after hydration
    lastSyncedRef.current = takeSnapshot();

    function doSync() {
      const curr = takeSnapshot();
      const diff = buildDiff(lastSyncedRef.current, curr);
      if (!diff) return;

      updatePreferences(diff)
        .then(() => {
          retryCountRef.current = 0;
          lastSyncedRef.current = curr;
          queryClient.invalidateQueries({ queryKey: ["dashboard"] });
        })
        .catch((error: unknown) => {
          if (isAppError(error)) {
            reportError(error);
          }
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
    const unsubLocale = useLocaleStore.subscribe(scheduleSync);

    return () => {
      unsubPrefs();
      unsubTheme();
      unsubLocale();
      if (syncTimerRef.current) clearTimeout(syncTimerRef.current);
      if (retryTimerRef.current) clearTimeout(retryTimerRef.current);
    };
  }, []);
}
