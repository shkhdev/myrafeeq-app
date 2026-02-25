import type { City } from "./city";

export type OnboardingStep = "welcome" | "location" | "notifications" | "completion";

export type ReminderTiming = "ON_TIME" | "FIVE_MIN" | "TEN_MIN" | "FIFTEEN_MIN" | "THIRTY_MIN";

export const REMINDER_OPTIONS: readonly {
  value: ReminderTiming;
  labelKey: string;
  minutes?: string;
}[] = [
  { value: "ON_TIME", labelKey: "atPrayerTime" },
  { value: "FIVE_MIN", labelKey: "minutesBefore", minutes: "5" },
  { value: "TEN_MIN", labelKey: "minutesBefore", minutes: "10" },
  { value: "FIFTEEN_MIN", labelKey: "minutesBefore", minutes: "15" },
  { value: "THIRTY_MIN", labelKey: "minutesBefore", minutes: "30" },
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
