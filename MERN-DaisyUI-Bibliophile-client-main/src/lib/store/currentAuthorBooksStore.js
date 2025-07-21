import { create } from "zustand"
import { persist } from "zustand/middleware"

export const useCurrentAuthorBooksStore = create(
  persist(
    (set) => ({
      currentAuthorBooks: [],
      setCurrentAuthorBooks: (books) => set({ currentAuthorBooks: books }),
      clearCurrentAuthorBooks: () => set({ currentAuthorBooks: [] }), // Clear function to reset the books list
    }),
    {
      name: "current-author-books-storage", // Unique name for the storage key
      getStorage: () => localStorage, // Use localStorage to persist the state
    }
  )
)
