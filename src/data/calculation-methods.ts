import type { CalculationMethodId } from "@/types/prayer";

/**
 * Auto-detect calculation method based on city ID.
 * Maps cities to the regionally appropriate default method.
 */
const CITY_METHOD_MAP: Record<string, CalculationMethodId> = {
  // Saudi Arabia → Umm al-Qura
  mecca: "umm_al_qura",
  medina: "umm_al_qura",
  riyadh: "umm_al_qura",
  // Egypt → Egyptian General Authority
  cairo: "egypt",
  // Pakistan / India / Bangladesh → Karachi
  karachi: "karachi",
  // Turkey → MWL (turkey method removed)
  istanbul: "mwl",
  ankara: "mwl",
  // Malaysia / Indonesia → Singapore
  "kuala-lumpur": "singapore",
  jakarta: "singapore",
  // UAE → Dubai
  dubai: "dubai",
  // Qatar → Qatar
  doha: "qatar",
  // UK / Europe → MWL
  london: "mwl",
  // Russia → MWL
  moscow: "mwl",
  kazan: "mwl",
  // Uzbekistan → MWL
  tashkent: "mwl",
  samarkand: "mwl",
  bukhara: "mwl",
  namangan: "mwl",
  andijan: "mwl",
  fergana: "mwl",
  // Tajikistan → MWL
  dushanbe: "mwl",
};

export function getRecommendedMethod(cityId: string): CalculationMethodId {
  return CITY_METHOD_MAP[cityId] ?? "mwl";
}
