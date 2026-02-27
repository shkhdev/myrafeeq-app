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

export async function getPrayerTracking(
  params?: { date?: string; from?: string; to?: string },
  signal?: AbortSignal,
): Promise<PrayerTrackingResponse> {
  const data = await api.get<PrayerTrackingResponse>("/api/v1/prayer-tracking", params, signal);
  return PrayerTrackingResponseSchema.parse(data);
}

export async function togglePrayer(
  data: TogglePrayerRequest,
  signal?: AbortSignal,
): Promise<TogglePrayerResponse> {
  const apiData = {
    ...data,
    prayer: data.prayer.toUpperCase(),
  };
  const result = await api.post<TogglePrayerResponse>(
    "/api/v1/prayer-tracking/toggle",
    apiData,
    signal,
  );
  return TogglePrayerResponseSchema.parse(result);
}

export async function getPrayerStats(
  period: string,
  signal?: AbortSignal,
): Promise<PrayerStatsResponse> {
  const data = await api.get<PrayerStatsResponse>(
    "/api/v1/prayer-tracking/stats",
    { period },
    signal,
  );
  return PrayerStatsResponseSchema.parse(data);
}
