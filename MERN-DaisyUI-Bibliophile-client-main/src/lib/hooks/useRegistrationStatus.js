import { useState, useEffect } from "react"
import { toast } from "react-toastify"
import axios from "axios"

export const useRegistrationStatus = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const getRegistrationStatus = async () => {
    setIsLoading(true)
    try {
      const response = await axios.get("/api/registration/registration-status")
      setIsOpen(response.data.status.isOpen)
    } catch (error) {
      console.error("Error fetching registration status:", error)
      toast.error("Error fetching registration status:", error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    getRegistrationStatus()
  }, [])

  return { isOpen, isLoading, getRegistrationStatus }
}
