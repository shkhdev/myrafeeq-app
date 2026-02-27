import { z } from "zod/v4";
import {
  adjustmentsFromApi,
  byPrayerFromApi,
  madhabFromApi,
  prayerNotificationsFromApi,
  themeFromApi,
  trackingFromApi,
} from "@/lib/api-transforms";
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
    languageCode: z.string().optional().default("en"),
    onboardingCompleted: z.boolean(),
  }),
});

// ── Preferences ──

// API sends UPPERCASE keys, transform to lowercase internal representation
const PrayerNotificationPrefsSchema = z
  .record(z.string(), z.boolean())
  .transform(prayerNotificationsFromApi);

const PrayerTimeAdjustmentsSchema = z
  .record(z.string(), z.number())
  .default({})
  .transform(adjustmentsFromApi);

export const UserPreferencesResponseSchema = z
  .object({
    city: CitySchema.nullable(),
    calculationMethod: z.string(),
    madhab: z.string(),
    highLatitudeRule: z.string(),
    hijriCorrection: z.number(),
    timeFormat: z.enum(["12h", "24h"]),
    theme: z.string(),
    languageCode: z.string().nullable().optional(),
    notificationsEnabled: z.boolean(),
    reminderTiming: z.string(),
    prayerNotifications: PrayerNotificationPrefsSchema,
    manualAdjustments: PrayerTimeAdjustmentsSchema,
  })
  .transform((data) => ({
    ...data,
    calculationMethod: data.calculationMethod.toLowerCase(),
    madhab: madhabFromApi(data.madhab),
    highLatitudeRule: data.highLatitudeRule.toLowerCase(),
    theme: themeFromApi(data.theme) as "light" | "dark" | "system",
    locale: data.languageCode?.toLowerCase() ?? "en",
  }));

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
    adjustments: z.record(z.string(), z.number()).default({}),
  }),
});

// ── Prayer Tracking ──

export const PrayerTrackingResponseSchema = z
  .object({
    tracking: z.record(z.string(), z.record(z.string(), z.boolean())),
  })
  .transform((data) => ({
    tracking: trackingFromApi(data.tracking),
  }));

export const TogglePrayerResponseSchema = z
  .object({
    date: z.string(),
    prayer: z.string(),
    prayed: z.boolean(),
    toggledAt: z.string(),
  })
  .transform((data) => ({
    ...data,
    prayer: data.prayer.toLowerCase(),
  }));

export const PrayerStatsResponseSchema = z
  .object({
    period: z.string(),
    from: z.string(),
    to: z.string(),
    total: z.number(),
    completed: z.number(),
    percentage: z.number(),
    byPrayer: z.record(z.string(), z.object({ total: z.number(), completed: z.number() })),
    streak: z.number(),
  })
  .transform((data) => ({
    ...data,
    byPrayer: byPrayerFromApi(data.byPrayer),
  }));

// ── Cities ──

export const CitySearchResponseSchema = z.object({
  cities: z.array(CitySchema),
});

export const NearestCityResponseSchema = z.object({
  city: CitySchema,
  distanceKm: z.number(),
});

// ── Dashboard ──

export const DashboardResponseSchema = z
  .object({
    prayerTimes: PrayerTimesResponseSchema,
    tracking: z.object({
      tracking: z.record(z.string(), z.record(z.string(), z.boolean())),
    }),
    stats: z.object({ streak: z.number() }).passthrough(),
  })
  .transform((data) => ({
    prayerTimes: data.prayerTimes,
    tracking: trackingFromApi(data.tracking.tracking),
    streak: data.stats.streak,
  }));
