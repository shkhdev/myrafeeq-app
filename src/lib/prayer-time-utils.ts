import type { PrayerTimes } from "@/types/prayer";

export type PrayerTimeSlot = "fajr" | "sunrise" | "dhuhr" | "asr" | "maghrib" | "isha";

export const ALL_PRAYER_SLOTS: readonly PrayerTimeSlot[] = [
  "fajr",
  "sunrise",
  "dhuhr",
  "asr",
  "maghrib",
  "isha",
];

/** Parse "HH:MM" string into minutes since midnight. */
function parseTimeToMinutes(time: string): number {
  const parts = time.split(":");
  const h = parts[0];
  const m = parts[1];
  if (h === undefined || m === undefined) return 0;
  return Number.parseInt(h, 10) * 60 + Number.parseInt(m, 10);
}

/** Get current minutes since midnight. */
function nowMinutes(): number {
  const now = new Date();
  return now.getHours() * 60 + now.getMinutes();
}

/** Returns the ordered list of prayer time slots with their times in minutes. */
function getOrderedSlots(times: PrayerTimes): { slot: PrayerTimeSlot; minutes: number }[] {
  return ALL_PRAYER_SLOTS.map((slot) => ({
    slot,
    minutes: parseTimeToMinutes(times[slot]),
  }));
}

/** Get the current prayer period (the most recent prayer that has started). */
export function getCurrentPrayerPeriod(times: PrayerTimes): PrayerTimeSlot | null {
  const now = nowMinutes();
  const ordered = getOrderedSlots(times);

  let current: PrayerTimeSlot | null = null;
  for (const { slot, minutes } of ordered) {
    if (now >= minutes) {
      current = slot;
    }
  }
  return current;
}

/** Get the next upcoming prayer (the first prayer whose time hasn't arrived yet). */
export function getNextPrayer(times: PrayerTimes): { name: PrayerTimeSlot; time: string } | null {
  const now = nowMinutes();
  const ordered = getOrderedSlots(times);

  for (const { slot, minutes } of ordered) {
    if (minutes > now) {
      return { name: slot, time: times[slot] };
    }
  }
  // All prayers have passed for today
  return null;
}

/** Calculate time remaining until a "HH:MM" string. Returns negative if time has passed. */
export function getMinutesUntil(timeStr: string): number {
  return parseTimeToMinutes(timeStr) - nowMinutes();
}

/** Format minutes into "Xh Ym" string. */
export function formatCountdown(totalMinutes: number): string {
  if (totalMinutes <= 0) return "0m";
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  if (hours > 0) return `${hours}h ${minutes}m`;
  return `${minutes}m`;
}

/** Format "HH:MM" (24h) to 12h format like "5:12 AM". */
export function formatTime12h(time: string): string {
  const parts = time.split(":");
  const h = parts[0];
  const m = parts[1];
  if (h === undefined || m === undefined) return time;
  let hour = Number.parseInt(h, 10);
  const period = hour >= 12 ? "PM" : "AM";
  if (hour === 0) hour = 12;
  else if (hour > 12) hour -= 12;
  return `${hour}:${m} ${period}`;
}

/** Get today's date as "YYYY-MM-DD". */
export function getTodayDate(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}
