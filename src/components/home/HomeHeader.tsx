"use client";

import { useTranslations } from "next-intl";

import { GearIcon } from "@/components/icons/GearIcon";
import { LocationPinIcon } from "@/components/ui/LocationPinIcon";
import { useAppStore } from "@/stores/app-store";
import type { City } from "@/types/city";

interface HomeHeaderProps {
  city: City | null;
}

export function HomeHeader({ city }: HomeHeaderProps) {
  const t = useTranslations("home");
  const setScreen = useAppStore((s) => s.setScreen);

  return (
    <div
      className="flex items-center justify-between px-5"
      style={{ paddingTop: "calc(var(--tg-safe-area-inset-top, 0px) + 0.75rem)" }}
    >
      <div className="flex items-center gap-1.5">
        <LocationPinIcon />
        <span className="text-sm font-medium text-on-surface">
          {city ? `${city.name}, ${city.country}` : "—"}
        </span>
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
