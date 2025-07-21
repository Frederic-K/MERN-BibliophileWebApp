import { create } from "zustand"
import { persist } from "zustand/middleware"

export const useCurrentBookAuthorsStore = create(
  persist(
    (set) => ({
      currentBookAuthors: [],
      setCurrentBookAuthors: (authors) => set({ currentBookAuthors: authors }),
      clearCurrentBookAuthors: () => set({ currentBookAuthors: [] }), // Clear function to reset the authors list
    }),
    {
      name: "current-book-authors-storage", // Unique name for the storage key
      getStorage: () => localStorage, // Use localStorage to persist the state
    }
  )
)