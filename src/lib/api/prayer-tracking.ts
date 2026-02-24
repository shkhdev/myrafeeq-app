import { api } from "@/lib/api-client";
import type {
  PrayerStatsResponse,
  PrayerTrackingResponse,
  TogglePrayerRequest,
  TogglePrayerResponse,
} from "@/types/api";

export function getPrayerTracking(params?: {
  date?: string;
  from?: string;
  to?: string;
}): Promise<PrayerTrackingResponse> {
  return api.get<PrayerTrackingResponse>("/api/prayer-tracking", params);
}

export function togglePrayer(data: TogglePrayerRequest): Promise<TogglePrayerResponse> {
  return api.post<TogglePrayerResponse>("/api/prayer-tracking/toggle", data);
}

export function getPrayerStats(period: string): Promise<PrayerStatsResponse> {
  return api.get<PrayerStatsResponse>("/api/prayer-tracking/stats", { period });
}
