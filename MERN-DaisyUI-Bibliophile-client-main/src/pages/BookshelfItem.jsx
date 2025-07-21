import { useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { useTranslation } from "react-i18next"
import axios from "axios"
import { toast } from "react-toastify"
import { useCurrentBookshelfItemStore } from "../lib/store/currentBookshelfItemStore"
import { useNavigationUtils } from "../lib/hooks/useNavigation"
import { useUserStore } from "../lib/store/userStore"
import Loader from "../components/Shared/Loader/Loader"
import NoItemSelected from "../components/Shared/NoItems/NoItemSelected"
import ConfirmationModal from "../components/Shared/Modals/ConfirmationModal"
import BookshelfItemCover from "../components/Pages/BookshelfItemPage/BookshelfItemCover"
import BookshelfItemAuthor from "../components/Pages/BookshelfItemPage/BookshelfItemAuthor"
import BookshelfItemSummary from "../components/Pages/BookshelfItemPage/BookshelfItemSummary"
import DetailsCollapse from "../components/Shared/Collapses/DetailsCollapse"
import BookshelfItemEditForm from "../components/Pages/BookshelfItemPage/BookshelfItemEditForm"
import DeleteButton from "../components/Shared/Buttons/DeleteButton"
import LabeledBackButton from "../components/Shared/Buttons/LabeledBackButton"
import { useBookshelfItemInfo } from "../lib/hooks/useBookshelfItemInfo"

function BookshelfItem() {
  const { t } = useTranslation()
  const { slug } = useParams()
  const navigate = useNavigate()

  const { handleBackClick } = useNavigationUtils()

  const [loadedImages, setLoadedImages] = useState({})
  const [isDeleting, setIsDeleting] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)

  const setCurrentBookshelfItem = useCurrentBookshelfItemStore(
    (state) => state.setCurrentBookshelfItem
  )
  const clearCurrentBookshelfItem = useCurrentBookshelfItemStore(
    (state) => state.clearCurrentBookshelfItem
  )

  const currentUser = useUserStore((state) => state.currentUser)
  const userId = currentUser?._id

  const { isLoading, currentBookshelfItem } = useBookshelfItemInfo(slug)

  const handleImageLoad = (currentBookshelfItemId) => {
    setLoadedImages((prev) => ({ ...prev, [currentBookshelfItemId]: true }))
  }

  const handleDelete = async () => {
    setIsDeleting(true)
    try {
      await axios.delete(`/api/bookshelves/${userId}/${currentBookshelfItem._id}`)
      toast.success("Bookshelf item deleted successfully!")
      navigate(-1)
    } catch (error) {
      console.error("Error deleting bookshelf item:", error)
      toast.error("Failed to delete bookshelf item. Please try again.")
    } finally {
      setIsDeleting(false)
      setIsDeleteModalOpen(false)
    }
  }

  const onSubmit = async (data) => {
    try {
      const response = await axios.patch(
        `/api/bookshelves/${userId}/${currentBookshelfItem._id}`,
        data
      )
      // Merge the response data with the existing currentBookshelfItem
      const updatedBookshelfItem = {
        ...currentBookshelfItem,
        ...response.data,
      }
      clearCurrentBookshelfItem()
      setCurrentBookshelfItem(updatedBookshelfItem)
      toast.success("Bookshelf item updated successfully!")
      setIsEditing(false)
    } catch (error) {
      console.error("Error updating bookshelf item:", error)
      toast.error("Failed to update bookshelf item. Please try again.")
    }
  }

  if (isLoading || isDeleting) {
    return <Loader />
  }

  if (!currentBookshelfItem || !slug) {
    return (
      <NoItemSelected
        noItemSelectedKey="bookshelfPage.bookshelfItem.noBookSelected"
        backButtonKey="common.backToBookshelf"
      />
    )
  }

  return (
    <main className="flex flex-col items-center justify-center pb-20">
      <BookshelfItemCover loadedImages={loadedImages} handleImageLoad={handleImageLoad} />

      <BookshelfItemAuthor />

      <div className="divider my-0 w-80 self-center"></div>

      <section className="flex w-80 flex-col gap-2">
        <BookshelfItemSummary />

        <DetailsCollapse itemType="bookshelfItem" />

        <BookshelfItemEditForm
          onSubmit={onSubmit}
          isEditing={isEditing}
          setIsEditing={setIsEditing}
        />
      </section>
      <section className="my-4 flex w-80 gap-2">
        <DeleteButton onClick={() => setIsDeleteModalOpen(true)} />

        <LabeledBackButton onClick={handleBackClick} />
      </section>

      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        title={t("bookshelfPage.bookshelfItem.deleteConfirm")}
        message={t("bookshelfPage.bookshelfItem.deleteConfirmMessage")}
        onConfirm={handleDelete}
        onCancel={() => setIsDeleteModalOpen(false)}
        confirmText={t("common.delete")}
        confirmButtonClass="btn-error"
      />
    </main>
  )
}

export default BookshelfItem
