import { create } from "zustand";
import { persist } from "zustand/middleware";

import type { City } from "@/types/city";
import type { PrayerNotificationPrefs, ReminderTiming } from "@/types/onboarding";
import type {
  CalculationMethodId,
  HighLatitudeRule,
  Madhab,
  PrayerName,
  PrayerTimeAdjustments,
} from "@/types/prayer";
import { DEFAULT_ADJUSTMENTS } from "@/types/prayer";

interface PreferencesState {
  // Location
  city: City | null;
  latitude: number | null;
  longitude: number | null;
  // Notifications
  notificationsEnabled: boolean;
  prayerNotifications: PrayerNotificationPrefs;
  reminderTiming: ReminderTiming;
  // Appearance
  timeFormat: "12h" | "24h";
  // Prayer calculation
  calculationMethod: CalculationMethodId;
  madhab: Madhab;
  highLatitudeRule: HighLatitudeRule;
  hijriCorrection: number;
  adjustments: PrayerTimeAdjustments;
  // Actions — Location
  setCity: (city: City, latitude?: number | undefined, longitude?: number | undefined) => void;
  // Actions — Notifications
  setNotificationsEnabled: (enabled: boolean) => void;
  setPrayerNotification: (prayer: PrayerName, enabled: boolean) => void;
  setAllPrayerNotifications: (enabled: boolean) => void;
  setReminderTiming: (timing: ReminderTiming) => void;
  // Actions — Appearance
  setTimeFormat: (format: "12h" | "24h") => void;
  // Actions — Prayer calculation
  setCalculationMethod: (method: CalculationMethodId) => void;
  setMadhab: (madhab: Madhab) => void;
  setHighLatitudeRule: (rule: HighLatitudeRule) => void;
  setHijriCorrection: (correction: number) => void;
  setAdjustment: (prayer: keyof PrayerTimeAdjustments, minutes: number) => void;
  resetAdjustments: () => void;
}

export const usePreferencesStore = create<PreferencesState>()(
  persist(
    (set) => ({
      // Location
      city: null,
      latitude: null,
      longitude: null,
      // Notifications
      notificationsEnabled: true,
      prayerNotifications: {
        fajr: true,
        dhuhr: true,
        asr: true,
        maghrib: true,
        isha: true,
      },
      reminderTiming: "on_time",
      // Appearance
      timeFormat: "12h",
      // Prayer calculation
      calculationMethod: "mwl",
      madhab: "standard",
      highLatitudeRule: "angle_based",
      hijriCorrection: 0,
      adjustments: { ...DEFAULT_ADJUSTMENTS },
      // Actions — Location
      setCity: (city, latitude, longitude) =>
        set({
          city,
          latitude: latitude ?? city.latitude,
          longitude: longitude ?? city.longitude,
        }),
      // Actions — Notifications
      setNotificationsEnabled: (enabled) => set({ notificationsEnabled: enabled }),
      setPrayerNotification: (prayer, enabled) =>
        set((state) => ({
          prayerNotifications: {
            ...state.prayerNotifications,
            [prayer]: enabled,
          },
        })),
      setAllPrayerNotifications: (enabled) =>
        set({
          prayerNotifications: {
            fajr: enabled,
            dhuhr: enabled,
            asr: enabled,
            maghrib: enabled,
            isha: enabled,
          },
        }),
      setReminderTiming: (timing) => set({ reminderTiming: timing }),
      // Actions — Appearance
      setTimeFormat: (format) => set({ timeFormat: format }),
      // Actions — Prayer calculation
      setCalculationMethod: (method) => set({ calculationMethod: method }),
      setMadhab: (madhab) => set({ madhab }),
      setHighLatitudeRule: (rule) => set({ highLatitudeRule: rule }),
      setHijriCorrection: (correction) => set({ hijriCorrection: correction }),
      setAdjustment: (prayer, minutes) =>
        set((state) => ({
          adjustments: {
            ...state.adjustments,
            [prayer]: Math.max(-30, Math.min(30, minutes)),
          },
        })),
      resetAdjustments: () => set({ adjustments: { ...DEFAULT_ADJUSTMENTS } }),
    }),
    { name: "myrafeeq-preferences" },
  ),
);
