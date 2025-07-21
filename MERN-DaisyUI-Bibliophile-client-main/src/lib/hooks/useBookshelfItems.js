import { useState, useEffect } from "react"
import axios from "axios"
import { toast } from "react-toastify"

export const useBookshelfItems = (userId, itemsPage, itemsPerPage) => {
  const [items, setItems] = useState([])
  const [totalPages, setTotalPages] = useState(0)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const getBookshelfItems = async () => {
      if (!userId) return

      setIsLoading(true)
      try {
        const response = await axios.get(`/api/bookshelves/${userId}`, {
          params: { page: itemsPage, limit: itemsPerPage },
        })
        setItems(response.data.items || [])
        setTotalPages(response.data.totalPages)
      } catch (error) {
        console.error("Error fetching bookshelf:", error)
        toast.error("An error occurred while fetching items. Please try again.")
      } finally {
        setIsLoading(false)
      }
    }

    getBookshelfItems()
  }, [userId, itemsPage, itemsPerPage])

  return { items, totalPages, isLoading }
}
