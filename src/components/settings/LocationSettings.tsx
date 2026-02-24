"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";

import { CitySearch } from "@/components/onboarding/CitySearch";
import { LocationPinIcon } from "@/components/ui/LocationPinIcon";
import { useHaptic } from "@/hooks/useHaptic";
import { usePreferencesStore } from "@/stores/preferences-store";
import type { City } from "@/types/city";

import { SettingsSection } from "./SettingsSection";

export function LocationSettings() {
  const t = useTranslations("settings");
  const city = usePreferencesStore((s) => s.city);
  const setCity = usePreferencesStore((s) => s.setCity);
  const haptic = useHaptic();
  const [isSearching, setIsSearching] = useState(false);

  const handleCitySelect = (selected: City) => {
    setCity(selected);
    haptic.notification("success");
    setIsSearching(false);
  };

  return (
    <SettingsSection title={t("location")}>
      {isSearching ? (
        <div className="p-4">
          <CitySearch onSelect={handleCitySelect} />
          <button
            type="button"
            onClick={() => setIsSearching(false)}
            className="mt-3 w-full text-center text-sm font-medium text-on-surface-muted transition-colors hover:text-on-surface"
          >
            {t("changeCity")}
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setIsSearching(true)}
          className="flex w-full items-center justify-between px-4 py-3.5 transition-colors hover:bg-on-surface/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-on-surface/30"
        >
          <span className="flex items-center gap-3">
            <LocationPinIcon />
            <span className="text-[15px] font-medium text-on-surface">
              {city ? `${city.name}, ${city.country}` : "—"}
            </span>
          </span>
          <span className="text-sm font-medium text-primary">{t("changeCity")}</span>
        </button>
      )}
    </SettingsSection>
  );
}
