import { useState, useEffect } from "react"
import axios from "axios"
import { toast } from "react-toastify"

export const useBooks = (booksPage) => {
  const [books, setBooks] = useState([])
  const [totalPages, setTotalPages] = useState(1)
  const [isLoading, setIsLoading] = useState(false)

  // Define the author fields you want to fetch
  const authorFields = ["firstName", "lastName"]

  useEffect(() => {
    const getBooks = async () => {
      setIsLoading(true)
      try {
        const authorInfo = authorFields.join("+")
        const response = await axios.get("/api/books", {
          params: {
            limit: 10,
            page: booksPage,
            authorInfo,
          },
        })
        setBooks(response.data.books)
        setTotalPages(response.data.totalPages)
      } catch (error) {
        console.error("Error getting books:", error)
        toast.error("An error occurred while fetching books. Please try again.")
      } finally {
        setIsLoading(false)
      }
    }

    getBooks()
  }, [booksPage])

  return { books, totalPages, isLoading }
}
