import { api } from "@/lib/api-client";
import { AuthResponseSchema } from "@/lib/api-schemas";
import type { AuthResponse } from "@/types/api";

export async function validateTelegramAuth(
  initData: string,
  signal?: AbortSignal,
): Promise<AuthResponse> {
  const data = await api.post<AuthResponse>("/api/v1/auth/token", { initData }, signal);
  return AuthResponseSchema.parse(data);
}
