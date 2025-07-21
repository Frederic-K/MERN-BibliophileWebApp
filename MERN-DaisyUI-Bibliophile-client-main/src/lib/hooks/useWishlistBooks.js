import { useEffect, useState } from "react"
import axios from "axios"
import { toast } from "react-toastify"
import { useWishlistStore } from "../store/wishlistStore"

export const useWishlistBooks = (userId) => {
  const { books, setBooks, isUnsaved } = useWishlistStore()
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const getAllBooks = async () => {
      if (!userId) {
        console.error("No user ID available")
        toast.error("User information is not available. Please log in again.")
        return
      }

      if (!isUnsaved) {
        setIsLoading(true)
        let getAllBooks = []
        let currentPage = 1
        let totalPages = 1

        try {
          while (currentPage <= totalPages) {
            const response = await axios.get(`/api/wishlists/${userId}`, {
              params: { page: currentPage, limit: 10 },
            })
            getAllBooks = [...getAllBooks, ...response.data.wishlistBooks]
            totalPages = response.data.totalPages
            currentPage++
          }
          setBooks(getAllBooks)
        } catch (error) {
          console.error("Error fetching wishlist:", error)
          toast.error("Failed to fetch wishlist. Please try again.")
        } finally {
          setIsLoading(false)
        }
      }
    }

    getAllBooks()
  }, [isUnsaved, setBooks, userId])

  return { books, isLoading }
}
