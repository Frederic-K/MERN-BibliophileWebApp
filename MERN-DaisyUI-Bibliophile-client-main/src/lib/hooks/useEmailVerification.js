import { useState, useEffect, useRef } from "react"
import axios from "axios"
import { useUserStore } from "../store/userStore"

export const useEmailVerification = (token) => {
  const [status, setStatus] = useState("pending")

  const verificationAttemptedRef = useRef(false)

  const setCurrentUser = useUserStore((state) => state.setCurrentUser)

  useEffect(() => {
    const verifyEmail = async () => {
      if (!token || verificationAttemptedRef.current) {
        return
      }

      verificationAttemptedRef.current = true

      try {
        const response = await axios.get(`/api/auth/verify-email/${token}`)
        switch (response.data.status) {
          case "verified":
            setStatus("verified")
            setCurrentUser({ email: response.data.email, isAuthorized: true })
            break
          case "already_verified":
            setStatus("already_verified")
            setCurrentUser({ email: response.data.email, isAuthorized: true })
            break
          default:
            setStatus("error")
        }
      } catch (error) {
        console.error("Email verification failed:", error)
        setStatus("error")
      }
    }

    verifyEmail()
  }, [token, setCurrentUser])

  return status
}
