import { create } from "zustand"
import { persist } from "zustand/middleware"

export const useCurrentBookshelfItemStore = create(
  persist(
    (set) => ({
      currentBookshelfItem: null,
      setCurrentBookshelfItem: (item) => set({ currentBookshelfItem: item }),
      clearCurrentBookshelfItem: () => set({ currentBookshelfItem: null }),
    }),
    {
      name: "current-bookshelf-item-storage", // unique name for the storage
      getStorage: () => localStorage, // (optional) by default, 'localStorage' is used
    }
  )
)
