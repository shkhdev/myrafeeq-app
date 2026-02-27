import { useQuery } from "@tanstack/react-query";
import { getNearestCity, searchCities } from "@/lib/api/cities";

export function useCitySearch(query: string) {
  return useQuery({
    queryKey: ["cities-search", query],
    queryFn: ({ signal }) => searchCities({ q: query }, signal),
    enabled: query.length >= 2,
  });
}

export function useNearestCity(lat: number, lon: number, enabled = true) {
  return useQuery({
    queryKey: ["nearest-city", lat, lon],
    queryFn: ({ signal }) => getNearestCity({ lat, lon }, signal),
    enabled,
  });
}
