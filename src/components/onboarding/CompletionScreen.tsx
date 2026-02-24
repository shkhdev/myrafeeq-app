import { useEffect, useRef } from "react";
import { useTranslations } from "use-intl";

import { CheckIcon } from "@/components/ui/CheckIcon";
import { useCompleteOnboarding } from "@/hooks/api/usePreferences";
import { useBackButton } from "@/hooks/useBackButton";
import { useHaptic } from "@/hooks/useHaptic";
import { useMainButton } from "@/hooks/useMainButton";
import { pauseSync } from "@/hooks/usePreferencesSync";
import { useAuthStore } from "@/stores/auth-store";
import { useOnboardingStore } from "@/stores/onboarding-store";
import { usePreferencesStore } from "@/stores/preferences-store";
import type { ThemePreference } from "@/stores/theme-store";
import { useThemeStore } from "@/stores/theme-store";
import type { PrayerNotificationPrefs } from "@/types/onboarding";
import type {
  CalculationMethodId,
  HighLatitudeRule,
  Madhab,
  PrayerTimeAdjustments,
} from "@/types/prayer";

export function CompletionScreen() {
  const t = useTranslations("onboarding.completion");
  const tCommon = useTranslations("common");
  const haptic = useHaptic();
  const completeOnboarding = useCompleteOnboarding();
  const hasMutated = useRef(false);

  useBackButton(null);
  useMainButton({ text: "", isVisible: false, onClick: () => {} });

  // Navigate away after 2.5s regardless of API result
  useEffect(() => {
    const timer = setTimeout(() => {
      useOnboardingStore.getState().completeOnboarding();
    }, 2500);
    return () => clearTimeout(timer);
  }, []);

  // Submit onboarding data to backend (fire once)
  useEffect(() => {
    if (hasMutated.current) return;
    hasMutated.current = true;

    haptic.notification("success");

    const { data } = useOnboardingStore.getState();

    completeOnboarding.mutate(
      {
        cityId: data.city?.id ?? "",
        latitude: data.latitude ?? data.city?.latitude ?? 0,
        longitude: data.longitude ?? data.city?.longitude ?? 0,
        notificationsEnabled: data.notificationsEnabled,
        prayerNotifications: data.prayerNotifications as unknown as Record<string, boolean>,
        reminderTiming: data.reminderTiming,
      },
      {
        onSuccess: (response) => {
          // Hydrate stores from backend response — pause sync to prevent echoing back
          pauseSync();
          const prefs = response.preferences;
          usePreferencesStore.getState().hydrate({
            city: prefs.city,
            calculationMethod: prefs.calculationMethod as CalculationMethodId,
            madhab: prefs.madhab as Madhab,
            highLatitudeRule: prefs.highLatitudeRule as HighLatitudeRule,
            hijriCorrection: prefs.hijriCorrection,
            timeFormat: prefs.timeFormat as "12h" | "24h",
            notificationsEnabled: prefs.notificationsEnabled,
            reminderTiming: prefs.reminderTiming as
              | "on_time"
              | "5min"
              | "10min"
              | "15min"
              | "30min",
            prayerNotifications: prefs.prayerNotifications as unknown as PrayerNotificationPrefs,
            adjustments: prefs.manualAdjustments as unknown as PrayerTimeAdjustments,
          });

          if (prefs.theme) {
            useThemeStore.getState().setPreference(prefs.theme as ThemePreference);
          }

          useAuthStore.getState().setOnboardingCompleted(true);
        },
      },
    );
  }, [haptic, completeOnboarding]);

  return (
    <div
      className="flex flex-col items-center justify-center bg-surface px-6"
      style={{ minHeight: "var(--tg-viewport-stable-height, 100dvh)" }}
    >
      {/* Animated checkmark */}
      <div className="animate-scale-in flex h-24 w-24 items-center justify-center rounded-full bg-primary/15">
        <CheckIcon size={48} role="img" ariaLabel={tCommon("success")} animated />
      </div>

      <h2 className="animate-fade-in-up-1 mt-8 text-center text-xl font-bold tracking-tight text-on-surface">
        {t("title")}
      </h2>
      <p className="animate-fade-in-up-2 mx-auto mt-3 max-w-[280px] text-center text-sm leading-relaxed text-on-surface-muted">
        {t("description")}
      </p>
    </div>
  );
}
