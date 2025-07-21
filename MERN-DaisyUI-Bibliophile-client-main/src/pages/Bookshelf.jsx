import { useState } from "react"
import { useLocation, useNavigate, useParams } from "react-router-dom"
import { useUserStore } from "../lib/store/userStore"
import { useSearchStore } from "../lib/store/searchStore"
import { useCurrentBookshelfItemStore } from "../lib/store/currentBookshelfItemStore"
import AdvancedSearchForm from "../components/Search/AdvancedSearchForm"
import PageHeader from "../components/Shared/PageHeaders/PageHeader"
import Pagination from "../components/Shared/Pagination/Pagination"
import Loader from "../components/Shared/Loader/Loader"
import BookshelfCard from "../components/Pages/BookshelfPage/BookshelfCard"
import { useBookshelfItems } from "../lib/hooks/useBookshelfItems"

function Bookshelf() {
  const { lang } = useParams()
  const location = useLocation()
  const navigate = useNavigate()

  const { currentUser } = useUserStore()
  const userId = currentUser?._id

  const [itemsPage, setItemsPage] = useState(1)
  const [loadedImages, setLoadedImages] = useState({})

  const itemsPerPage = 5

  const searchResults = useSearchStore((state) => state.searchResults)
  const searchResultsPage = useSearchStore((state) => state.searchResultsPage)
  const searchTotalPages = useSearchStore((state) => state.searchTotalPages)

  const setCurrentBookshelfItem = useCurrentBookshelfItemStore(
    (state) => state.setCurrentBookshelfItem
  )
  const clearCurrentBookshelfItem = useCurrentBookshelfItemStore(
    (state) => state.clearCurrentBookshelfItem
  )

  const { items, totalPages, isLoading } = useBookshelfItems(userId, itemsPage, itemsPerPage)

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setItemsPage(newPage)
    }
  }

  const handleSearchPageChange = (newPage) => {
    if (newPage >= 1 && newPage <= searchTotalPages) {
      const queryParams = new URLSearchParams(location.search)
      queryParams.set("page", newPage.toString())
      if (!queryParams.has("limit")) {
        queryParams.set("limit", "5")
      }
      navigate(`${location.pathname}?${queryParams.toString()}`, { replace: true })
    }
  }

  const handleImageLoad = (itemId) => {
    setLoadedImages((prev) => ({ ...prev, [itemId]: true }))
  }

  const openItemPage = (item) => {
    if (item) {
      clearCurrentBookshelfItem()
      setCurrentBookshelfItem(item)
      navigate(`/${lang}/bookshelfItem/${item.bookDetails.slug}`)
    }
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
              d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0 0 12 9.75c-2.551 0-5.056.2-7.5.582V21M3 21h18M12 6.75h.008v.008H12V6.75Z"
            />
          </svg>
        }
        titleKey="bookshelfPage.title"
        descriptionKey="bookshelfPage.description"
      />

      <AdvancedSearchForm searchType="bookshelf" />

      <section className="w-80">
        {searchResults?.length > 0 ? (
          <div className="mt-1 flex w-full flex-col gap-4">
            {searchResults.map((item) => (
              <BookshelfCard
                key={item.bookDetails._id}
                item={item}
                loadedImages={loadedImages}
                handleImageLoad={handleImageLoad}
                openItemPage={openItemPage}
              />
            ))}
            <Pagination
              className="mb-3"
              currentPage={searchResultsPage}
              totalPages={searchTotalPages}
              onPageChange={handleSearchPageChange}
            />
          </div>
        ) : (
          <div className="mt-1 flex w-full flex-col gap-4">
            {items.map((item) => (
              <BookshelfCard
                key={item.bookDetails._id}
                item={item}
                loadedImages={loadedImages}
                handleImageLoad={handleImageLoad}
                openItemPage={openItemPage}
              />
            ))}
            <Pagination
              className="mb-3"
              currentPage={itemsPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        )}
      </section>
    </main>
  )
}

export default Bookshelf
