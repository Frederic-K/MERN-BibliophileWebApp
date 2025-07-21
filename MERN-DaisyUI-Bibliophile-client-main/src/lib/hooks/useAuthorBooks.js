import { useState, useEffect } from "react"
import axios from "axios"
import { useCurrentAuthorBooksStore } from "../store/currentAuthorBooksStore"
import { toast } from "react-toastify"

export const useAuthorBooks = (slug, booksPage) => {
  const [isLoading, setIsLoading] = useState(false)
  const [totalPages, setTotalPages] = useState(1)

  const setCurrentAuthorBooks = useCurrentAuthorBooksStore((state) => state.setCurrentAuthorBooks)
  const clearCurrentAuthorBooks = useCurrentAuthorBooksStore(
    (state) => state.clearCurrentAuthorBooks
  )

  useEffect(() => {
    const getAuthorBooks = async () => {
      setIsLoading(true)
      try {
        const limit = 5
        const response = await axios.get(`/api/authors/${slug}/books`, {
          params: { page: booksPage, limit },
        })
        clearCurrentAuthorBooks()
        setCurrentAuthorBooks(response.data.books)
        setTotalPages(response.data.totalPages)
      } catch (error) {
        console.error("Error fetching author books:", error)
        toast.error("Failed to fetch author's books. Please try again.")
      } finally {
        setIsLoading(false)
      }
    }

    getAuthorBooks()
  }, [slug, booksPage])

  return { isLoading, totalPages }
}
