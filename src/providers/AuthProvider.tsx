import { type ReactNode, useEffect, useState } from "react";
import { validateTelegramAuth } from "@/lib/api/auth";
import { getPreferences } from "@/lib/api/preferences";
import { hydrateFromBackend } from "@/lib/hydrate-preferences";
import { useAuthStore } from "@/stores/auth-store";

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function authenticate() {
      try {
        const sdk = await import("@telegram-apps/sdk-react");

        // Try the signal first (populated by init + restoreInitData),
        // then fall back to reading directly from URL hash / performance entries / localStorage.
        let initData: string | undefined;
        try {
          initData = sdk.initDataRaw();
        } catch {
          // Signal not initialized
        }
        if (!initData) {
          try {
            initData = sdk.retrieveRawInitData();
          } catch {
            // Launch params not available from any source
          }
        }

        if (!initData) {
          // biome-ignore lint/suspicious/noConsole: auth debug logging
          console.warn("[AuthProvider] No initData available, skipping auth");
          return;
        }

        const response = await validateTelegramAuth(initData);
        if (cancelled) return;

        useAuthStore
          .getState()
          .setAuth(response.token, response.user.telegramId, response.user.onboardingCompleted);

        // Hydrate preferences from backend if user has completed onboarding
        if (response.user.onboardingCompleted) {
          try {
            const prefs = await getPreferences();
            if (!cancelled) {
              hydrateFromBackend(prefs);
            }
          } catch {
            // biome-ignore lint/suspicious/noConsole: preferences fetch error
            console.warn("[AuthProvider] Failed to load preferences from backend");
          }
        }
      } catch (error) {
        // biome-ignore lint/suspicious/noConsole: auth error logging
        console.error("[AuthProvider] Authentication failed:", error);
      } finally {
        if (!cancelled) {
          setIsReady(true);
        }
      }
    }

    authenticate();

    return () => {
      cancelled = true;
    };
  }, []);

  if (!isReady) {
    return null;
  }

  return <>{children}</>;
}
