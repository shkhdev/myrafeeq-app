import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getPrayerStats, getPrayerTracking, togglePrayer } from "@/lib/api/prayer-tracking";
import type { PrayerTrackingResponse } from "@/types/api";

export function usePrayerTracking(date?: string) {
  return useQuery({
    queryKey: ["prayer-tracking", date],
    queryFn: () => getPrayerTracking(date ? { date } : undefined),
  });
}

export function useTogglePrayer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: togglePrayer,
    onMutate: async (data) => {
      const queryKey = ["prayer-tracking", data.date];
      await queryClient.cancelQueries({ queryKey });
      const previous = queryClient.getQueryData<PrayerTrackingResponse>(queryKey);

      queryClient.setQueryData<PrayerTrackingResponse>(queryKey, (old) => {
        if (!old) return old;
        return {
          tracking: {
            ...old.tracking,
            [data.date]: {
              ...(old.tracking[data.date] ?? {}),
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
    },
    onSettled: (_data, _err, variables) => {
      queryClient.invalidateQueries({ queryKey: ["prayer-tracking", variables.date] });
      queryClient.invalidateQueries({ queryKey: ["prayer-stats"] });
    },
  });
}

export function usePrayerStats(period: string) {
  return useQuery({
    queryKey: ["prayer-stats", period],
    queryFn: () => getPrayerStats(period),
  });
}
