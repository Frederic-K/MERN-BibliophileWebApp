import { create } from "zustand"
import { persist } from "zustand/middleware"

export const useCurrentAuthorStore = create(
  persist(
    (set) => ({
      currentAuthor: null,
      setCurrentAuthor: (author) => {
        set({ currentAuthor: author })
      },
      clearCurrentAuthor: () => {
        set({ currentAuthor: null })
      },
    }),
    {
      name: "current-author-storage", // name of the item in the storage (must be unique)
      getStorage: () => localStorage, // (optional) by default, 'localStorage' is used
    }
  )
)
