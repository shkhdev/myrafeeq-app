import { usePrayerTimes } from "@/hooks/api/usePrayerTimes";
import { useBackButton } from "@/hooks/useBackButton";
import { useMainButton } from "@/hooks/useMainButton";
import { usePreferencesStore } from "@/stores/preferences-store";

import { HomeHeader } from "./HomeHeader";
import { PrayerHeroCard } from "./PrayerHeroCard";
import { PrayerTimesList } from "./PrayerTimesList";

export function HomeScreen() {
  const city = usePreferencesStore((s) => s.city);
  const { data } = usePrayerTimes();
  const prayerTimes = data?.[0]?.times ?? null;

  useBackButton(null);
  useMainButton({ text: "", isVisible: false, onClick: () => {} });

  return (
    <div
      className="flex flex-col bg-surface"
      style={{ minHeight: "var(--tg-viewport-stable-height, 100dvh)" }}
    >
      <HomeHeader city={city} />
      {prayerTimes && (
        <>
          <PrayerHeroCard prayerTimes={prayerTimes} />
          <PrayerTimesList prayerTimes={prayerTimes} />
        </>
      )}
      {/* Bottom safe area padding */}
      <div className="shrink-0" style={{ paddingBottom: "calc(var(--safe-bottom, 0px) + 1rem)" }} />
    </div>
  );
}
