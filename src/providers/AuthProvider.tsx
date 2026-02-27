import { type ReactNode, useCallback, useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/Button";
import { pauseSync } from "@/hooks/usePreferencesSync";
import { validateTelegramAuth } from "@/lib/api/auth";
import { getPreferences } from "@/lib/api/preferences";
import { isAppError } from "@/lib/errors";
import { hydrateFromBackend } from "@/lib/hydrate-preferences";
import { reportError } from "@/lib/sentry";
import { useAuthStore } from "@/stores/auth-store";

type AuthStatus = "loading" | "ready" | "no-initdata" | "error";
type AuthErrorInfo = { title: string; message: string };

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [status, setStatus] = useState<AuthStatus>("loading");
  const errorRef = useRef<AuthErrorInfo>({
    title: "Connection failed",
    message: "Unable to connect to the server. Please check your connection and try again.",
  });

  const authenticate = useCallback(async (signal: { cancelled: boolean }) => {
    setStatus("loading");
    try {
      const sdk = await import("@telegram-apps/sdk-react");

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
        if (import.meta.env.DEV) {
          // SDK signals may not expose mock data — build dev initData directly
          const mockUser = { id: 12345, first_name: "Test", language_code: "en" };
          initData = new URLSearchParams({
            user: JSON.stringify(mockUser),
            auth_date: String(Math.floor(Date.now() / 1000)),
            hash: "dev",
          }).toString();
        } else {
          setStatus("no-initdata");
          return;
        }
      }

      const response = await validateTelegramAuth(initData);
      if (signal.cancelled) return;

      useAuthStore
        .getState()
        .setAuth(response.token, response.user.telegramId, response.user.onboardingCompleted);

      if (response.user.onboardingCompleted) {
        try {
          const prefs = await getPreferences();
          if (!signal.cancelled) {
            pauseSync();
            hydrateFromBackend(prefs);
          }
        } catch (prefError) {
          pauseSync();
          if (isAppError(prefError)) {
            reportError(prefError);
          }
        }
      }

      if (!signal.cancelled) {
        setStatus("ready");
      }
    } catch (error) {
      if (!signal.cancelled) {
        if (isAppError(error)) {
          reportError(error);
          switch (error.kind) {
            case "network":
              errorRef.current = {
                title: "Connection failed",
                message:
                  "Unable to connect to the server. Please check your connection and try again.",
              };
              break;
            case "auth":
              errorRef.current = {
                title: "Authentication failed",
                message:
                  error.code === "INVALID_AUTH"
                    ? "Telegram authentication was rejected by the server. Please reopen the app from Telegram."
                    : error.message,
              };
              break;
            default:
              errorRef.current = {
                title: "Something went wrong",
                message: error.message,
              };
              break;
          }
        } else {
          errorRef.current = {
            title: "Something went wrong",
            message: error instanceof Error ? error.message : "An unexpected error occurred.",
          };
        }
        setStatus("error");
      }
    }
  }, []);

  useEffect(() => {
    const signal = { cancelled: false };
    authenticate(signal);
    return () => {
      signal.cancelled = true;
    };
  }, [authenticate]);

  if (status === "loading") {
    return null;
  }

  if (status === "no-initdata") {
    return (
      <div className="flex h-dvh flex-col items-center justify-center gap-4 bg-surface px-6 text-center">
        <p className="text-lg font-semibold text-on-surface">Please open this app in Telegram</p>
        <p className="max-w-[280px] text-sm text-on-surface-muted">
          MyRafeeq is a Telegram Mini App and needs to be launched from within Telegram.
        </p>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="flex h-dvh flex-col items-center justify-center gap-4 bg-surface px-6 text-center">
        <p className="text-lg font-semibold text-on-surface">{errorRef.current.title}</p>
        <p className="max-w-[280px] text-sm text-on-surface-muted">{errorRef.current.message}</p>
        <Button
          size="md"
          onClick={() => {
            const signal = { cancelled: false };
            authenticate(signal);
          }}
        >
          Try again
        </Button>
      </div>
    );
  }

  return <>{children}</>;
}
