import { useParams } from "react-router-dom"
import AdminUsers from "./AdminUsers/AdminUsers"
import AdminAuthors from "./AdminAuthors/AdminAuthors"
import AdminBooks from "./AdminBooks/AdminBooks"

function AdminTabContent() {
  const { tab } = useParams()

  switch (tab) {
    case "users":
      return <AdminUsers />
    case "authors":
      return <AdminAuthors />
    case "books":
      return <AdminBooks />
    default:
      return <div>Invalid tab</div>
  }
}

export default AdminTabContent
