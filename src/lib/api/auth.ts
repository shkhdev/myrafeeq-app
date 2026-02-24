import { api } from "@/lib/api-client";
import type { AuthResponse } from "@/types/api";

export function validateTelegramAuth(initData: string): Promise<AuthResponse> {
  return api.post<AuthResponse>("/api/auth/validate", { initData });
}
