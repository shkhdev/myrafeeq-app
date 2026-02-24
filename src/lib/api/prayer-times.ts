import { api } from "@/lib/api-client";
import type { PrayerTimesResponse } from "@/types/api";

export function getPrayerTimes(params?: {
  date?: string;
  days?: number;
}): Promise<PrayerTimesResponse[]> {
  return api.get<PrayerTimesResponse[]>("/api/prayer-times", params);
}

export function getPrayerTimesByLocation(params: {
  lat: number;
  lon: number;
  date?: string;
  method?: string;
}): Promise<PrayerTimesResponse> {
  return api.get<PrayerTimesResponse>("/api/prayer-times/by-location", params);
}
