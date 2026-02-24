import { useCallback } from "react";
import { useTranslations } from "use-intl";

import { BackArrow } from "@/components/ui/BackArrow";
import { ToggleSwitch } from "@/components/ui/ToggleSwitch";
import { usePrayerTimesByLocation } from "@/hooks/api/usePrayerTimes";
import { useBackButton } from "@/hooks/useBackButton";
import { useHaptic } from "@/hooks/useHaptic";
import { useIsTelegram } from "@/hooks/useIsTelegram";
import { useMainButton } from "@/hooks/useMainButton";
import { getSDK } from "@/hooks/useTelegramSDK";
import { getPrayerIcon } from "@/lib/prayer-icons";
import { useOnboardingStore } from "@/stores/onboarding-store";
import type { ReminderTiming } from "@/types/onboarding";
import type { PrayerName } from "@/types/prayer";
import { PRAYER_NAMES } from "@/types/prayer";
import { StepIndicator } from "./StepIndicator";

const REMINDER_OPTIONS: { value: ReminderTiming; labelKey: string; minutes?: string }[] = [
  { value: "on_time", labelKey: "atPrayerTime" },
  { value: "5min", labelKey: "minutesBefore", minutes: "5" },
  { value: "10min", labelKey: "minutesBefore", minutes: "10" },
  { value: "15min", labelKey: "minutesBefore", minutes: "15" },
  { value: "30min", labelKey: "minutesBefore", minutes: "30" },
];

export function NotificationSetup() {
  const t = useTranslations("onboarding.notifications");
  const store = useOnboardingStore();
  const haptic = useHaptic();
  const isTelegram = useIsTelegram();
  const { prayerNotifications, reminderTiming } = store.data;

  const selectedCity = store.data.city;
  const prayerTimesOptions: { enabled: boolean; timezone?: string; method?: string } = {
    enabled: selectedCity !== null,
  };
  if (selectedCity?.timezone) prayerTimesOptions.timezone = selectedCity.timezone;
  if (selectedCity?.defaultMethod) prayerTimesOptions.method = selectedCity.defaultMethod;

  const prayerTimesQuery = usePrayerTimesByLocation(
    store.data.latitude ?? selectedCity?.latitude ?? 0,
    store.data.longitude ?? selectedCity?.longitude ?? 0,
    prayerTimesOptions,
  );
  const prayerTimes = prayerTimesQuery.data?.times ?? null;

  const handlePrayerToggle = useCallback(
    (prayer: PrayerName) => {
      store.setPrayerNotification(prayer, !prayerNotifications[prayer]);
      haptic.selectionChanged();
    },
    [prayerNotifications, store, haptic],
  );

  const handleTimingSelect = useCallback(
    (timing: ReminderTiming) => {
      store.setReminderTiming(timing);
      haptic.selectionChanged();
    },
    [store, haptic],
  );

  const handleEnable = useCallback(async () => {
    store.setNotificationsEnabled(true);
    try {
      const sdk = await getSDK();
      if (sdk.requestWriteAccess.isAvailable()) {
        await sdk.requestWriteAccess();
      }
    } catch {
      // Proceed even if declined
    }
    store.setStep("completion");
  }, [store]);

  const handleSkipNotifications = useCallback(() => {
    store.setNotificationsEnabled(false);
    store.setStep("completion");
  }, [store]);

  const handleBack = useCallback(() => {
    store.setStep("location");
  }, [store]);

  useBackButton(handleBack);

  useMainButton({
    text: t("enableReminders"),
    isVisible: true,
    onClick: handleEnable,
  });

  return (
    <div
      className="flex flex-col bg-surface"
      style={{ minHeight: "var(--tg-viewport-stable-height, 100dvh)" }}
    >
      {/* Top bar: back + step indicator */}
      <div
        className="flex items-center justify-between px-3"
        style={{ paddingTop: "calc(var(--safe-top, 0px) + 0.5rem)" }}
      >
        <BackArrow onClick={handleBack} />
        <StepIndicator current={3} total={4} />
        <div className="w-11" />
      </div>

      {/* Compact header — no icon, minimal spacing */}
      <div className="animate-fade-in-up px-6 pt-3">
        <h2 className="text-lg font-bold tracking-tight text-on-surface">{t("title")}</h2>
        <p className="mt-1 text-sm leading-relaxed text-on-surface-muted">{t("description")}</p>
      </div>

      {/* Prayer toggles */}
      <div className="animate-fade-in-up-1 mx-6 mt-4 overflow-hidden rounded-2xl bg-on-surface/5 ring-1 ring-on-surface/10">
        {PRAYER_NAMES.map((prayer, i) => {
          const Icon = getPrayerIcon(prayer);
          return (
            <button
              key={prayer}
              type="button"
              onClick={() => handlePrayerToggle(prayer)}
              className={`flex h-[52px] w-full items-center justify-between px-4 transition-colors hover:bg-on-surface/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-on-surface/30 ${
                i < PRAYER_NAMES.length - 1 ? "border-b border-on-surface/5" : ""
              }`}
              aria-label={`${t(prayer)} ${prayerNotifications[prayer] ? "enabled" : "disabled"}`}
            >
              <span className="flex items-center gap-3">
                <Icon size={32} />
                <span className="text-[15px] font-medium text-on-surface">{t(prayer)}</span>
              </span>
              <span className="flex items-center gap-3">
                {prayerTimes && (
                  <span className="text-xs tabular-nums text-on-surface-muted/70">
                    {prayerTimes[prayer]}
                  </span>
                )}
                <ToggleSwitch checked={prayerNotifications[prayer]} />
              </span>
            </button>
          );
        })}
      </div>

      {/* Reminder timing — horizontal scroll */}
      <div className="animate-fade-in-up-2 mt-4 ps-6">
        <h3 className="mb-2.5 text-sm font-semibold text-on-surface-muted">
          {t("reminderTiming")}
        </h3>
        <div className="no-scrollbar flex gap-2 overflow-x-auto pe-6">
          {REMINDER_OPTIONS.map((option) => {
            const isSelected = reminderTiming === option.value;
            return (
              <button
                key={option.value}
                type="button"
                onClick={() => handleTimingSelect(option.value)}
                className={`shrink-0 rounded-full px-3.5 py-2 text-xs font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-on-surface/30 ${
                  isSelected
                    ? "bg-primary/20 text-primary ring-1 ring-primary/30"
                    : "bg-on-surface/5 text-on-surface-muted hover:bg-on-surface/10"
                }`}
              >
                {option.minutes
                  ? t("minutesBefore", { minutes: option.minutes })
                  : t("atPrayerTime")}
              </button>
            );
          })}
        </div>
      </div>

      {/* Bottom buttons — safe area padding (primary hidden inside Telegram where Main Button is used) */}
      <div
        className="mt-auto flex flex-col gap-3 px-6 pt-6"
        style={{ paddingBottom: "calc(var(--safe-bottom, 0px) + 2rem)" }}
      >
        {!isTelegram && (
          <button
            type="button"
            onClick={handleEnable}
            className="flex h-14 items-center justify-center rounded-2xl bg-primary text-base font-semibold text-on-primary transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
          >
            {t("enableReminders")}
          </button>
        )}
        <button
          type="button"
          onClick={handleSkipNotifications}
          className="flex h-11 items-center justify-center rounded-xl text-sm font-medium text-on-surface-muted transition-colors hover:text-on-surface/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-on-surface/30"
        >
          {t("maybeLater")}
        </button>
      </div>
    </div>
  );
}
