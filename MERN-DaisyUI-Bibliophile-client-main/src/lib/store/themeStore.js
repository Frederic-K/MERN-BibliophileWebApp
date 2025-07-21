import { create } from "zustand"
import { persist } from "zustand/middleware"

export const useThemeStore = create(
  persist(
    (set) => ({
      isDarkTheme: false, // Default to light theme
      daisyUITheme: "retro", // Default DaisyUI theme
      // toggleTheme: () => set((state) => ({ isDarkTheme: !state.isDarkTheme })),
      setDarkTheme: (isDark) => set({ isDarkTheme: isDark }),
      setDaisyUITheme: (theme) => set({ daisyUITheme: theme }),
    }),
    { name: "theme-storage" }
  )
)
