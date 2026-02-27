import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useHaptic } from "@/hooks/useHaptic";
import { getPrayerStats, getPrayerTracking, togglePrayer } from "@/lib/api/prayer-tracking";
import type { DashboardResponse, TogglePrayerRequest } from "@/types/api";

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
      const queryKey = ["dashboard"];
      await queryClient.cancelQueries({ queryKey });
      const previous = queryClient.getQueryData<DashboardResponse>(queryKey);

      queryClient.setQueryData<DashboardResponse>(queryKey, (old) => {
        if (!old) return old;
        return {
          ...old,
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
    onError: (_err, _data, context) => {
      if (context?.previous) {
        queryClient.setQueryData(["dashboard"], context.previous);
      }
      haptic.notification("error");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
    },
  });
}

export function usePrayerStats(period: string) {
  return useQuery({
    queryKey: ["prayer-stats", period],
    queryFn: ({ signal }) => getPrayerStats(period, signal),
  });
}
