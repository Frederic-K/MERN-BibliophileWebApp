import { useState, useEffect } from "react"
import axios from "axios"
import { toast } from "react-toastify"
import { useCurrentBookStore } from "../store/currentBookStore"

export const useBookInfo = (slug) => {
  const [isLoading, setIsLoading] = useState(false)
  const currentBook = useCurrentBookStore((state) => state.currentBook)
  const setCurrentBook = useCurrentBookStore((state) => state.setCurrentBook)
  const clearCurrentBook = useCurrentBookStore((state) => state.clearCurrentBook)

  useEffect(() => {
    const getBookInfo = async () => {
      if (!currentBook || currentBook.slug !== slug) {
        setIsLoading(true)
        try {
          const response = await axios.get(`/api/books/${slug}`)
          clearCurrentBook()
          setCurrentBook(response.data)
        } catch (error) {
          console.error("Error fetching book info:", error)
          toast.error("Failed to fetch book information. Please try again.")
          throw error // This allows the component to handle navigation if needed
        } finally {
          setIsLoading(false)
        }
      }
    }

    getBookInfo()
  }, [slug])

  return { isLoading, currentBook }
}
