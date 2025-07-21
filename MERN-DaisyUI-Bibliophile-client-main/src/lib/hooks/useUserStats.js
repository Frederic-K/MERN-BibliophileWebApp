import { useState, useEffect } from "react"
import axios from "axios"
import { toast } from "react-toastify"

export const useUserStats = () => {
  const [stats, setStats] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const getStats = async () => {
      setIsLoading(true)
      try {
        const response = await axios.get("/api/stats")
        setStats(response.data)
      } catch (error) {
        console.error("Error fetching user statistics:", error)
        toast.error("Failed to fetch user statistics. Please try again later.")
      } finally {
        setIsLoading(false)
      }
    }

    getStats()
  }, [])

  return { stats, isLoading }
}
