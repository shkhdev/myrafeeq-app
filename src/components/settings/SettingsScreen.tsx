"use client";

import { useTranslations } from "next-intl";

import { BackArrow } from "@/components/ui/BackArrow";
import { useBackButton } from "@/hooks/useBackButton";
import { useMainButton } from "@/hooks/useMainButton";
import { useAppStore } from "@/stores/app-store";

import { AboutSection } from "./AboutSection";
import { AppearanceSettings } from "./AppearanceSettings";
import { LocationSettings } from "./LocationSettings";
import { NotificationSettings } from "./NotificationSettings";
import { PrayerCalculationSettings } from "./PrayerCalculationSettings";

export function SettingsScreen() {
  const t = useTranslations("settings");
  const setScreen = useAppStore((s) => s.setScreen);

  const handleBack = () => setScreen("home");

  useBackButton(handleBack);
  useMainButton({ text: "", isVisible: false, onClick: () => {} });

  return (
    <div
      className="flex flex-col overflow-y-auto bg-surface"
      style={{ minHeight: "var(--tg-viewport-stable-height, 100dvh)" }}
    >
      {/* Header */}
      <div
        className="flex items-center gap-2 px-3"
        style={{ paddingTop: "calc(var(--tg-safe-area-inset-top, 0px) + 0.5rem)" }}
      >
        <BackArrow onClick={handleBack} />
        <h1 className="text-lg font-bold text-on-surface">{t("title")}</h1>
      </div>

      {/* Settings sections */}
      <div className="flex-1 px-5 pb-6">
        <LocationSettings />
        <PrayerCalculationSettings />
        <NotificationSettings />
        <AppearanceSettings />
        <AboutSection />
      </div>

      {/* Bottom safe area */}
      <div
        className="shrink-0"
        style={{ paddingBottom: "calc(var(--tg-safe-area-inset-bottom, 0px) + 1rem)" }}
      />
    </div>
  );
}
