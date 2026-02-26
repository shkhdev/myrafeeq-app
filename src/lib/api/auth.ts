import { api } from "@/lib/api-client";
import { AuthResponseSchema } from "@/lib/api-schemas";
import type { AuthResponse } from "@/types/api";

export async function validateTelegramAuth(initData: string): Promise<AuthResponse> {
  const data = await api.post<AuthResponse>("/api/auth/validate", { initData });
  return AuthResponseSchema.parse(data);
}
