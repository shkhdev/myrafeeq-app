import { create } from "zustand";

interface AuthState {
  token: string | null;
  telegramId: number | null;
  onboardingCompleted: boolean;
  setAuth: (token: string, telegramId: number, onboardingCompleted: boolean) => void;
  setOnboardingCompleted: (value: boolean) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>()((set) => ({
  token: null,
  telegramId: null,
  onboardingCompleted: false,
  setAuth: (token, telegramId, onboardingCompleted) =>
    set({ token, telegramId, onboardingCompleted }),
  setOnboardingCompleted: (onboardingCompleted) => set({ onboardingCompleted }),
  clearAuth: () => set({ token: null, telegramId: null, onboardingCompleted: false }),
}));
