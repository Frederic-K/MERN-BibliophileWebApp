import { useState, useEffect } from "react"
import axios from "axios"
import { toast } from "react-toastify"

export const useAuthors = (authorsPage) => {
  const [authors, setAuthors] = useState([])
  const [totalPages, setTotalPages] = useState(1)
  const [isLoading, setIsLoading] = useState(false)

  // Define the book fields you want to fetch
  const bookFields = ["title"]

  useEffect(() => {
    const getAuthors = async () => {
      setIsLoading(true)
      try {
        const bookInfo = bookFields.join("+")
        const response = await axios.get("/api/authors", {
          params: {
            limit: 10,
            page: authorsPage,
            // Adjust this based on what book info you want
            // or comment out if you don't need it
            bookInfo,
          },
        })
        setAuthors(response.data.authors)
        setTotalPages(response.data.totalPages)
      } catch (error) {
        console.error("Error getting authors:", error)
        toast.error("An error occurred while fetching authors. Please try again.")
      } finally {
        setIsLoading(false)
      }
    }

    getAuthors()
  }, [authorsPage])

  return { authors, totalPages, isLoading }
}
