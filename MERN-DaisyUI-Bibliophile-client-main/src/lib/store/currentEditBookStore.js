import { create } from "zustand"
import { persist } from "zustand/middleware"

export const useCurrentEditBookStore = create(
  persist(
    (set) => ({
      currentEditBook: null,
      setCurrentEditBook: (book) => {
        set({ currentEditBook: book })
      },
      clearCurrentEditBook: () => {
        set({ currentEditBook: null })
      },
    }),
    {
      name: "current-edit-book-storage", // name of the item in the storage (must be unique)
      getStorage: () => localStorage, // (optional) by default, 'localStorage' is used
    }
  )
)
