import { create } from "zustand"
import { persist } from "zustand/middleware"

export const useWishlistStore = create(
  persist(
    (set) => ({
      books: [],
      isUnsaved: false,
      setBooks: (books) => set({ books, isUnsaved: false }),
      addBook: (book) => set((state) => ({ books: [...state.books, book], isUnsaved: true })),
      removeBook: (index) =>
        set((state) => ({
          books: state.books.filter((_, i) => i !== index),
          isUnsaved: true,
        })),
      setIsUnsaved: (modified) => set({ isUnsaved: modified }),
      clearBooks: () => set({ books: [], isUnsaved: true }),
    }),
    {
      name: "wishlist-storage", // unique name for the storage key
      getStorage: () => localStorage, // (optional) by default, 'localStorage' is used
    }
  )
)
