"use client";

import { useOnboardingStore } from "@/stores/onboarding-store";

import { CompletionScreen } from "./CompletionScreen";
import { LocationSetup } from "./LocationSetup";
import { NotificationSetup } from "./NotificationSetup";
import { StoryCards } from "./StoryCards";

export function OnboardingFlow() {
  const currentStep = useOnboardingStore((s) => s.currentStep);

  switch (currentStep) {
    case "welcome":
      return <StoryCards />;
    case "location":
      return <LocationSetup />;
    case "notifications":
      return <NotificationSetup />;
    case "completion":
      return <CompletionScreen />;
  }
}
