import { useState, useEffect } from "react"
import axios from "axios"
import { toast } from "react-toastify"
import { useCurrentBookshelfItemStore } from "../store/currentBookshelfItemStore"
import { useUserStore } from "../store/userStore"

export const useBookshelfItemInfo = (slug) => {
  const [isLoading, setIsLoading] = useState(false)

  const currentBookshelfItem = useCurrentBookshelfItemStore((state) => state.currentBookshelfItem)
  const setCurrentBookshelfItem = useCurrentBookshelfItemStore(
    (state) => state.setCurrentBookshelfItem
  )
  const clearCurrentBookshelfItem = useCurrentBookshelfItemStore(
    (state) => state.clearCurrentBookshelfItem
  )

  const currentUser = useUserStore((state) => state.currentUser)
  const userId = currentUser?._id

  useEffect(() => {
    const getBookshelfItemInfo = async () => {
      if (!userId) {
        console.error("No user ID available")
        toast.error("User information is not available. Please log in again.")
        return
      }

      if (!currentBookshelfItem || currentBookshelfItem?.bookDetails?.slug !== slug) {
        setIsLoading(true)
        try {
          const response = await axios.get(`/api/bookshelves/${userId}/${slug}`)
          clearCurrentBookshelfItem()
          setCurrentBookshelfItem(response.data)
        } catch (error) {
          console.error("Error fetching bookshelf item info:", error)
          toast.error("Failed to fetch bookshelf item information. Please try again.")
          throw error // This allows the component to handle navigation if needed
        } finally {
          setIsLoading(false)
        }
      }
    }

    getBookshelfItemInfo()
  }, [slug])

  return { isLoading, currentBookshelfItem }
}
