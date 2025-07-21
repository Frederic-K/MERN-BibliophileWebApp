import { useEffect } from "react"
import axios from "axios"
import { useNavigate, useParams } from "react-router-dom"
import { useUserStore } from "../store/userStore"
import { toast } from "react-toastify"

const useAxiosInterceptor = () => {
  const navigate = useNavigate()
  const { lang } = useParams()
  const logout = useUserStore((state) => state.logout)

  useEffect(() => {
    const interceptor = axios.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response) {
          switch (error.response.status) {
            case 401:
              logout()
              navigate(`/${lang}/sign-in`)
              toast.error("Authentication failed. Please sign in again.")
              break
            case 403:
              navigate(`/${lang}/sign-in`)
              toast.error("You don't have permission to access this resource.")
              break
            case 400:
              toast.error("Bad request. Please try again.")
              break
            case 404:
              navigate(`/${lang}/not-found`)
              break
            case 500:
              navigate(`/${lang}/server-error`)
              toast.error("A server error occurred. Please try again later.")
              break
            case 503:
              navigate(`/${lang}/service-unavailable`)
              toast.error("The service is temporarily unavailable. Please try again later.")
              break
            default:
              toast.error("An unexpected error occurred. Please try again later.")
          }
        } else if (error.request) {
          // The request was made but no response was received
          navigate(`/${lang}/network-error`)
          toast.error("No response from server. Please check your internet connection.")
        } else {
          // Something happened in setting up the request that triggered an Error
          toast.error("An error occurred. Please try again later.")
        }
        return Promise.reject(error)
      }
    )

    // Cleanup function to remove the interceptor when the component unmounts
    return () => {
      axios.interceptors.response.eject(interceptor)
    }
  }, [navigate, lang, logout])
}

export default useAxiosInterceptor
