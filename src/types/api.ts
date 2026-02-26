import type { City } from "@/types/city";
import type { PrayerNotificationPrefs, ReminderTiming } from "@/types/onboarding";
import type {
  CalculationMethodId,
  HighLatitudeRule,
  Madhab,
  PrayerTimeAdjustments,
  PrayerTimes,
} from "@/types/prayer";

// Auth
export interface AuthResponse {
  token: string;
  user: UserResponse;
}

export interface UserResponse {
  telegramId: number;
  firstName: string;
  languageCode: string;
  onboardingCompleted: boolean;
}

// Preferences
export interface UserPreferencesResponse {
  city: City | null;
  calculationMethod: CalculationMethodId;
  madhab: Madhab;
  highLatitudeRule: HighLatitudeRule;
  hijriCorrection: number;
  timeFormat: "12h" | "24h";
  theme: "light" | "dark" | "system";
  notificationsEnabled: boolean;
  reminderTiming: ReminderTiming;
  prayerNotifications: PrayerNotificationPrefs;
  manualAdjustments: PrayerTimeAdjustments;
}

export interface UpdatePreferencesRequest {
  cityId?: string;
  calculationMethod?: string;
  madhab?: string;
  highLatitudeRule?: string;
  hijriCorrection?: number;
  timeFormat?: string;
  theme?: string;
  notificationsEnabled?: boolean;
  reminderTiming?: string;
  prayerNotifications?: PrayerNotificationPrefs;
  manualAdjustments?: PrayerTimeAdjustments;
}

export interface OnboardingRequest {
  cityId: string;
  latitude: number;
  longitude: number;
  notificationsEnabled: boolean;
  prayerNotifications: PrayerNotificationPrefs;
  reminderTiming: string;
}

export interface OnboardingResponse {
  user: UserResponse;
  preferences: UserPreferencesResponse;
}

// Prayer Times
export interface PrayerTimesMeta {
  calculationMethod: string;
  madhab: string;
  adjustments: Record<string, number>;
}

export interface PrayerTimesResponse {
  date: string;
  hijriDate: string;
  city: string;
  times: PrayerTimes;
  meta: PrayerTimesMeta;
}

// Prayer Tracking
export interface PrayerTrackingResponse {
  tracking: Record<string, Record<string, boolean>>;
}

export interface TogglePrayerRequest {
  date: string;
  prayer: string;
  prayed: boolean;
}

export interface TogglePrayerResponse {
  date: string;
  prayer: string;
  prayed: boolean;
  toggledAt: string;
}

export interface PrayerStatDetail {
  total: number;
  completed: number;
}

export interface PrayerStatsResponse {
  period: string;
  from: string;
  to: string;
  total: number;
  completed: number;
  percentage: number;
  byPrayer: Record<string, PrayerStatDetail>;
  streak: number;
}

// Cities
export interface CitySearchResponse {
  cities: City[];
}

export interface NearestCityResponse {
  city: City;
  distanceKm: number;
}

// Error
export interface ApiErrorResponse {
  error: {
    code: string;
    message: string;
  };
}
