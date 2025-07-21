import { useNavigate, useParams } from "react-router-dom"
import { useUserStore } from "../../../lib/store/userStore"
import useAxiosInterceptor from "../../../lib/hooks/useAxiosInterceptor"

function AxiosInterceptor({ children }) {
  const navigate = useNavigate()
  const { lang } = useParams()
  const logout = useUserStore((state) => state.logout)

  useAxiosInterceptor(navigate, lang, logout)

  return children
}

export default AxiosInterceptor
