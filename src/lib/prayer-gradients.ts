import type { PrayerTimeSlot } from "./prayer-time-utils";

interface PrayerGradient {
  from: string;
  via: string;
  to: string;
}

const PRAYER_GRADIENTS: Record<PrayerTimeSlot, PrayerGradient> = {
  fajr: {
    from: "#1a1040",
    via: "#4a2060",
    to: "#d4845a",
  },
  sunrise: {
    from: "#d4845a",
    via: "#e8a96a",
    to: "#f5d485",
  },
  dhuhr: {
    from: "#4a90d9",
    via: "#6aaff0",
    to: "#a8d8ff",
  },
  asr: {
    from: "#d4945a",
    via: "#e0a860",
    to: "#c8804a",
  },
  maghrib: {
    from: "#d45a5a",
    via: "#c04a7a",
    to: "#5a2870",
  },
  isha: {
    from: "#0a0e2a",
    via: "#141850",
    to: "#1a1040",
  },
};

export function getGradientStyle(slot: PrayerTimeSlot): string {
  const g = PRAYER_GRADIENTS[slot];
  return `linear-gradient(135deg, ${g.from}, ${g.via}, ${g.to})`;
}

/** Returns white or near-white text color — all prayer gradients are dark enough for white text. */
export function getGradientTextColor(): string {
  return "#ffffff";
}
