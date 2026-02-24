"use client";

import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";

import { getGradientStyle, getGradientTextColor } from "@/lib/prayer-gradients";
import {
  formatTime12h,
  getCurrentPrayerPeriod,
  getMinutesUntil,
  getNextPrayer,
  type PrayerTimeSlot,
} from "@/lib/prayer-time-utils";
import { usePreferencesStore } from "@/stores/preferences-store";
import type { PrayerTimes } from "@/types/prayer";

interface PrayerHeroCardProps {
  prayerTimes: PrayerTimes;
}

interface HeroState {
  currentPeriod: PrayerTimeSlot | null;
  nextPrayer: { name: PrayerTimeSlot; time: string } | null;
  minutesUntilNext: number;
}

function computeHeroState(times: PrayerTimes): HeroState {
  const currentPeriod = getCurrentPrayerPeriod(times);
  const nextPrayer = getNextPrayer(times);
  const minutesUntilNext = nextPrayer ? getMinutesUntil(nextPrayer.time) : 0;
  return { currentPeriod, nextPrayer, minutesUntilNext };
}

export function PrayerHeroCard({ prayerTimes }: PrayerHeroCardProps) {
  const t = useTranslations("home");
  const tCommon = useTranslations("common");
  const timeFormat = usePreferencesStore((s) => s.timeFormat);
  const [state, setState] = useState(() => computeHeroState(prayerTimes));

  useEffect(() => {
    const interval = setInterval(() => {
      setState(computeHeroState(prayerTimes));
    }, 60_000);
    return () => clearInterval(interval);
  }, [prayerTimes]);

  const gradientSlot = state.currentPeriod ?? "isha";
  const textColor = getGradientTextColor();
  const formatTime = timeFormat === "12h" ? formatTime12h : (v: string) => v;

  function fmtCountdown(totalMinutes: number): string {
    if (totalMinutes <= 0) return t("timeUntilMinutes", { minutes: 0 });
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    if (hours > 0) return t("timeUntil", { hours, minutes });
    return t("timeUntilMinutes", { minutes });
  }

  // Current period is a trackable prayer (not sunrise)
  const isCurrentAPrayer = state.currentPeriod && state.currentPeriod !== "sunrise";
  const allDone = !state.nextPrayer && state.currentPeriod === "isha";

  return (
    <div
      className="animate-fade-in-up mx-5 mt-4 overflow-hidden rounded-2xl p-5 shadow-lg shadow-black/20"
      style={{
        background: getGradientStyle(gradientSlot),
        color: textColor,
        transition: "background 2s ease",
      }}
    >
      {allDone ? (
        <>
          <p className="text-sm font-medium opacity-80">{t("activePrayer")}</p>
          <p className="mt-1 text-2xl font-bold">
            {tCommon("isha")} — {formatTime(prayerTimes.isha)}
          </p>
          <p className="mt-2 text-sm opacity-70">
            {t("nextPrayer")}: {tCommon("fajr")}
            {" · "}
            {t("inTime", { time: fmtCountdown(getMinutesUntil(prayerTimes.fajr) + 24 * 60) })}
          </p>
        </>
      ) : isCurrentAPrayer && state.currentPeriod && state.nextPrayer ? (
        <>
          <p className="text-sm font-medium opacity-80">{t("activePrayer")}</p>
          <p className="mt-1 text-2xl font-bold">
            {tCommon(state.currentPeriod)} — {formatTime(prayerTimes[state.currentPeriod])}
          </p>
          <p className="mt-2 text-sm opacity-70">
            {t("nextPrayer")}: {tCommon(state.nextPrayer.name)} {formatTime(state.nextPrayer.time)}
            {state.minutesUntilNext > 0 &&
              ` · ${t("inTime", { time: fmtCountdown(state.minutesUntilNext) })}`}
          </p>
        </>
      ) : state.nextPrayer ? (
        <>
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium opacity-80">{t("nextPrayer")}</p>
            {state.minutesUntilNext > 0 && (
              <p className="text-sm font-medium opacity-80">
                {t("inTime", { time: fmtCountdown(state.minutesUntilNext) })}
              </p>
            )}
          </div>
          <p className="mt-1 text-2xl font-bold">
            {tCommon(state.nextPrayer.name)} — {formatTime(state.nextPrayer.time)}
          </p>
        </>
      ) : (
        <>
          <p className="text-sm font-medium opacity-80">{t("nextPrayer")}</p>
          <p className="mt-1 text-2xl font-bold">
            {tCommon("fajr")} — {formatTime(prayerTimes.fajr)}
          </p>
        </>
      )}
    </div>
  );
}
