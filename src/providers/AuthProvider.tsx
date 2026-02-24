import { type ReactNode, useEffect, useState } from "react";
import { validateTelegramAuth } from "@/lib/api/auth";
import { getPreferences } from "@/lib/api/preferences";
import { useAuthStore } from "@/stores/auth-store";
import { usePreferencesStore } from "@/stores/preferences-store";
import type { ThemePreference } from "@/stores/theme-store";
import { useThemeStore } from "@/stores/theme-store";
import type { UserPreferencesResponse } from "@/types/api";
import type { PrayerNotificationPrefs } from "@/types/onboarding";
import type {
  CalculationMethodId,
  HighLatitudeRule,
  Madhab,
  PrayerTimeAdjustments,
} from "@/types/prayer";

function hydrateFromBackend(prefs: UserPreferencesResponse) {
  usePreferencesStore.getState().hydrate({
    city: prefs.city,
    calculationMethod: prefs.calculationMethod as CalculationMethodId,
    madhab: prefs.madhab as Madhab,
    highLatitudeRule: prefs.highLatitudeRule as HighLatitudeRule,
    hijriCorrection: prefs.hijriCorrection,
    timeFormat: prefs.timeFormat as "12h" | "24h",
    notificationsEnabled: prefs.notificationsEnabled,
    reminderTiming: prefs.reminderTiming as "on_time" | "5min" | "10min" | "15min" | "30min",
    prayerNotifications: prefs.prayerNotifications as unknown as PrayerNotificationPrefs,
    adjustments: prefs.manualAdjustments as unknown as PrayerTimeAdjustments,
  });

  if (prefs.theme) {
    useThemeStore.getState().setPreference(prefs.theme as ThemePreference);
  }
}

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function authenticate() {
      try {
        const sdk = await import("@telegram-apps/sdk-react");
        const initData = sdk.initDataRaw();

        if (!initData) {
          // biome-ignore lint/suspicious/noConsole: auth debug logging
          console.warn("[AuthProvider] No initData available, skipping auth");
          return;
        }

        const response = await validateTelegramAuth(initData);
        if (cancelled) return;

        useAuthStore
          .getState()
          .setAuth(response.token, response.user.telegramId, response.user.onboardingCompleted);

        // Hydrate preferences from backend if user has completed onboarding
        if (response.user.onboardingCompleted) {
          try {
            const prefs = await getPreferences();
            if (!cancelled) {
              hydrateFromBackend(prefs);
            }
          } catch {
            // biome-ignore lint/suspicious/noConsole: preferences fetch error
            console.warn("[AuthProvider] Failed to load preferences from backend");
          }
        }
      } catch (error) {
        // biome-ignore lint/suspicious/noConsole: auth error logging
        console.error("[AuthProvider] Authentication failed:", error);
      } finally {
        if (!cancelled) {
          setIsReady(true);
        }
      }
    }

    authenticate();

    return () => {
      cancelled = true;
    };
  }, []);

  if (!isReady) {
    return null;
  }

  return <>{children}</>;
}
