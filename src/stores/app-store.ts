import { create } from "zustand";

export type AppScreen = "home" | "settings";

interface AppState {
  currentScreen: AppScreen;
  setScreen: (screen: AppScreen) => void;
}

export const useAppStore = create<AppState>()((set) => ({
  currentScreen: "home",
  setScreen: (screen) => set({ currentScreen: screen }),
}));
