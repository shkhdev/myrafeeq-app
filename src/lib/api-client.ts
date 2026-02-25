import * as Sentry from "@sentry/react";
import { API_URL } from "@/env";
import { useAuthStore } from "@/stores/auth-store";
import type { ApiErrorResponse } from "@/types/api";

export class ApiError extends Error {
  constructor(
    public code: string,
    message: string,
    public status: number,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

/**
 * Re-validate Telegram initData and refresh the auth token.
 * Returns true if re-auth succeeded, false otherwise.
 */
async function tryReauth(): Promise<boolean> {
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
        // Launch params not available
      }
    }
    if (!initData) return false;

    const response = await fetch(`${API_URL}/api/auth/validate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ initData }),
    });
    if (!response.ok) return false;

    const data = (await response.json()) as {
      token: string;
      user: { telegramId: number; onboardingCompleted: boolean };
    };
    useAuthStore
      .getState()
      .setAuth(data.token, data.user.telegramId, data.user.onboardingCompleted);
    return true;
  } catch (error) {
    Sentry.captureException(error, { tags: { context: "api.reauth" } });
    return false;
  }
}

/** Track whether a re-auth attempt is already in progress to avoid duplicates. */
let reauthPromise: Promise<boolean> | null = null;

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = useAuthStore.getState().token;
  const headers: Record<string, string> = {
    ...(API_URL.includes("ngrok") ? { "ngrok-skip-browser-warning": "1" } : {}),
    ...((options.headers as Record<string, string>) ?? {}),
  };

  if (options.body) {
    headers["Content-Type"] ??= "application/json";
  }

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers,
  });

  // Handle 401 — attempt transparent re-auth, then retry the original request once
  if (response.status === 401 && token) {
    if (!reauthPromise) {
      reauthPromise = tryReauth().finally(() => {
        reauthPromise = null;
      });
    }
    const refreshed = await reauthPromise;
    if (refreshed) {
      const newToken = useAuthStore.getState().token;
      headers.Authorization = `Bearer ${newToken}`;
      const retryResponse = await fetch(`${API_URL}${path}`, { ...options, headers });
      if (!retryResponse.ok) {
        const body = (await retryResponse.json().catch(() => null)) as ApiErrorResponse | null;
        throw new ApiError(
          body?.error?.code ?? "UNKNOWN_ERROR",
          body?.error?.message ?? `Request failed with status ${retryResponse.status}`,
          retryResponse.status,
        );
      }
      if (retryResponse.status === 204) return undefined as T;
      return retryResponse.json() as Promise<T>;
    }
    // Re-auth failed — clear auth so the app can show the appropriate state
    useAuthStore.getState().clearAuth();
  }

  if (!response.ok) {
    const body = (await response.json().catch(() => null)) as ApiErrorResponse | null;
    throw new ApiError(
      body?.error?.code ?? "UNKNOWN_ERROR",
      body?.error?.message ?? `Request failed with status ${response.status}`,
      response.status,
    );
  }

  if (response.status === 204) {
    // No current endpoint returns 204. If one is added, callers should type T accordingly.
    return undefined as T;
  }

  return response.json() as Promise<T>;
}

export const api = {
  get: <T>(path: string, params?: Record<string, string | number | undefined>) => {
    const searchParams = new URLSearchParams();
    if (params) {
      for (const [key, value] of Object.entries(params)) {
        if (value !== undefined) {
          searchParams.set(key, String(value));
        }
      }
    }
    const query = searchParams.toString();
    return request<T>(query ? `${path}?${query}` : path);
  },
  post: <T>(path: string, body?: unknown) =>
    request<T>(path, {
      method: "POST",
      body: body ? JSON.stringify(body) : null,
    }),
  put: <T>(path: string, body?: unknown) =>
    request<T>(path, {
      method: "PUT",
      body: body ? JSON.stringify(body) : null,
    }),
};
