import { useMutation, useQueryClient } from "@tanstack/react-query";
import { completeOnboarding } from "@/lib/api/preferences";
import type { OnboardingRequest } from "@/types/api";

export function useCompleteOnboarding() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: OnboardingRequest) => completeOnboarding(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["preferences"] });
    },
  });
}
