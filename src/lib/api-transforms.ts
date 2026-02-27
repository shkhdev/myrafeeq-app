import type { PrayerNotificationPrefs } from "@/types/onboarding";
import type { PrayerTimeAdjustments } from "@/types/prayer";

// ── Prayer keys ──

const PRAYER_KEYS_LOWER = ["fajr", "dhuhr", "asr", "maghrib", "isha"] as const;
const ADJUSTMENT_KEYS_LOWER = ["fajr", "sunrise", "dhuhr", "asr", "maghrib", "isha"] as const;

/** Convert API UPPERCASE prayer notification keys to internal lowercase. */
export function prayerNotificationsFromApi(raw: Record<string, boolean>): PrayerNotificationPrefs {
  const result: Record<string, boolean> = {};
  for (const key of PRAYER_KEYS_LOWER) {
    result[key] = raw[key.toUpperCase()] ?? raw[key] ?? true;
  }
  return result as unknown as PrayerNotificationPrefs;
}

/** Convert internal lowercase prayer notification keys to API UPPERCASE. */
export function prayerNotificationsToApi(prefs: PrayerNotificationPrefs): Record<string, boolean> {
  const result: Record<string, boolean> = {};
  for (const key of PRAYER_KEYS_LOWER) {
    result[key.toUpperCase()] = prefs[key];
  }
  return result;
}

/** Convert API UPPERCASE adjustment keys to internal lowercase. */
export function adjustmentsFromApi(raw: Record<string, number>): PrayerTimeAdjustments {
  const result: Record<string, number> = {};
  for (const key of ADJUSTMENT_KEYS_LOWER) {
    result[key] = raw[key.toUpperCase()] ?? raw[key] ?? 0;
  }
  return result as unknown as PrayerTimeAdjustments;
}

/** Convert internal lowercase adjustment keys to API UPPERCASE. */
export function adjustmentsToApi(adjustments: PrayerTimeAdjustments): Record<string, number> {
  const result: Record<string, number> = {};
  for (const key of ADJUSTMENT_KEYS_LOWER) {
    result[key.toUpperCase()] = adjustments[key];
  }
  return result;
}

/** Convert API UPPERCASE tracking keys to internal lowercase. */
export function trackingFromApi(
  raw: Record<string, Record<string, boolean>>,
): Record<string, Record<string, boolean>> {
  const result: Record<string, Record<string, boolean>> = {};
  for (const [date, prayers] of Object.entries(raw)) {
    const mapped: Record<string, boolean> = {};
    for (const [key, value] of Object.entries(prayers)) {
      mapped[key.toLowerCase()] = value;
    }
    result[date] = mapped;
  }
  return result;
}

/** Convert API UPPERCASE byPrayer stat keys to internal lowercase. */
export function byPrayerFromApi<T>(raw: Record<string, T>): Record<string, T> {
  const result: Record<string, T> = {};
  for (const [key, value] of Object.entries(raw)) {
    result[key.toLowerCase()] = value;
  }
  return result;
}

// ── Enum transforms ──

const MADHAB_FROM_API: Record<string, string> = { SHAFI: "shafi", HANAFI: "hanafi" };
const MADHAB_TO_API: Record<string, string> = { shafi: "SHAFI", hanafi: "HANAFI" };

export function madhabFromApi(value: string): string {
  return MADHAB_FROM_API[value] ?? value.toLowerCase();
}

export function madhabToApi(value: string): string {
  return MADHAB_TO_API[value] ?? value.toUpperCase();
}

export function enumFromApi(value: string): string {
  return value.toLowerCase().replace(/_/g, "_");
}

export function enumToApi(value: string): string {
  return value.toUpperCase();
}

export function themeFromApi(value: string): string {
  return value.toLowerCase();
}

export function themeToApi(value: string): string {
  return value.toUpperCase();
}
