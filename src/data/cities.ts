import type { City } from "@/types/city";

const CITIES: City[] = [
  {
    id: "tashkent",
    name: "Tashkent",
    country: "Uzbekistan",
    latitude: 41.2995,
    longitude: 69.2401,
  },
  {
    id: "samarkand",
    name: "Samarkand",
    country: "Uzbekistan",
    latitude: 39.6542,
    longitude: 66.9597,
  },
  {
    id: "bukhara",
    name: "Bukhara",
    country: "Uzbekistan",
    latitude: 39.7681,
    longitude: 64.4219,
  },
  {
    id: "namangan",
    name: "Namangan",
    country: "Uzbekistan",
    latitude: 40.9983,
    longitude: 71.6726,
  },
  {
    id: "andijan",
    name: "Andijan",
    country: "Uzbekistan",
    latitude: 40.7821,
    longitude: 72.3442,
  },
  {
    id: "fergana",
    name: "Fergana",
    country: "Uzbekistan",
    latitude: 40.3842,
    longitude: 71.7893,
  },
  {
    id: "moscow",
    name: "Moscow",
    country: "Russia",
    latitude: 55.7558,
    longitude: 37.6173,
  },
  {
    id: "kazan",
    name: "Kazan",
    country: "Russia",
    latitude: 55.7961,
    longitude: 49.1064,
  },
  {
    id: "istanbul",
    name: "Istanbul",
    country: "Turkey",
    latitude: 41.0082,
    longitude: 28.9784,
  },
  {
    id: "ankara",
    name: "Ankara",
    country: "Turkey",
    latitude: 39.9334,
    longitude: 32.8597,
  },
  {
    id: "dubai",
    name: "Dubai",
    country: "UAE",
    latitude: 25.2048,
    longitude: 55.2708,
  },
  {
    id: "mecca",
    name: "Mecca",
    country: "Saudi Arabia",
    latitude: 21.3891,
    longitude: 39.8579,
  },
  {
    id: "medina",
    name: "Medina",
    country: "Saudi Arabia",
    latitude: 24.5247,
    longitude: 39.5692,
  },
  {
    id: "cairo",
    name: "Cairo",
    country: "Egypt",
    latitude: 30.0444,
    longitude: 31.2357,
  },
  {
    id: "jakarta",
    name: "Jakarta",
    country: "Indonesia",
    latitude: -6.2088,
    longitude: 106.8456,
  },
  {
    id: "kuala-lumpur",
    name: "Kuala Lumpur",
    country: "Malaysia",
    latitude: 3.139,
    longitude: 101.6869,
  },
  {
    id: "london",
    name: "London",
    country: "United Kingdom",
    latitude: 51.5074,
    longitude: -0.1278,
  },
  {
    id: "riyadh",
    name: "Riyadh",
    country: "Saudi Arabia",
    latitude: 24.7136,
    longitude: 46.6753,
  },
  {
    id: "doha",
    name: "Doha",
    country: "Qatar",
    latitude: 25.2854,
    longitude: 51.531,
  },
  {
    id: "dushanbe",
    name: "Dushanbe",
    country: "Tajikistan",
    latitude: 38.5598,
    longitude: 68.774,
  },
];

export function searchCities(query: string): City[] {
  if (!query.trim()) return CITIES;
  const lower = query.toLowerCase();
  return CITIES.filter(
    (c) => c.name.toLowerCase().includes(lower) || c.country.toLowerCase().includes(lower),
  );
}

export function findCityByCoords(lat: number, lon: number): City | null {
  let nearest: City | null = null;
  let minDist = Number.POSITIVE_INFINITY;
  for (const city of CITIES) {
    const dist = Math.sqrt((city.latitude - lat) ** 2 + (city.longitude - lon) ** 2);
    if (dist < minDist) {
      minDist = dist;
      nearest = city;
    }
  }
  // Within roughly 5 degrees (~500km)
  return minDist < 5 ? nearest : null;
}
