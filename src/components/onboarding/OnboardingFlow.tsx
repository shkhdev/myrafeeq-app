"use client";

import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";

import { CheckIcon } from "@/components/ui/CheckIcon";
import { useCloudStorage } from "@/hooks/useCloudStorage";
import { useOnboardingStore } from "@/stores/onboarding-store";

import { CompletionScreen } from "./CompletionScreen";
import { LocationSetup } from "./LocationSetup";
import { NotificationSetup } from "./NotificationSetup";
import { StoryCards } from "./StoryCards";

export function OnboardingFlow() {
  const t = useTranslations("common");
  const store = useOnboardingStore();
  const cloudStorage = useCloudStorage();
  const [checking, setChecking] = useState(true);
  const [alreadyComplete, setAlreadyComplete] = useState(false);

  useEffect(() => {
    cloudStorage
      .getItem("onboarding-complete")
      .then((value) => {
        if (value === "true") {
          setAlreadyComplete(true);
        }
      })
      .finally(() => setChecking(false));
  }, [cloudStorage]);

  if (checking) return null;

  if (alreadyComplete || store.isComplete) {
    return (
      <div className="flex h-dvh flex-col items-center justify-center gap-4 bg-surface px-6">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
          <CheckIcon size={32} strokeWidth={2} role="img" ariaLabel={t("checkmark")} />
        </div>
        <p className="text-title font-semibold text-on-surface">{t("onboardingComplete")}</p>
        <p className="text-body text-on-surface-muted">{t("homeComingSoon")}</p>
      </div>
    );
  }

  const currentScreen = (() => {
    switch (store.currentStep) {
      case "welcome":
        return <StoryCards />;
      case "location":
        return <LocationSetup />;
      case "notifications":
        return <NotificationSetup />;
      case "completion":
        return <CompletionScreen />;
    }
  })();

  return <>{currentScreen}</>;
}
