import type { City } from "./city";

export type OnboardingStep = "welcome" | "location" | "notifications" | "completion";

export type ReminderTiming = "on_time" | "5min" | "10min" | "15min" | "30min";

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
