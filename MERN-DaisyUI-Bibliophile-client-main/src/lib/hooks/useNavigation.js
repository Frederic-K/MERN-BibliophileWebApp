import { useNavigate } from "react-router-dom"

export const useNavigationUtils = () => {
  const navigate = useNavigate()

  const handleBackClick = () => {
    navigate(-1)
  }

  const handleForwardClick = () => {
    navigate(1)
  }

  return { handleBackClick, handleForwardClick }
}
