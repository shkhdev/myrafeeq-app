import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import { useTranslations } from "use-intl";

import { CheckIcon } from "@/components/ui/CheckIcon";
import { useCompleteOnboarding } from "@/hooks/api/usePreferences";
import { useHaptic } from "@/hooks/useHaptic";
import { pauseSync } from "@/hooks/usePreferencesSync";
import { hydrateFromBackend } from "@/lib/hydrate-preferences";
import { useAuthStore } from "@/stores/auth-store";
import { useOnboardingStore } from "@/stores/onboarding-store";

export function CompletionScreen() {
  const t = useTranslations("onboarding.completion");
  const tCommon = useTranslations("common");
  const haptic = useHaptic();
  const completeOnboarding = useCompleteOnboarding();
  const queryClient = useQueryClient();
  const hasMutated = useRef(false);
  const [failed, setFailed] = useState(false);

  function submit() {
    const { data } = useOnboardingStore.getState();

    if (!data.city?.id) {
      // Should never reach here — location step should enforce city selection.
      // Defensive fallback: navigate to home and let the user set city in settings.
      useOnboardingStore.getState().completeOnboarding();
      return;
    }

    setFailed(false);
    completeOnboarding.mutate(
      {
        cityId: data.city.id,
        latitude: data.latitude ?? data.city.latitude,
        longitude: data.longitude ?? data.city.longitude,
        notificationsEnabled: data.notificationsEnabled,
        prayerNotifications: data.prayerNotifications as unknown as Record<string, boolean>,
        reminderTiming: data.reminderTiming,
      },
      {
        onSuccess: (response) => {
          // Hydrate stores from backend response — pause sync to prevent echoing back
          pauseSync();
          hydrateFromBackend(response.preferences);

          useAuthStore.getState().setOnboardingCompleted(true);

          // Invalidate prayer-times so HomeScreen fetches fresh data
          queryClient.invalidateQueries({ queryKey: ["prayer-times"] });

          // Navigate to home after a brief delay for the animation
          setTimeout(() => {
            useOnboardingStore.getState().completeOnboarding();
          }, 1500);
        },
        onError: () => {
          setFailed(true);
          haptic.notification("error");
        },
      },
    );
  }

  // Submit onboarding data to backend (fire once)
  // biome-ignore lint/correctness/useExhaustiveDependencies: fire-once effect guarded by hasMutated ref
  useEffect(() => {
    if (hasMutated.current) return;
    hasMutated.current = true;

    haptic.notification("success");
    submit();
  }, []);

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

      {failed && (
        <button
          type="button"
          onClick={() => {
            hasMutated.current = false;
            submit();
          }}
          className="mt-6 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-primary/90"
        >
          {t("retry")}
        </button>
      )}
    </div>
  );
}
