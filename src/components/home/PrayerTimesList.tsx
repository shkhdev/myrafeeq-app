"use client";

import { useTranslations } from "next-intl";

import { useHaptic } from "@/hooks/useHaptic";
import {
  ALL_PRAYER_SLOTS,
  getCurrentPrayerPeriod,
  getTodayDate,
  type PrayerTimeSlot,
} from "@/lib/prayer-time-utils";
import { usePrayerTrackingStore } from "@/stores/prayer-tracking-store";
import type { PrayerTimes } from "@/types/prayer";
import { PRAYER_NAMES } from "@/types/prayer";

import { PrayerRow } from "./PrayerRow";

interface PrayerTimesListProps {
  prayerTimes: PrayerTimes;
}

function isPrayerPast(prayer: string, currentPeriod: PrayerTimeSlot | null): boolean {
  if (!currentPeriod) return false;
  const slotIndex = ALL_PRAYER_SLOTS.indexOf(prayer as PrayerTimeSlot);
  const currentIndex = ALL_PRAYER_SLOTS.indexOf(currentPeriod);
  return slotIndex >= 0 && slotIndex < currentIndex;
}

export function PrayerTimesList({ prayerTimes }: PrayerTimesListProps) {
  const t = useTranslations("home");
  const haptic = useHaptic();
  const today = getTodayDate();
  const currentPeriod = getCurrentPrayerPeriod(prayerTimes);
  const tracking = usePrayerTrackingStore();
  const prayedCount = tracking.getPrayedCount(today);

  return (
    <div className="animate-fade-in-up-1 mx-5 mt-4">
      {/* Section header with tracking progress */}
      <div className="mb-2.5 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-on-surface-muted">{t("today")}</h3>
        <span className="text-xs tabular-nums text-on-surface-muted">
          {t("prayersCompleted", { count: prayedCount, total: 5 })}
        </span>
      </div>

      {/* Prayer list card */}
      <div className="overflow-hidden rounded-2xl bg-on-surface/5 ring-1 ring-on-surface/10">
        {PRAYER_NAMES.map((prayer, i) => (
          <div key={prayer}>
            <PrayerRow
              prayer={prayer}
              time={prayerTimes[prayer]}
              isActive={currentPeriod === prayer}
              isPast={isPrayerPast(prayer, currentPeriod)}
              isPrayed={tracking.isPrayed(today, prayer)}
              isLast={false}
              onToggle={() => {
                tracking.togglePrayer(today, prayer);
                haptic.selectionChanged();
              }}
            />
            {/* Sunrise row between Fajr and Dhuhr */}
            {i === 0 && (
              <PrayerRow
                prayer="sunrise"
                time={prayerTimes.sunrise}
                isActive={currentPeriod === "sunrise"}
                isPast={isPrayerPast("sunrise", currentPeriod)}
                isPrayed={false}
                isLast={false}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
