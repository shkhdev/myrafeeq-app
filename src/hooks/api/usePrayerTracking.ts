import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useHaptic } from "@/hooks/useHaptic";
import { getPrayerStats, getPrayerTracking, togglePrayer } from "@/lib/api/prayer-tracking";
import type { PrayerTrackingResponse, TogglePrayerRequest } from "@/types/api";

export function usePrayerTracking(date?: string) {
  return useQuery({
    queryKey: ["prayer-tracking", date],
    queryFn: ({ signal }) => getPrayerTracking(date ? { date } : undefined, signal),
  });
}

export function useTogglePrayer() {
  const queryClient = useQueryClient();
  const haptic = useHaptic();

  return useMutation({
    mutationFn: (data: TogglePrayerRequest) => togglePrayer(data),
    onMutate: async (data) => {
      const queryKey = ["prayer-tracking", data.date];
      await queryClient.cancelQueries({ queryKey });
      const previous = queryClient.getQueryData<PrayerTrackingResponse>(queryKey);

      queryClient.setQueryData<PrayerTrackingResponse>(queryKey, (old) => {
        const existing = old ?? { tracking: {} };
        return {
          tracking: {
            ...existing.tracking,
            [data.date]: {
              ...(existing.tracking[data.date] ?? {}),
              [data.prayer]: data.prayed,
            },
          },
        };
      });

      return { previous };
    },
    onError: (_err, data, context) => {
      if (context?.previous) {
        queryClient.setQueryData(["prayer-tracking", data.date], context.previous);
      }
      haptic.notification("error");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["prayer-stats"] });
    },
  });
}

export function usePrayerStats(period: string) {
  return useQuery({
    queryKey: ["prayer-stats", period],
    queryFn: ({ signal }) => getPrayerStats(period, signal),
  });
}
