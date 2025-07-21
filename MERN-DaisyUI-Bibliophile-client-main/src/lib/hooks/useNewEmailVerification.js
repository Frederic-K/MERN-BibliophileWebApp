import { useState, useEffect, useRef } from "react"
import axios from "axios"
import { useUserStore } from "../store/userStore"

export const useNewEmailVerification = (token) => {
  const [status, setStatus] = useState("already_verified")
  const verificationAttemptedRef = useRef(false)
  const setCurrentUser = useUserStore((state) => state.setCurrentUser)

  useEffect(() => {
    const verifyNewEmail = async () => {
      if (!token || verificationAttemptedRef.current) {
        return
      }

      verificationAttemptedRef.current = true

      try {
        const response = await axios.get(`/api/auth/verify-new-email/${token}`)
        switch (response.data.status) {
          case "verified":
            setStatus("verified")
            setCurrentUser({ email: response.data.email })
            break
          case "already_verified":
            setStatus("already_verified")
            setCurrentUser({ email: response.data.email })
            break
          default:
            setStatus("error")
        }
      } catch (error) {
        setStatus("error")
        console.error("New email verification failed:", error)
      }
    }

    verifyNewEmail()
  }, [token, setCurrentUser])

  return status
}
