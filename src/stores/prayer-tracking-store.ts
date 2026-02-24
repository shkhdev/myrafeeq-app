import { create } from "zustand";

import type { PrayerName } from "@/types/prayer";

interface PrayerTrackingState {
  /** date string "YYYY-MM-DD" → array of prayed prayer names */
  tracked: Record<string, PrayerName[]>;
  togglePrayer: (date: string, prayer: PrayerName) => void;
  isPrayed: (date: string, prayer: PrayerName) => boolean;
  getPrayedCount: (date: string) => number;
}

export const usePrayerTrackingStore = create<PrayerTrackingState>()((set, get) => ({
  tracked: {},
  togglePrayer: (date, prayer) =>
    set((state) => {
      const current = state.tracked[date] ?? [];
      const exists = current.includes(prayer);
      return {
        tracked: {
          ...state.tracked,
          [date]: exists ? current.filter((p) => p !== prayer) : [...current, prayer],
        },
      };
    }),
  isPrayed: (date, prayer) => {
    const current = get().tracked[date];
    return current ? current.includes(prayer) : false;
  },
  getPrayedCount: (date) => {
    const current = get().tracked[date];
    return current ? current.length : 0;
  },
}));
