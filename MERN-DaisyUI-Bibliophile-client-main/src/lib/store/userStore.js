import { create } from "zustand"
import { persist } from "zustand/middleware"

export const useUserStore = create(
  persist(
    (set) => ({
      currentUser: null,
      setCurrentUser: (user) =>
        set((state) => ({
          currentUser: state.currentUser ? { ...state.currentUser, ...user } : user,
        })),
      logout: () => set({ currentUser: null }),
    }),
    { name: "user-storage", getStorage: () => localStorage }
  )
)
