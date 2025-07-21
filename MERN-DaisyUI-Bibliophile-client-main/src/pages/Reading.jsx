import { useState } from "react"
import { useLocation, useNavigate, useParams } from "react-router-dom"
import { toast } from "react-toastify"
import { useSearchStore } from "../lib/store/searchStore"
import { useUserStore } from "../lib/store/userStore"
import { useCurrentBookshelfItemStore } from "../lib/store/currentBookshelfItemStore"
import PageHeader from "../components/Shared/PageHeaders/PageHeader"
import Pagination from "../components/Shared/Pagination/Pagination"
import Loader from "../components/Shared/Loader/Loader"
import BookshelfitemCard from "../components/Pages/ReadingPage/BookshelfItemCard"
import AdvancedSearchForm from "../components/Search/AdvancedSearchForm"
import { useReadingEntries } from "../lib/hooks/useReadingEntries"
import EditBookshelfItemForm from "../components/Pages/ReadingPage/EditBookshelfItemForm"

function Reading() {
  const { lang } = useParams()
  const location = useLocation()
  const navigate = useNavigate()
  const updateSearchResult = useSearchStore((state) => state.updateSearchResult)
  const searchResults = useSearchStore((state) => state.searchResults)
  const searchResultsPage = useSearchStore((state) => state.searchResultsPage)
  const searchTotalPages = useSearchStore((state) => state.searchTotalPages)
  const setCurrentBookshelfItem = useCurrentBookshelfItemStore(
    (state) => state.setCurrentBookshelfItem
  )
  const clearCurrentBookshelfItem = useCurrentBookshelfItemStore(
    (state) => state.clearCurrentBookshelfItem
  )
  const { currentUser } = useUserStore()
  const [itemsPage, setItemsPage] = useState(1)
  const [loadedImages, setLoadedImages] = useState({})
  const [isEditFormOpen, setIsEditFormOpen] = useState(null)

  const userId = currentUser?._id
  const itemsPerPage = 5

  const { items, totalPages, isLoading, updateItem } = useReadingEntries(
    userId,
    itemsPage,
    itemsPerPage
  )

  const handleImageLoad = (itemId) => {
    setLoadedImages((prev) => ({ ...prev, [itemId]: true }))
  }

  const onItemUpdateSubmit = async (data, item) => {
    try {
      const updatedItem = await updateItem(item._id, data)

      if (searchResults?.length > 0) {
        updateSearchResult(item._id, updatedItem)
      }

      toast.success("Bookshelf item updated successfully!")
      setIsEditFormOpen(null)
    } catch (error) {
      console.error("Error updating bookshelf item:", error)
      toast.error("Failed to update bookshelf item. Please try again.")
    }
  }

  const handleDetailsOpen = (item) => {
    setIsEditFormOpen(item._id)
  }

  const handleViewFullInformation = (item) => {
    clearCurrentBookshelfItem()
    setCurrentBookshelfItem(item)
    navigate(`/${lang}/bookshelfItem/${item.bookDetails.slug}`)
  }

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

  if (isLoading) {
    return <Loader />
  }

  const renderBookshelfItems = (items) => {
    return items.map((item) => {
      if (!item || !item.bookDetails) return null

      return (
        <div key={item.bookDetails._id} className="relative">
          <BookshelfitemCard
            item={item}
            loadedImages={loadedImages}
            handleImageLoad={handleImageLoad}
            handleDetailsOpen={handleDetailsOpen}
            isEditFormOpen={isEditFormOpen}
          />
          {isEditFormOpen === item._id && (
            <EditBookshelfItemForm
              item={item}
              onSubmit={(data) => onItemUpdateSubmit(data, item)}
              onViewFullInfo={handleViewFullInformation}
              setIsEditFormOpen={setIsEditFormOpen}
            />
          )}
        </div>
      )
    })
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
              d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25"
            />
          </svg>
        }
        titleKey={"readingPage.title"}
        descriptionKey={"readingPage.description"}
      />

      <AdvancedSearchForm searchType="bookshelf" />

      <section className="h-[2535px] w-80">
        {searchResults?.length > 0 ? (
          <div className="mt-1 flex flex-col gap-4">
            {renderBookshelfItems(searchResults)}
            <Pagination
              className="mb-3"
              currentPage={searchResultsPage}
              totalPages={searchTotalPages}
              onPageChange={handleSearchPageChange}
            />
          </div>
        ) : (
          <div className="mt-1 flex flex-col gap-4">
            {renderBookshelfItems(items)}
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

export default Reading
