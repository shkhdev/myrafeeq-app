import { useTranslations } from "use-intl";

import { BackArrow } from "@/components/ui/BackArrow";
import { Button } from "@/components/ui/Button";
import { ScreenLayout } from "@/components/ui/ScreenLayout";
import { ToggleSwitch } from "@/components/ui/ToggleSwitch";
import { TopBar } from "@/components/ui/TopBar";
import { usePrayerTimesByLocation } from "@/hooks/api/usePrayerTimes";
import { useHaptic } from "@/hooks/useHaptic";
import { getSDK } from "@/hooks/useTelegramSDK";
import { getPrayerIcon } from "@/lib/prayer-icons";
import { useOnboardingStore } from "@/stores/onboarding-store";
import type { ReminderTiming } from "@/types/onboarding";
import { REMINDER_OPTIONS } from "@/types/onboarding";
import type { PrayerName } from "@/types/prayer";
import { PRAYER_NAMES } from "@/types/prayer";
import { StepIndicator } from "./StepIndicator";

export function NotificationSetup() {
  const t = useTranslations("onboarding.notifications");
  const haptic = useHaptic();

  const selectedCity = useOnboardingStore((s) => s.data.city);
  const latitude = useOnboardingStore((s) => s.data.latitude);
  const longitude = useOnboardingStore((s) => s.data.longitude);
  const prayerNotifications = useOnboardingStore((s) => s.data.prayerNotifications);
  const reminderTiming = useOnboardingStore((s) => s.data.reminderTiming);
  const setPrayerNotification = useOnboardingStore((s) => s.setPrayerNotification);
  const setReminderTiming = useOnboardingStore((s) => s.setReminderTiming);
  const setNotificationsEnabled = useOnboardingStore((s) => s.setNotificationsEnabled);
  const setStep = useOnboardingStore((s) => s.setStep);

  const prayerTimesOptions: { enabled: boolean; timezone?: string; method?: string } = {
    enabled: selectedCity !== null,
  };
  if (selectedCity?.timezone) prayerTimesOptions.timezone = selectedCity.timezone;
  if (selectedCity?.defaultMethod) prayerTimesOptions.method = selectedCity.defaultMethod;

  const prayerTimesQuery = usePrayerTimesByLocation(
    latitude ?? selectedCity?.latitude ?? 0,
    longitude ?? selectedCity?.longitude ?? 0,
    prayerTimesOptions,
  );
  const prayerTimes = prayerTimesQuery.data?.times ?? null;

  function handlePrayerToggle(prayer: PrayerName) {
    setPrayerNotification(prayer, !prayerNotifications[prayer]);
    haptic.selectionChanged();
  }

  function handleTimingSelect(timing: ReminderTiming) {
    setReminderTiming(timing);
    haptic.selectionChanged();
  }

  async function handleEnable() {
    setNotificationsEnabled(true);
    try {
      const sdk = await getSDK();
      if (sdk.requestWriteAccess.isAvailable()) {
        await sdk.requestWriteAccess();
      }
    } catch {
      // Proceed even if declined
    }
    setStep("completion");
  }

  function handleSkipNotifications() {
    setNotificationsEnabled(false);
    setStep("completion");
  }

  function handleBack() {
    setStep("location");
  }

  return (
    <ScreenLayout>
      <TopBar
        left={<BackArrow onClick={handleBack} />}
        center={<StepIndicator current={3} total={4} />}
      />

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

      {/* Bottom buttons — safe area padding */}
      <div
        className="mt-auto flex flex-col gap-3 px-6 pt-6"
        style={{ paddingBottom: "calc(var(--safe-bottom, 0px) + 2rem)" }}
      >
        <Button onClick={handleEnable} className="w-full">
          {t("enableReminders")}
        </Button>
        <Button variant="ghost" size="sm" onClick={handleSkipNotifications} className="w-full">
          {t("maybeLater")}
        </Button>
      </div>
    </ScreenLayout>
  );
}
