import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AuthState {
  token: string | null;
  telegramId: number | null;
  setAuth: (token: string, telegramId: number) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      telegramId: null,
      setAuth: (token, telegramId) => set({ token, telegramId }),
      clearAuth: () => set({ token: null, telegramId: null }),
    }),
    { name: "myrafeeq-auth" },
  ),
);
