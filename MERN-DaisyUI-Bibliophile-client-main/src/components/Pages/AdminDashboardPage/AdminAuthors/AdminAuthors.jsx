import { useState, useEffect } from "react"
import { useLocation, useNavigate, useParams } from "react-router-dom"
import { useSearchStore } from "../../../../lib/store/searchStore"
import { useCurrentEditAuthorStore } from "../../../../lib/store/currentEditAuthorStore"
import CommonSearchForm from "../../../../components/Search/CommonSearchForm"
import Pagination from "../../../../components/Shared/Pagination/Pagination"
import Loader from "../../../../components/Shared/Loader/Loader"
import { useAuthors } from "../../../../lib/hooks/useAuthors"
import AdminAuthorsList from "./AdminAuthorsList"

function AdminAuthors() {
  const { lang } = useParams()
  const location = useLocation()
  const navigate = useNavigate()
  const [authorsPage, setAuthorsPage] = useState(1)

  const searchResults = useSearchStore((state) => state.searchResults)
  const searchResultsPage = useSearchStore((state) => state.searchResultsPage)
  const searchTotalPages = useSearchStore((state) => state.searchTotalPages)
  const clearSearch = useSearchStore((state) => state.clearSearch)
  const setCurrentEditAuthor = useCurrentEditAuthorStore((state) => state.setCurrentEditAuthor)
  const clearCurrentEditAuthor = useCurrentEditAuthorStore((state) => state.clearCurrentEditAuthor)

  const { authors, totalPages, isLoading } = useAuthors(authorsPage)

  useEffect(() => {
    return () => {
      // Clear search results when the component unmounts
      clearSearch()
    }
  }, [])

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setAuthorsPage(newPage)
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

  const handleEditAuthorClick = (author) => {
    clearCurrentEditAuthor()
    setCurrentEditAuthor(author)
    navigate(`/${lang}/edit-author/${author._id}`)
  }

  if (isLoading) {
    return <Loader />
  }

  return (
    <main className="flex flex-col items-center justify-center pb-20">
      <CommonSearchForm searchType="authors" />

      <section className="">
        {searchResults?.length > 0 ? (
          <div className="w-80 p-1">
            <AdminAuthorsList authors={searchResults} onAuthorClick={handleEditAuthorClick} />

            <Pagination
              currentPage={searchResultsPage}
              totalPages={searchTotalPages}
              onPageChange={handleSearchPageChange}
              className="mt-3"
            />
          </div>
        ) : (
          <div className="w-80 p-1">
            <AdminAuthorsList authors={authors} onAuthorClick={handleEditAuthorClick} />

            <Pagination
              className="mt-4 mb-2"
              currentPage={authorsPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        )}
      </section>
    </main>
  )
}

export default AdminAuthors
