export interface PrayerTimes {
  fajr: string;
  sunrise: string;
  dhuhr: string;
  asr: string;
  maghrib: string;
  isha: string;
}

export type PrayerName = "fajr" | "dhuhr" | "asr" | "maghrib" | "isha";

export const PRAYER_NAMES = [
  "fajr",
  "dhuhr",
  "asr",
  "maghrib",
  "isha",
] as const satisfies readonly PrayerName[];

// ── Prayer Calculation Settings ──

export type CalculationMethodId =
  | "mwl"
  | "isna"
  | "egypt"
  | "karachi"
  | "umm_al_qura"
  | "dubai"
  | "qatar"
  | "kuwait"
  | "turkey"
  | "tehran"
  | "jakim"
  | "kemenag"
  | "singapore";

export interface CalculationMethod {
  id: CalculationMethodId;
  fajrAngle: number;
  ishaAngle: number | null;
  ishaMinutes: number | null;
}

export const CALCULATION_METHODS: readonly CalculationMethod[] = [
  { id: "mwl", fajrAngle: 18, ishaAngle: 17, ishaMinutes: null },
  { id: "isna", fajrAngle: 15, ishaAngle: 15, ishaMinutes: null },
  { id: "egypt", fajrAngle: 19.5, ishaAngle: 17.5, ishaMinutes: null },
  { id: "karachi", fajrAngle: 18, ishaAngle: 18, ishaMinutes: null },
  { id: "umm_al_qura", fajrAngle: 18.5, ishaAngle: null, ishaMinutes: 90 },
  { id: "dubai", fajrAngle: 18.2, ishaAngle: 18.2, ishaMinutes: null },
  { id: "qatar", fajrAngle: 18, ishaAngle: null, ishaMinutes: 90 },
  { id: "kuwait", fajrAngle: 18, ishaAngle: 17.5, ishaMinutes: null },
  { id: "turkey", fajrAngle: 18, ishaAngle: 17, ishaMinutes: null },
  { id: "tehran", fajrAngle: 17.7, ishaAngle: 14, ishaMinutes: null },
  { id: "jakim", fajrAngle: 20, ishaAngle: 18, ishaMinutes: null },
  { id: "kemenag", fajrAngle: 20, ishaAngle: 18, ishaMinutes: null },
  { id: "singapore", fajrAngle: 20, ishaAngle: 18, ishaMinutes: null },
] as const;

export type Madhab = "standard" | "hanafi";

export type HighLatitudeRule = "middle_of_night" | "one_seventh" | "angle_based";

export interface PrayerTimeAdjustments {
  fajr: number;
  sunrise: number;
  dhuhr: number;
  asr: number;
  maghrib: number;
  isha: number;
}

export const DEFAULT_ADJUSTMENTS: PrayerTimeAdjustments = {
  fajr: 0,
  sunrise: 0,
  dhuhr: 0,
  asr: 0,
  maghrib: 0,
  isha: 0,
};
