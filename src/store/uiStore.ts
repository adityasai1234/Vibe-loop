import { create } from "zustand";

interface UiState {
  themeGradient: string;                      // CSS gradient string
  setThemeGradient: (g: string) => void;
}

export const useUiStore = create<UiState>(set => ({
  themeGradient: "linear-gradient(#111,#000)",
  setThemeGradient: (g) => set({ themeGradient: g }),
}));