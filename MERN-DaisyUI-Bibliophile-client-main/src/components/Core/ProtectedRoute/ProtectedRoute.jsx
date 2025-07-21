import { Navigate, Outlet, useParams } from "react-router-dom"
import { useUserStore } from "../../../lib/store/userStore"

export function PrivateRoute() {
  const { lang } = useParams()

  const currentUser = useUserStore((state) => state.currentUser)
  return currentUser && currentUser.isAuthorized ? <Outlet /> : <Navigate to={`/${lang}/sign-in`} />
}

export function ManagementRoute() {
  const { lang } = useParams()

  const currentUser = useUserStore((state) => state.currentUser)

  return currentUser &&
    currentUser.isAuthorized &&
    (currentUser.role === "admin" || currentUser.role === "moderator") ? (
    <Outlet />
  ) : (
    <Navigate to={`/${lang}/sign-in`} />
  )
}
