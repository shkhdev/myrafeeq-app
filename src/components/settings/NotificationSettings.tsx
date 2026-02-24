import { useTranslations } from "use-intl";

import { ToggleSwitch } from "@/components/ui/ToggleSwitch";
import { usePrayerTimes } from "@/hooks/api/usePrayerTimes";
import { useHaptic } from "@/hooks/useHaptic";
import { getPrayerIcon } from "@/lib/prayer-icons";
import { formatTime12h } from "@/lib/prayer-time-utils";
import { usePreferencesStore } from "@/stores/preferences-store";
import type { ReminderTiming } from "@/types/onboarding";
import type { PrayerName } from "@/types/prayer";
import { PRAYER_NAMES } from "@/types/prayer";

import { SettingsSection } from "./SettingsSection";

const REMINDER_OPTIONS: { value: ReminderTiming; labelKey: string; minutes?: string }[] = [
  { value: "on_time", labelKey: "atPrayerTime" },
  { value: "5min", labelKey: "minutesBefore", minutes: "5" },
  { value: "10min", labelKey: "minutesBefore", minutes: "10" },
  { value: "15min", labelKey: "minutesBefore", minutes: "15" },
  { value: "30min", labelKey: "minutesBefore", minutes: "30" },
];

export function NotificationSettings() {
  const t = useTranslations("settings");
  const tCommon = useTranslations("common");
  const haptic = useHaptic();
  const prayerNotifications = usePreferencesStore((s) => s.prayerNotifications);
  const reminderTiming = usePreferencesStore((s) => s.reminderTiming);
  const setPrayerNotification = usePreferencesStore((s) => s.setPrayerNotification);
  const setAllPrayerNotifications = usePreferencesStore((s) => s.setAllPrayerNotifications);
  const setReminderTiming = usePreferencesStore((s) => s.setReminderTiming);
  const timeFormat = usePreferencesStore((s) => s.timeFormat);

  const { data: prayerTimesData } = usePrayerTimes();
  const prayerTimes = prayerTimesData?.[0]?.times ?? null;
  const allEnabled = PRAYER_NAMES.every((p) => prayerNotifications[p]);
  const formatTime = timeFormat === "12h" ? formatTime12h : (t: string) => t;

  const handleToggleAll = () => {
    setAllPrayerNotifications(!allEnabled);
    haptic.selectionChanged();
  };

  const handleTogglePrayer = (prayer: PrayerName) => {
    setPrayerNotification(prayer, !prayerNotifications[prayer]);
    haptic.selectionChanged();
  };

  const handleTimingSelect = (timing: ReminderTiming) => {
    setReminderTiming(timing);
    haptic.selectionChanged();
  };

  return (
    <>
      <SettingsSection title={t("notifications")}>
        {/* All Prayers master toggle */}
        <button
          type="button"
          onClick={handleToggleAll}
          className="flex h-[52px] w-full items-center justify-between border-b border-on-surface/5 px-4 transition-colors hover:bg-on-surface/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-on-surface/30"
        >
          <span className="text-[15px] font-semibold text-on-surface">{t("allPrayers")}</span>
          <ToggleSwitch checked={allEnabled} />
        </button>

        {/* Per-prayer toggles */}
        {PRAYER_NAMES.map((prayer, i) => {
          const Icon = getPrayerIcon(prayer);
          return (
            <button
              key={prayer}
              type="button"
              onClick={() => handleTogglePrayer(prayer)}
              className={`flex h-[52px] w-full items-center justify-between px-4 transition-colors hover:bg-on-surface/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-on-surface/30 ${
                i < PRAYER_NAMES.length - 1 ? "border-b border-on-surface/5" : ""
              }`}
            >
              <span className="flex items-center gap-3">
                <Icon size={32} />
                <span className="text-[15px] font-medium text-on-surface">{tCommon(prayer)}</span>
              </span>
              <span className="flex items-center gap-3">
                {prayerTimes && (
                  <span className="text-xs tabular-nums text-on-surface-muted/70">
                    {formatTime(prayerTimes[prayer])}
                  </span>
                )}
                <ToggleSwitch checked={prayerNotifications[prayer]} />
              </span>
            </button>
          );
        })}
      </SettingsSection>

      {/* Reminder timing chips */}
      <div className="mt-4 ps-5">
        <h3 className="mb-2.5 text-sm font-semibold text-on-surface-muted">
          {t("reminderTiming")}
        </h3>
        <div className="no-scrollbar flex gap-2 overflow-x-auto pe-5">
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
    </>
  );
}
