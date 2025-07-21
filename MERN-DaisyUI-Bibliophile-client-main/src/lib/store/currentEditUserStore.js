import { create } from "zustand"
import { persist } from "zustand/middleware"

export const useCurrentEditUserStore = create(
  persist(
    (set) => ({
      currentEditUser: null,
      // setCurrentEditUser: (user) => set({ currentEditUser: user }),
      setCurrentEditUser: (user) =>
        set((state) => ({
          currentEditUser: state.currentEditUser ? { ...state.currentEditUser, ...user } : user,
        })),
      clearCurrentEditUser: () => set({ currentEditUser: null }),
    }),
    {
      name: "current-edit-user-storage", // unique name for localStorage key
      getStorage: () => localStorage,
    }
  )
)
