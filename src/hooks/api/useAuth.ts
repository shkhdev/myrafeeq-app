"use client";

import { useMutation } from "@tanstack/react-query";
import { validateTelegramAuth } from "@/lib/api/auth";
import { useAuthStore } from "@/stores/auth-store";

export function useValidateAuth() {
  const setAuth = useAuthStore((s) => s.setAuth);

  return useMutation({
    mutationFn: validateTelegramAuth,
    onSuccess: (data) => {
      setAuth(data.token, data.user.telegramId);
    },
  });
}
