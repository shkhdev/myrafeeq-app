import { useTranslations } from "use-intl";

import { ScreenLayout } from "@/components/ui/ScreenLayout";
import { usePrayerTimes } from "@/hooks/api/usePrayerTimes";
import { usePreferencesStore } from "@/stores/preferences-store";

import { ErrorState } from "../ui/ErrorState";
import { HomeHeader } from "./HomeHeader";
import { PrayerHeroCard } from "./PrayerHeroCard";
import { PrayerTimesList } from "./PrayerTimesList";

export function HomeScreen() {
  const t = useTranslations("home");
  const city = usePreferencesStore((s) => s.city);
  const { data, isLoading, isError, refetch } = usePrayerTimes();
  const prayerTimes = data?.[0]?.times ?? null;

  return (
    <ScreenLayout>
      <HomeHeader city={city} />
      {isLoading ? (
        <div className="flex flex-1 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        </div>
      ) : isError ? (
        <ErrorState message={t("loadError")} retryLabel={t("retry")} onRetry={() => refetch()} />
      ) : prayerTimes ? (
        <>
          <PrayerHeroCard prayerTimes={prayerTimes} />
          <PrayerTimesList prayerTimes={prayerTimes} />
        </>
      ) : null}
      {/* Bottom safe area padding */}
      <div className="shrink-0" style={{ paddingBottom: "calc(var(--safe-bottom, 0px) + 1rem)" }} />
    </ScreenLayout>
  );
}
