"use client";

import { useEffect, useState } from "react";

import { useCloudStorage } from "@/hooks/useCloudStorage";
import { useAppStore } from "@/stores/app-store";
import { useOnboardingStore } from "@/stores/onboarding-store";
import { usePreferencesStore } from "@/stores/preferences-store";

import { HomeScreen } from "./home/HomeScreen";
import { OnboardingFlow } from "./onboarding/OnboardingFlow";
import { SettingsScreen } from "./settings/SettingsScreen";

interface CloudPreferences {
  city?: {
    id: string;
    name: string;
    country: string;
    latitude: number;
    longitude: number;
  } | null;
}

function hydratePreferencesFromCloud(raw: string): void {
  try {
    const parsed = JSON.parse(raw) as CloudPreferences;
    const store = usePreferencesStore.getState();
    if (parsed.city && !store.city) {
      store.setCity(parsed.city);
    }
  } catch {
    // Ignore parse errors
  }
}

export function AppShell() {
  const cloudStorage = useCloudStorage();
  const [checking, setChecking] = useState(true);
  const [onboardingDone, setOnboardingDone] = useState(false);
  const onboardingComplete = useOnboardingStore((s) => s.isComplete);
  const currentScreen = useAppStore((s) => s.currentScreen);

  useEffect(() => {
    cloudStorage
      .getItem("onboarding-complete")
      .then(async (value) => {
        if (value === "true") {
          const prefs = await cloudStorage.getItem("preferences");
          if (prefs) hydratePreferencesFromCloud(prefs);
          setOnboardingDone(true);
        }
      })
      .finally(() => setChecking(false));
  }, [cloudStorage]);

  if (checking) return null;

  if (!onboardingDone && !onboardingComplete) {
    return <OnboardingFlow />;
  }

  if (currentScreen === "settings") {
    return <SettingsScreen />;
  }

  return <HomeScreen />;
}
