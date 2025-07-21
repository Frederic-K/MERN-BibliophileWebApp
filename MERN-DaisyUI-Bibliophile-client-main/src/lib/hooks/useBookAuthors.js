import { useState, useEffect } from "react"
import axios from "axios"
import { toast } from "react-toastify"
import { useCurrentBookAuthorsStore } from "../store/currentBookAuthorsStore"

export const useBookAuthors = (slug, authorsPage) => {
  const [isLoading, setIsLoading] = useState(false)
  const [totalPages, setTotalPages] = useState(1)

  const setCurrentBookAuthors = useCurrentBookAuthorsStore((state) => state.setCurrentBookAuthors)
  const clearCurrentBookAuthors = useCurrentBookAuthorsStore(
    (state) => state.clearCurrentBookAuthors
  )

  useEffect(() => {
    const getBookAuthors = async () => {
      setIsLoading(true)
      try {
        const limit = 5
        const authorsResponse = await axios.get(`/api/books/${slug}/authors`, {
          params: { page: authorsPage, limit },
        })
        clearCurrentBookAuthors()
        setCurrentBookAuthors(authorsResponse.data.authors)
        setTotalPages(authorsResponse.data.totalPages)
      } catch (error) {
        console.error("Error fetching book authors:", error)
        toast.error("Failed to fetch book's authors. Please try again.")
      } finally {
        setIsLoading(false)
      }
    }

    getBookAuthors()
  }, [slug, authorsPage])

  return { isLoading, totalPages }
}
