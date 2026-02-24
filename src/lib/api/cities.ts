import { api } from "@/lib/api-client";
import type { CitySearchResponse, NearestCityResponse } from "@/types/api";

export function searchCities(params: {
  q: string;
  locale?: string;
  limit?: number;
}): Promise<CitySearchResponse> {
  return api.get<CitySearchResponse>("/api/cities/search", params);
}

export function getNearestCity(params: { lat: number; lon: number }): Promise<NearestCityResponse> {
  return api.get<NearestCityResponse>("/api/cities/nearest", params);
}
