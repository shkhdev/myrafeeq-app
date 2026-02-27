import { MutationCache, QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import { showErrorToast } from "@/hooks/useErrorToast";
import { isAppError } from "@/lib/errors";

function shouldRetry(failureCount: number, error: unknown): boolean {
  if (isAppError(error)) {
    if (error.kind === "auth" || error.kind === "validation") {
      return false;
    }
  }
  return failureCount < 1;
}

export function QueryProvider({ children }: { children: React.ReactNode }) {
  const [client] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000,
            retry: shouldRetry,
          },
          mutations: {
            retry: false,
          },
        },
        mutationCache: new MutationCache({
          onError: (error) => {
            showErrorToast(error);
          },
        }),
      }),
  );

  return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
}
