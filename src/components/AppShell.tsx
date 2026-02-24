"use client";

import { useAppStore } from "@/stores/app-store";
import { useAuthStore } from "@/stores/auth-store";
import { useOnboardingStore } from "@/stores/onboarding-store";

import { HomeScreen } from "./home/HomeScreen";
import { OnboardingFlow } from "./onboarding/OnboardingFlow";
import { SettingsScreen } from "./settings/SettingsScreen";

export function AppShell() {
  const onboardingCompleted = useAuthStore((s) => s.onboardingCompleted);
  const onboardingComplete = useOnboardingStore((s) => s.isComplete);
  const currentScreen = useAppStore((s) => s.currentScreen);

  if (!onboardingCompleted && !onboardingComplete) {
    return <OnboardingFlow />;
  }

  if (currentScreen === "settings") {
    return <SettingsScreen />;
  }

  return <HomeScreen />;
}
