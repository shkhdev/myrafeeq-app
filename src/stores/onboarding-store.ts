import { create } from "zustand";

import type { City } from "@/types/city";
import type { OnboardingData, OnboardingStep, ReminderTiming } from "@/types/onboarding";
import type { PrayerName } from "@/types/prayer";

interface OnboardingState {
  currentStep: OnboardingStep;
  storyCardIndex: number;
  isComplete: boolean;
  data: OnboardingData;
  setStep: (step: OnboardingStep) => void;
  setStoryCardIndex: (index: number) => void;
  setCity: (city: City, latitude?: number | undefined, longitude?: number | undefined) => void;
  setNotificationsEnabled: (enabled: boolean) => void;
  setPrayerNotification: (prayer: PrayerName, enabled: boolean) => void;
  setAllPrayerNotifications: (enabled: boolean) => void;
  setReminderTiming: (timing: ReminderTiming) => void;
  completeOnboarding: () => void;
}

export const useOnboardingStore = create<OnboardingState>()((set) => ({
  currentStep: "welcome",
  storyCardIndex: 0,
  isComplete: false,
  data: {
    city: null,
    latitude: null,
    longitude: null,
    notificationsEnabled: true,
    prayerNotifications: {
      fajr: true,
      dhuhr: true,
      asr: true,
      maghrib: true,
      isha: true,
    },
    reminderTiming: "on_time",
  },
  setStep: (step) =>
    set({ currentStep: step, ...(step === "welcome" ? { storyCardIndex: 0 } : {}) }),
  setStoryCardIndex: (index) => set({ storyCardIndex: index }),
  setCity: (city, latitude, longitude) =>
    set((state) => ({
      data: {
        ...state.data,
        city,
        latitude: latitude ?? city.latitude,
        longitude: longitude ?? city.longitude,
      },
    })),
  setNotificationsEnabled: (enabled) =>
    set((state) => ({
      data: { ...state.data, notificationsEnabled: enabled },
    })),
  setPrayerNotification: (prayer, enabled) =>
    set((state) => ({
      data: {
        ...state.data,
        prayerNotifications: {
          ...state.data.prayerNotifications,
          [prayer]: enabled,
        },
      },
    })),
  setAllPrayerNotifications: (enabled) =>
    set((state) => ({
      data: {
        ...state.data,
        prayerNotifications: {
          fajr: enabled,
          dhuhr: enabled,
          asr: enabled,
          maghrib: enabled,
          isha: enabled,
        },
      },
    })),
  setReminderTiming: (timing) =>
    set((state) => ({
      data: { ...state.data, reminderTiming: timing },
    })),
  completeOnboarding: () => set({ isComplete: true }),
}));
