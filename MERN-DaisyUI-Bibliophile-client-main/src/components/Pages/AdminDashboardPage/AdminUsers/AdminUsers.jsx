import { useState, useEffect } from "react"
import { useLocation, useNavigate, useParams } from "react-router-dom"
import { useSearchStore } from "../../../../lib/store/searchStore"
import CommonSearchForm from "../../../Search/CommonSearchForm"
import Pagination from "../../../Shared/Pagination/Pagination"
import Loader from "../../../Shared/Loader/Loader"
import { useUsers } from "../../../../lib/hooks/useUsers"
import AdminUsersList from "./AdminUsersList"
import { useCurrentEditUserStore } from "../../../../lib/store/currentEditUserStore"

function AdminUsers() {
  const { lang } = useParams()
  const location = useLocation()
  const navigate = useNavigate()
  const [usersPage, setUsersPage] = useState(1)
  const [loadedImages, setLoadedImages] = useState({})

  const searchResults = useSearchStore((state) => state.searchResults)
  const searchResultsPage = useSearchStore((state) => state.searchResultsPage)
  const searchTotalPages = useSearchStore((state) => state.searchTotalPages)
  const clearSearch = useSearchStore((state) => state.clearSearch)
  const setCurrentEditUser = useCurrentEditUserStore((state) => state.setCurrentEditUser)
  const clearCurrentEditUser = useCurrentEditUserStore((state) => state.clearCurrentEditUser)

  const { users, totalPages, isLoading } = useUsers(usersPage)

  useEffect(() => {
    return () => {
      // Clear search results when the component unmounts
      clearSearch()
    }
  }, [])

  const handleImageLoad = (userId) => {
    setLoadedImages((prev) => ({ ...prev, [userId]: true }))
  }

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setUsersPage(newPage)
    }
  }

  const handleSearchPageChange = (newPage) => {
    if (newPage >= 1 && newPage <= searchTotalPages) {
      const queryParams = new URLSearchParams(location.search)
      queryParams.set("page", newPage.toString())
      if (!queryParams.has("limit")) {
        queryParams.set("limit", "10")
      }
      navigate(`${location.pathname}?${queryParams.toString()}`, { replace: true })
    }
  }

  const handleEditUsertClick = (user) => {
    clearCurrentEditUser()
    setCurrentEditUser(user)
    navigate(`/${lang}/edit-user/${user._id}`)
  }

  if (isLoading) {
    return <Loader />
  }

  return (
    <main className="flex flex-col items-center justify-center pb-20">
      <CommonSearchForm searchType="users" />

      <section className="">
        {searchResults?.length > 0 ? (
          <div className="w-80 p-1">
            <AdminUsersList
              users={searchResults}
              onUserClick={handleEditUsertClick}
              loadedImages={loadedImages}
              handleImageLoad={handleImageLoad}
            />

            <Pagination
              currentPage={searchResultsPage}
              totalPages={searchTotalPages}
              onPageChange={handleSearchPageChange}
              className="mt-3"
            />
          </div>
        ) : (
          <div className="w-80 p-1">
            <AdminUsersList
              users={users}
              onUserClick={handleEditUsertClick}
              loadedImages={loadedImages}
              handleImageLoad={handleImageLoad}
            />
            <Pagination
              className="mt-4 mb-2"
              currentPage={usersPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        )}
      </section>
    </main>
  )
}

export default AdminUsers
