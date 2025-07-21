import { create } from "zustand"
import { persist } from "zustand/middleware"

export const useCurrentBookStore = create(
  persist(
    (set) => ({
      currentBook: null,
      setCurrentBook: (book) => {
        set({ currentBook: book })
      },
      clearCurrentBook: () => {
        set({ currentBook: null })
      },
    }),
    {
      name: "current-book-storage", // name of the item in the storage (must be unique)
      getStorage: () => localStorage, // (optional) by default, 'localStorage' is used
    }
  )
)
