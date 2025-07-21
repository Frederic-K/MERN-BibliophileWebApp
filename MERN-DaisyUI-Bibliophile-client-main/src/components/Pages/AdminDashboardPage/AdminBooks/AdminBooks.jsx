import { useState, useEffect } from "react"
import { useLocation, useNavigate, useParams } from "react-router-dom"
import { useSearchStore } from "../../../../lib/store/searchStore"
import { useCurrentEditBookStore } from "../../../../lib/store/currentEditBookStore"
import CommonSearchForm from "../../../../components/Search/CommonSearchForm"
import Pagination from "../../../../components/Shared/Pagination/Pagination"
import Loader from "../../../../components/Shared/Loader/Loader"
import { useBooks } from "../../../../lib/hooks/useBooks"
import AdminBooksList from "./AdminBooksList"

function AdminBooks() {
  // lang will be used to navigate to book's management page
  const { lang } = useParams()
  const location = useLocation()
  const navigate = useNavigate()
  const [booksPage, setBooksPage] = useState(1)
  const [loadedImages, setLoadedImages] = useState({})

  const searchResults = useSearchStore((state) => state.searchResults)
  const searchResultsPage = useSearchStore((state) => state.searchResultsPage)
  const searchTotalPages = useSearchStore((state) => state.searchTotalPages)
  const clearSearch = useSearchStore((state) => state.clearSearch)
  const setCurrentEditBook = useCurrentEditBookStore((state) => state.setCurrentEditBook)
  const clearCurrentEditBook = useCurrentEditBookStore((state) => state.clearCurrentEditBook)

  const { books, totalPages, isLoading } = useBooks(booksPage)

  useEffect(() => {
    return () => {
      // Clear search results when the component unmounts
      clearSearch()
    }
  }, [])

  const handleImageLoad = (bookId) => {
    setLoadedImages((prev) => ({ ...prev, [bookId]: true }))
  }

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setBooksPage(newPage)
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

  const handleEditBookClick = (book) => {
    clearCurrentEditBook()
    setCurrentEditBook(book)
    // navigate to the book edit page
    navigate(`/${lang}/edit-book/${book._id}`)
  }

  if (isLoading) {
    return <Loader />
  }

  return (
    <main className="flex flex-col items-center justify-center pb-20">
      <CommonSearchForm searchType="books" />

      <section className="">
        {searchResults?.length > 0 ? (
          <div className="w-80 p-1">
            <AdminBooksList
              books={searchResults}
              onBookClick={handleEditBookClick}
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
            <AdminBooksList
              books={books}
              onBookClick={handleEditBookClick}
              loadedImages={loadedImages}
              handleImageLoad={handleImageLoad}
            />
            <Pagination
              className="mt-4 mb-2"
              currentPage={booksPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        )}
      </section>
    </main>
  )
}

export default AdminBooks
