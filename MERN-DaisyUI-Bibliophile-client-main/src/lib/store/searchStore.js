// import { create } from "zustand"
// import { persist } from "zustand/middleware"

// export const useSearchStore = create(
//   persist(
//     (set) => ({
//       searchType: "",
//       searchTerm: "",
//       sortBy: "",
//       sortOrder: "",
//       format: "",
//       minRating: "",
//       readStatus: "",
//       availabilityStatus: "",
//       searchResults: null,
//       searchResultsPage: 1,
//       searchTotalPages: 1, // Track total pages for search results
//       setSearchParams: (params) => set((state) => ({ ...state, ...params })),
//       clearSearch: () =>
//         set({
//           searchType: "",
//           searchTerm: "",
//           sortBy: "",
//           sortOrder: "",
//           format: "",
//           minRating: "",
//           readStatus: "",
//           availabilityStatus: "",
//           searchResults: null,
//           searchResultsPage: 1,
//           searchTotalPages: 1, // Reset total pages for search results
//         }),
//       setSearchResults: (results) => set({ searchResults: results }),
//       setSearchResultsPage: (page) => set({ searchResultsPage: page }),
//       setSearchTotalPages: (totalPages) => set({ searchTotalPages: totalPages }),
//     }),
//     { name: "search-store" }
//   )
// )

import { create } from "zustand"
import { persist } from "zustand/middleware"

export const useSearchStore = create(
  persist(
    (set) => ({
      searchResults: null,
      searchResultsPage: 1,
      searchTotalPages: 1,
      setSearchResults: (results) => set({ searchResults: results }),
      setSearchResultsPage: (page) => set({ searchResultsPage: page }),
      setSearchTotalPages: (totalPages) => set({ searchTotalPages: totalPages }),
      updateSearchResult: (itemId, updateData) =>
        set((state) => ({
          searchResults: state.searchResults
            ? state.searchResults.map((item) =>
                item._id === itemId ? { ...item, ...updateData } : item
              )
            : null,
        })),
      clearSearch: () =>
        set({
          searchResults: null,
          searchResultsPage: 1,
          searchTotalPages: 1,
        }),
    }),
    { name: "search-results-store" }
  )
)
