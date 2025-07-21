import { create } from "zustand"
import { persist } from "zustand/middleware"

export const useCurrentEditAuthorStore = create(
  persist(
    (set) => ({
      currentEditAuthor: null,
      setCurrentEditAuthor: (author) => {
        set({ currentEditAuthor: author })
      },
      clearCurrentEditAuthor: () => {
        set({ currentEditAuthor: null })
      },
    }),
    {
      name: "current-edit-author-storage", // name of the item in the storage (must be unique)
      getStorage: () => localStorage, // (optional) by default, 'localStorage' is used
    }
  )
)