import { z } from "zod/v4";
import type { City } from "@/types/city";

// ── City ──
// Use z.transform to strip undefined keys so that `exactOptionalPropertyTypes`
// in TS is satisfied (absent key vs key-with-undefined).

const CitySchema = z
  .object({
    id: z.string(),
    name: z.string(),
    country: z.string(),
    latitude: z.number(),
    longitude: z.number(),
    timezone: z.string().optional(),
    defaultMethod: z.string().optional(),
    defaultMadhab: z.string().optional(),
  })
  .transform((c): City => {
    const city: City = {
      id: c.id,
      name: c.name,
      country: c.country,
      latitude: c.latitude,
      longitude: c.longitude,
    };
    if (c.timezone !== undefined) city.timezone = c.timezone;
    if (c.defaultMethod !== undefined) city.defaultMethod = c.defaultMethod;
    if (c.defaultMadhab !== undefined) city.defaultMadhab = c.defaultMadhab;
    return city;
  });

// ── Auth ──

export const AuthResponseSchema = z.object({
  token: z.string(),
  user: z.object({
    telegramId: z.number(),
    firstName: z.string(),
    languageCode: z.string(),
    onboardingCompleted: z.boolean(),
  }),
});

// ── Preferences ──

const PrayerNotificationPrefsSchema = z.object({
  fajr: z.boolean(),
  dhuhr: z.boolean(),
  asr: z.boolean(),
  maghrib: z.boolean(),
  isha: z.boolean(),
});

const PrayerTimeAdjustmentsSchema = z.object({
  fajr: z.number(),
  sunrise: z.number(),
  dhuhr: z.number(),
  asr: z.number(),
  maghrib: z.number(),
  isha: z.number(),
});

export const UserPreferencesResponseSchema = z.object({
  city: CitySchema.nullable(),
  calculationMethod: z.string(),
  madhab: z.string(),
  highLatitudeRule: z.string(),
  hijriCorrection: z.number(),
  timeFormat: z.enum(["12h", "24h"]),
  theme: z.enum(["light", "dark", "system"]),
  notificationsEnabled: z.boolean(),
  reminderTiming: z.string(),
  prayerNotifications: PrayerNotificationPrefsSchema,
  manualAdjustments: PrayerTimeAdjustmentsSchema,
});

export const OnboardingResponseSchema = z.object({
  user: AuthResponseSchema.shape.user,
  preferences: UserPreferencesResponseSchema,
});

// ── Prayer Times ──

const PrayerTimesSchema = z.object({
  fajr: z.string(),
  sunrise: z.string(),
  dhuhr: z.string(),
  asr: z.string(),
  maghrib: z.string(),
  isha: z.string(),
});

export const PrayerTimesResponseSchema = z.object({
  date: z.string(),
  hijriDate: z.string(),
  city: z.string(),
  times: PrayerTimesSchema,
  meta: z.object({
    calculationMethod: z.string(),
    madhab: z.string(),
    adjustments: z.record(z.string(), z.number()),
  }),
});

// ── Prayer Tracking ──

export const PrayerTrackingResponseSchema = z.object({
  tracking: z.record(z.string(), z.record(z.string(), z.boolean())),
});

export const TogglePrayerResponseSchema = z.object({
  date: z.string(),
  prayer: z.string(),
  prayed: z.boolean(),
  toggledAt: z.string(),
});

export const PrayerStatsResponseSchema = z.object({
  period: z.string(),
  from: z.string(),
  to: z.string(),
  total: z.number(),
  completed: z.number(),
  percentage: z.number(),
  byPrayer: z.record(z.string(), z.object({ total: z.number(), completed: z.number() })),
  streak: z.number(),
});

// ── Cities ──

export const CitySearchResponseSchema = z.object({
  cities: z.array(CitySchema),
});

export const NearestCityResponseSchema = z.object({
  city: CitySchema,
  distanceKm: z.number(),
});
