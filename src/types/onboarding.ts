import type { City } from "./city";

export type OnboardingStep = "welcome" | "location" | "notifications" | "completion";

export type ReminderTiming = "on_time" | "5min" | "10min" | "15min" | "30min";

export const REMINDER_OPTIONS: readonly {
  value: ReminderTiming;
  labelKey: string;
  minutes?: string;
}[] = [
  { value: "on_time", labelKey: "atPrayerTime" },
  { value: "5min", labelKey: "minutesBefore", minutes: "5" },
  { value: "10min", labelKey: "minutesBefore", minutes: "10" },
  { value: "15min", labelKey: "minutesBefore", minutes: "15" },
  { value: "30min", labelKey: "minutesBefore", minutes: "30" },
];

export interface PrayerNotificationPrefs {
  fajr: boolean;
  dhuhr: boolean;
  asr: boolean;
  maghrib: boolean;
  isha: boolean;
}

export interface OnboardingData {
  city: City | null;
  latitude: number | null;
  longitude: number | null;
  notificationsEnabled: boolean;
  prayerNotifications: PrayerNotificationPrefs;
  reminderTiming: ReminderTiming;
}
