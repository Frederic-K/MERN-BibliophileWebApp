import { useState, useEffect } from "react"
import { useLocation, useNavigate, useParams } from "react-router-dom"
import { useTranslation } from "react-i18next"
import { useSearchStore } from "../lib/store/searchStore"
import { useCurrentBookStore } from "../lib/store/currentBookStore"
import CommonSearchForm from "../components/Search/CommonSearchForm"
import PageHeader from "../components/Shared/PageHeaders/PageHeader"
import Pagination from "../components/Shared/Pagination/Pagination"
import Loader from "../components/Shared/Loader/Loader"
import LibraryBookList from "../components/Pages/LibraryPage/LibraryBookList"
import { useBooks } from "../lib/hooks/useBooks"

function Library() {
  const { t } = useTranslation()
  const { lang } = useParams()
  const location = useLocation()
  const navigate = useNavigate()
  const [booksPage, setBooksPage] = useState(1)
  const [loadedImages, setLoadedImages] = useState({})

  const searchResults = useSearchStore((state) => state.searchResults)
  const searchResultsPage = useSearchStore((state) => state.searchResultsPage)
  const searchTotalPages = useSearchStore((state) => state.searchTotalPages)
  const clearSearch = useSearchStore((state) => state.clearSearch)
  const setCurrentBook = useCurrentBookStore((state) => state.setCurrentBook)
  const clearCurrentBook = useCurrentBookStore((state) => state.clearCurrentBook)

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

  const handleBookDetailsClick = (book) => {
    clearCurrentBook()
    setCurrentBook(book)
    navigate(`/${lang}/book/${book.slug}`)
  }

  if (isLoading) {
    return <Loader />
  }

  return (
    <main className="flex flex-col items-center justify-center pb-20">
      <PageHeader
        icon={
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="size-16"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M13.5 21v-7.5a.75.75 0 0 1 .75-.75h3a.75.75 0 0 1 .75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349M3.75 21V9.349m0 0a3.001 3.001 0 0 0 3.75-.615A2.993 2.993 0 0 0 9.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 0 0 2.25 1.016c.896 0 1.7-.393 2.25-1.015a3.001 3.001 0 0 0 3.75.614m-16.5 0a3.004 3.004 0 0 1-.621-4.72l1.189-1.19A1.5 1.5 0 0 1 5.378 3h13.243a1.5 1.5 0 0 1 1.06.44l1.19 1.189a3 3 0 0 1-.621 4.72M6.75 18h3.75a.75.75 0 0 0 .75-.75V13.5a.75.75 0 0 0-.75-.75H6.75a.75.75 0 0 0-.75.75v3.75c0 .414.336.75.75.75Z"
            />
          </svg>
        }
        titleKey={"libraryPage.title"}
        descriptionKey={"libraryPage.description"}
      />

      <CommonSearchForm searchType="books" />

      <section className="-mt-2">
        {searchResults?.length > 0 ? (
          <div className="w-80 p-1">
            <h2 className="mb-2 ml-1 font-bold">{t("libraryPage.results")}</h2>

            <LibraryBookList
              books={searchResults}
              onBookClick={handleBookDetailsClick}
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
            <h2 className="mb-2 ml-1 font-bold">{t("libraryPage.recentBooks")}</h2>

            <LibraryBookList
              books={books}
              onBookClick={handleBookDetailsClick}
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

export default Library
