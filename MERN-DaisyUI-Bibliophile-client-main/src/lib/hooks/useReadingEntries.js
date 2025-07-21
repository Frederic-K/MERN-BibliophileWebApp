import { useState, useEffect } from "react"
import axios from "axios"
import { toast } from "react-toastify"

export const useReadingEntries = (userId, itemsPage, itemsPerPage) => {
  const [items, setItems] = useState([])
  const [totalPages, setTotalPages] = useState(0)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const getReadingEntries = async () => {
      if (!userId) {
        console.error("No user ID available")
        toast.error("User information is not available. Please log in again.")
        return
      }

      setIsLoading(true)
      try {
        const response = await axios.get(`/api/bookshelves/${userId}/reading-dashboard`, {
          params: {
            page: itemsPage,
            limit: itemsPerPage,
            sortBy: "readStatus",
            sortOrder: "asc",
          },
        })

        setItems(response.data.items || [])
        setTotalPages(response.data.totalPages)
      } catch (error) {
        console.error("Error fetching reading list:", error)
        toast.error("An error occurred while fetching items. Please try again.")
      } finally {
        setIsLoading(false)
      }
    }

    getReadingEntries()
  }, [userId, itemsPage])

  const updateItem = async (itemId, data) => {
    try {
      const response = await axios.patch(`/api/bookshelves/${userId}/${itemId}`, data)
      setItems((prevItems) =>
        prevItems.map((item) => (item._id === itemId ? { ...item, ...response.data } : item))
      )
      return response.data
    } catch (error) {
      console.error("Error updating bookshelf item:", error)
      throw error
    }
  }

  return { items, totalPages, isLoading, updateItem }
}
