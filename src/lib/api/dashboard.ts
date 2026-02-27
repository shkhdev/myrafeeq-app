import { api } from "@/lib/api-client";
import { DashboardResponseSchema } from "@/lib/api-schemas";
import type { DashboardResponse } from "@/types/api";

export async function getDashboard(): Promise<DashboardResponse> {
  const data = await api.get<DashboardResponse>("/api/v1/dashboard");
  return DashboardResponseSchema.parse(data);
}
