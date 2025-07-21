import { useState, useEffect } from "react"
import axios from "axios"
import { useCurrentAuthorStore } from "../store/currentAuthorStore"
import { toast } from "react-toastify"

export const useAuthorInfo = (slug) => {
  const [isLoading, setIsLoading] = useState(false)

  const currentAuthor = useCurrentAuthorStore((state) => state.currentAuthor)
  const setCurrentAuthor = useCurrentAuthorStore((state) => state.setCurrentAuthor)
  const clearCurrentAuthor = useCurrentAuthorStore((state) => state.clearCurrentAuthor)

  useEffect(() => {
    const getAuthorInfo = async () => {
      setIsLoading(true)
      try {
        if (!currentAuthor || currentAuthor.slug !== slug) {
          const response = await axios.get(`/api/authors/${slug}`)
          clearCurrentAuthor()
          setCurrentAuthor(response.data)
        }
      } catch (error) {
        console.error("Error fetching author info:", error)
        toast.error("Failed to fetch author information. Please try again.")
        throw error
      } finally {
        setIsLoading(false)
      }
    }

    getAuthorInfo()
  }, [slug])

  return { isLoading, currentAuthor }
}
