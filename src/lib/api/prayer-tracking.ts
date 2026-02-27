import { api } from "@/lib/api-client";
import {
  PrayerStatsResponseSchema,
  PrayerTrackingResponseSchema,
  TogglePrayerResponseSchema,
} from "@/lib/api-schemas";
import type {
  PrayerStatsResponse,
  PrayerTrackingResponse,
  TogglePrayerRequest,
  TogglePrayerResponse,
} from "@/types/api";

export async function getPrayerTracking(params?: {
  date?: string;
  from?: string;
  to?: string;
}): Promise<PrayerTrackingResponse> {
  const data = await api.get<PrayerTrackingResponse>("/api/v1/prayer-tracking", params);
  return PrayerTrackingResponseSchema.parse(data);
}

export async function togglePrayer(data: TogglePrayerRequest): Promise<TogglePrayerResponse> {
  const apiData = {
    ...data,
    prayer: data.prayer.toUpperCase(),
  };
  const result = await api.post<TogglePrayerResponse>("/api/v1/prayer-tracking/toggle", apiData);
  return TogglePrayerResponseSchema.parse(result);
}

export async function getPrayerStats(period: string): Promise<PrayerStatsResponse> {
  const data = await api.get<PrayerStatsResponse>("/api/v1/prayer-tracking/stats", { period });
  return PrayerStatsResponseSchema.parse(data);
}
