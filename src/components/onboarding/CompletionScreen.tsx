"use client";

import { useTranslations } from "next-intl";
import { useEffect } from "react";

import { CheckIcon } from "@/components/ui/CheckIcon";
import { useBackButton } from "@/hooks/useBackButton";
import { useHaptic } from "@/hooks/useHaptic";
import { useMainButton } from "@/hooks/useMainButton";
import { useAuthStore } from "@/stores/auth-store";
import { useOnboardingStore } from "@/stores/onboarding-store";
import { usePreferencesStore } from "@/stores/preferences-store";

export function CompletionScreen() {
  const t = useTranslations("onboarding.completion");
  const tCommon = useTranslations("common");
  const store = useOnboardingStore();
  const haptic = useHaptic();

  useBackButton(null);
  useMainButton({ text: "", isVisible: false, onClick: () => {} });

  useEffect(() => {
    haptic.notification("success");

    // Copy onboarding data into the preferences store
    const { data } = useOnboardingStore.getState();
    const prefs = usePreferencesStore.getState();
    if (data.city) {
      prefs.setCity(data.city, data.latitude ?? undefined, data.longitude ?? undefined);
    }
    prefs.setNotificationsEnabled(data.notificationsEnabled);
    prefs.setReminderTiming(data.reminderTiming);
    for (const [prayer, enabled] of Object.entries(data.prayerNotifications)) {
      prefs.setPrayerNotification(prayer as import("@/types/prayer").PrayerName, enabled);
    }

    // Mark onboarding as completed
    useAuthStore.getState().setOnboardingCompleted(true);

    const timer = setTimeout(() => {
      store.completeOnboarding();
    }, 2500);

    return () => clearTimeout(timer);
  }, [haptic, store]);

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
