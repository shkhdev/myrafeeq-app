import { useMutation, useQueryClient } from "@tanstack/react-query";
import { completeOnboarding } from "@/lib/api/preferences";

export function useCompleteOnboarding() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: completeOnboarding,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["preferences"] });
    },
  });
}
