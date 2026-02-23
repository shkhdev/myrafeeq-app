"use client";

import { useTranslations } from "next-intl";
import { useEffect } from "react";

import { CheckIcon } from "@/components/ui/CheckIcon";
import { useBackButton } from "@/hooks/useBackButton";
import { useCloudStorage } from "@/hooks/useCloudStorage";
import { useHaptic } from "@/hooks/useHaptic";
import { useMainButton } from "@/hooks/useMainButton";
import { useOnboardingStore } from "@/stores/onboarding-store";

export function CompletionScreen() {
  const t = useTranslations("onboarding.completion");
  const tCommon = useTranslations("common");
  const store = useOnboardingStore();
  const haptic = useHaptic();
  const cloudStorage = useCloudStorage();

  useBackButton(null);
  useMainButton({ text: "", isVisible: false, onClick: () => {} });

  useEffect(() => {
    haptic.notification("success");
    cloudStorage.setItem("onboarding-complete", "true");

    const timer = setTimeout(() => {
      store.completeOnboarding();
    }, 2500);

    return () => clearTimeout(timer);
  }, [haptic, cloudStorage, store]);

  return (
    <div
      className="flex flex-col items-center justify-center bg-[#0f1419] px-6"
      style={{ minHeight: "var(--tg-viewport-stable-height, 100dvh)" }}
    >
      {/* Animated checkmark */}
      <div className="animate-scale-in flex h-24 w-24 items-center justify-center rounded-full bg-primary/15">
        <CheckIcon size={48} role="img" ariaLabel={tCommon("success")} animated />
      </div>

      <h2 className="animate-fade-in-up-1 mt-8 text-center text-xl font-bold tracking-tight text-white">
        {t("title")}
      </h2>
      <p className="animate-fade-in-up-2 mx-auto mt-3 max-w-[280px] text-center text-sm leading-relaxed text-white/55">
        {t("description")}
      </p>
    </div>
  );
}
