import { useState, useEffect } from "react"
import axios from "axios"
import { toast } from "react-toastify"

export const useUsers = (usersPage) => {
  const [users, setUsers] = useState([])
  const [totalPages, setTotalPages] = useState(1)
  const [isLoading, setIsLoading] = useState(false)

  // Define the user fields you want to fetch
  const userFields = ["userName", "email", "profileImage", "role"]

  useEffect(() => {
    const getUsers = async () => {
      setIsLoading(true)
      try {
        const userInfo = userFields.join("+")
        const response = await axios.get("/api/users", {
          params: {
            limit: 10,
            page: usersPage,
            userInfo,
          },
        })
        setUsers(response.data.users)
        setTotalPages(response.data.totalPages)
      } catch (error) {
        console.error("Error getting users:", error)
        toast.error("An error occurred while fetching users. Please try again.")
      } finally {
        setIsLoading(false)
      }
    }

    getUsers()
  }, [usersPage])

  return { users, totalPages, isLoading }
}
