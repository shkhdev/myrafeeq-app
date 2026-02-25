import { useTranslations } from "use-intl";

import { usePrayerTimes } from "@/hooks/api/usePrayerTimes";
import { usePreferencesStore } from "@/stores/preferences-store";

import { HomeHeader } from "./HomeHeader";
import { PrayerHeroCard } from "./PrayerHeroCard";
import { PrayerTimesList } from "./PrayerTimesList";

export function HomeScreen() {
  const t = useTranslations("home");
  const city = usePreferencesStore((s) => s.city);
  const { data, isLoading, isError, refetch } = usePrayerTimes();
  const prayerTimes = data?.[0]?.times ?? null;

  return (
    <div
      className="flex flex-col bg-surface"
      style={{ minHeight: "var(--tg-viewport-stable-height, 100dvh)" }}
    >
      <HomeHeader city={city} />
      {isLoading ? (
        <div className="flex flex-1 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        </div>
      ) : isError ? (
        <div className="flex flex-1 flex-col items-center justify-center gap-3 px-6 text-center">
          <p className="text-sm text-on-surface-muted">{t("loadError")}</p>
          <button
            type="button"
            onClick={() => refetch()}
            className="rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary/90"
          >
            {t("retry")}
          </button>
        </div>
      ) : prayerTimes ? (
        <>
          <PrayerHeroCard prayerTimes={prayerTimes} />
          <PrayerTimesList prayerTimes={prayerTimes} />
        </>
      ) : null}
      {/* Bottom safe area padding */}
      <div className="shrink-0" style={{ paddingBottom: "calc(var(--safe-bottom, 0px) + 1rem)" }} />
    </div>
  );
}
