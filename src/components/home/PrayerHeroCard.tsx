"use client";

import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";

import { getGradientStyle, getGradientTextColor } from "@/lib/prayer-gradients";
import {
  formatCountdown,
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
  countdown: string;
}

function computeHeroState(times: PrayerTimes): HeroState {
  const currentPeriod = getCurrentPrayerPeriod(times);
  const nextPrayer = getNextPrayer(times);
  const countdown = nextPrayer ? formatCountdown(getMinutesUntil(nextPrayer.time)) : "";
  return { currentPeriod, nextPrayer, countdown };
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
  const formatTime = timeFormat === "12h" ? formatTime12h : (t: string) => t;

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
          <p className="text-sm font-medium opacity-80">{t("allPrayersCompleted")}</p>
          <p className="mt-1 text-2xl font-bold">
            {tCommon("isha")} — {formatTime(prayerTimes.isha)}
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
            {state.countdown && ` · ${t("inTime", { time: state.countdown })}`}
          </p>
        </>
      ) : state.nextPrayer ? (
        <>
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium opacity-80">{t("nextPrayer")}</p>
            {state.countdown && (
              <p className="text-sm font-medium opacity-80">
                {t("inTime", { time: state.countdown })}
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
          <p className="mt-2 text-sm opacity-70">{t("allPrayersCompleted")}</p>
        </>
      )}
    </div>
  );
}
