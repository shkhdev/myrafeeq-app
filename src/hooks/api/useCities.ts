import { useQuery } from "@tanstack/react-query";
import { getNearestCity, searchCities } from "@/lib/api/cities";

export function useCitySearch(query: string) {
  return useQuery({
    queryKey: ["cities-search", query],
    queryFn: () => searchCities({ q: query }),
    enabled: query.length >= 2,
  });
}

export function useNearestCity(lat: number, lon: number, enabled = true) {
  return useQuery({
    queryKey: ["nearest-city", lat, lon],
    queryFn: () => getNearestCity({ lat, lon }),
    enabled,
  });
}
