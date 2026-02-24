"use client";

import { type ReactNode, useEffect, useState } from "react";
import { validateTelegramAuth } from "@/lib/api/auth";
import { useAuthStore } from "@/stores/auth-store";

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const { token } = useAuthStore.getState();

    if (token) {
      setIsReady(true);
      return;
    }

    let cancelled = false;

    async function authenticate() {
      try {
        const sdk = await import("@telegram-apps/sdk-react");
        const initData = sdk.initDataRaw();

        if (!initData) {
          // biome-ignore lint/suspicious/noConsole: auth debug logging
          console.warn("[AuthProvider] No initData available, skipping auth");
          return;
        }

        const response = await validateTelegramAuth(initData);
        if (!cancelled) {
          useAuthStore.getState().setAuth(response.token, response.user.telegramId);
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
