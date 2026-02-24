"use client";

import { useTranslations } from "next-intl";

import { GearIcon } from "@/components/icons/GearIcon";
import { LocationPinIcon } from "@/components/ui/LocationPinIcon";
import { getHijriDate } from "@/lib/hijri-date";
import { useAppStore } from "@/stores/app-store";
import { usePreferencesStore } from "@/stores/preferences-store";
import type { City } from "@/types/city";

interface HomeHeaderProps {
  city: City | null;
}

export function HomeHeader({ city }: HomeHeaderProps) {
  const t = useTranslations("home");
  const setScreen = useAppStore((s) => s.setScreen);
  const hijriCorrection = usePreferencesStore((s) => s.hijriCorrection);
  const hijriDate = getHijriDate(hijriCorrection);

  return (
    <div
      className="flex items-center justify-between px-5"
      style={{ paddingTop: "calc(var(--safe-top, 0px) + 0.75rem)" }}
    >
      <div className="flex items-start gap-1.5">
        <div className="mt-0.5 shrink-0">
          <LocationPinIcon />
        </div>
        <div>
          <p className="text-sm font-medium text-on-surface">
            {city ? `${city.name}, ${city.country}` : "—"}
          </p>
          {city && <p className="text-[11px] text-on-surface-muted">{hijriDate}</p>}
        </div>
      </div>
      <button
        type="button"
        onClick={() => setScreen("settings")}
        className="flex h-10 w-10 items-center justify-center rounded-full text-on-surface-muted transition-colors hover:text-on-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-on-surface/30"
        aria-label={t("settings")}
      >
        <GearIcon size={20} />
      </button>
    </div>
  );
}
