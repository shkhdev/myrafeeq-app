import type { FC } from "react";
import type { PrayerIconProps } from "@/components/icons/prayer";
import {
  AsrIcon,
  DhuhrIcon,
  FajrIcon,
  IshaIcon,
  MaghribIcon,
  SunriseIcon,
} from "@/components/icons/prayer";
import type { PrayerName } from "@/types/prayer";

type PrayerIconKey = PrayerName | "sunrise";

const PRAYER_ICON_MAP: Record<PrayerIconKey, FC<PrayerIconProps>> = {
  fajr: FajrIcon,
  sunrise: SunriseIcon,
  dhuhr: DhuhrIcon,
  asr: AsrIcon,
  maghrib: MaghribIcon,
  isha: IshaIcon,
};

export function getPrayerIcon(prayerName: PrayerIconKey): FC<PrayerIconProps> {
  return PRAYER_ICON_MAP[prayerName];
}
