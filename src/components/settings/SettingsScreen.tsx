import { useCallback } from "react";
import { useTranslations } from "use-intl";

import { BackArrow } from "@/components/ui/BackArrow";
import { useTelegramBackButton } from "@/hooks/useTelegramBackButton";
import { useAppStore } from "@/stores/app-store";

import { AboutSection } from "./AboutSection";
import { AppearanceSettings } from "./AppearanceSettings";
import { LocationSettings } from "./LocationSettings";
import { NotificationSettings } from "./NotificationSettings";
import { PrayerCalculationSettings } from "./PrayerCalculationSettings";

export function SettingsScreen() {
  const t = useTranslations("settings");
  const setScreen = useAppStore((s) => s.setScreen);

  const handleBack = useCallback(() => setScreen("home"), [setScreen]);
  useTelegramBackButton(handleBack);

  return (
    <div
      className="flex flex-col bg-surface"
      style={{ height: "var(--tg-viewport-stable-height, 100dvh)" }}
    >
      {/* Header */}
      <div
        className="shrink-0 flex items-center gap-2 px-3"
        style={{ paddingTop: "calc(var(--safe-top, 0px) + 0.5rem)" }}
      >
        <BackArrow onClick={handleBack} />
        <h1 className="text-lg font-bold text-on-surface">{t("title")}</h1>
      </div>

      {/* Settings sections — scrollable */}
      <div
        className="flex-1 overflow-y-auto px-5"
        style={{ paddingBottom: "calc(var(--safe-bottom, 0px) + 1.5rem)" }}
      >
        <LocationSettings />
        <PrayerCalculationSettings />
        <NotificationSettings />
        <AppearanceSettings />
        <AboutSection />
      </div>
    </div>
  );
}
