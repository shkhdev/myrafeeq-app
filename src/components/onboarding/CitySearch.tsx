import { useState } from "react";
import { useTranslations } from "use-intl";
import { useCitySearch } from "@/hooks/api/useCities";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import { useHaptic } from "@/hooks/useHaptic";
import type { City } from "@/types/city";

interface CitySearchProps {
  onSelect: (city: City) => void;
}

export function CitySearch({ onSelect }: CitySearchProps) {
  const t = useTranslations("onboarding.location");
  const haptic = useHaptic();
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebouncedValue(query, 300);
  const { data, isLoading } = useCitySearch(debouncedQuery);
  const cities = data?.cities ?? [];

  return (
    <div className="flex flex-col gap-3">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={t("searchPlaceholder")}
        className="h-12 rounded-xl border border-on-surface/10 bg-on-surface/5 px-4 text-sm text-on-surface placeholder:text-on-surface-muted/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
        // biome-ignore lint/a11y/noAutofocus: intentional focus for search UX in Telegram Mini App
        autoFocus
      />

      <div className="max-h-72 overflow-y-auto rounded-xl bg-on-surface/5">
        {isLoading && (
          <p className="px-4 py-3 text-center text-xs text-on-surface-muted/70">{t("searching")}</p>
        )}

        {!isLoading && debouncedQuery.length >= 2 && cities.length === 0 && (
          <p className="px-4 py-3 text-center text-xs text-on-surface-muted/70">{t("noResults")}</p>
        )}

        {!isLoading && debouncedQuery.length < 2 && (
          <p className="px-4 py-3 text-center text-xs text-on-surface-muted/70">
            {t("typeToSearch")}
          </p>
        )}

        {cities.map((city) => (
          <button
            key={city.id}
            type="button"
            onClick={() => {
              haptic.impact("light");
              onSelect(city);
            }}
            className="flex w-full flex-col px-4 py-3 text-start transition-colors hover:bg-on-surface/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-on-surface/30"
          >
            <span className="text-sm font-medium text-on-surface">{city.name}</span>
            <span className="text-xs text-on-surface-muted/70">{city.country}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
