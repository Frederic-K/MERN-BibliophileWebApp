import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { useTranslation } from "react-i18next"
import { toast } from "react-toastify"
import axios from "axios"
import { useUserStore } from "../lib/store/userStore"
import { useCurrentEditBookStore } from "../lib/store/currentEditBookStore"
import PageHeader from "../components/Shared/PageHeaders/PageHeader"
import EditBookForm from "../components/Pages/AdminDashboardPage/AdminBooks/EditBookForm"
import Loader from "../components/Shared/Loader/Loader"
import NoItemSelected from "../components/Shared/NoItems/NoItemSelected"
import ConfirmationModal from "../components/Shared/Modals/ConfirmationModal"

function EditBook() {
  const { t } = useTranslation()
  const [isLoading, setIsLoading] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const navigate = useNavigate()
  const { lang, bookId } = useParams()

  const currentUser = useUserStore((state) => state.currentUser)
  const currentEditBook = useCurrentEditBookStore((state) => state.currentEditBook)

  useEffect(() => {
    if (!currentUser) {
      toast.error("You don't have permission to access this page")
      navigate("/")
    }
  }, [currentUser, navigate])

  if (!currentEditBook || !bookId) {
    return <NoItemSelected noItemSelectedKey="bookPage.noBookSelected" />
  }

  const handleSubmit = async (data, coverBookImage) => {
    setIsLoading(true)
    try {
      const bookData = {
        title: data.title,
        authors: [data.authorId],
        summary: data.summary,
        publishYear: data.publishYear,
        tags: data.tags,
        genre: data.genre,
        format: data.format,
        availability: data.availability,
        pageCount: data.pageCount,
        language: data.language,
      }

      await axios.patch(`/api/books/${bookId}`, bookData)

      if (coverBookImage) {
        const formData = new FormData()
        formData.append("coverBookImage", coverBookImage)

        try {
          await axios.post(`/api/books/${bookId}/upload-cover`, formData, {
            headers: { "Content-Type": "multipart/form-data" },
          })
        } catch (uploadError) {
          console.error("Error uploading cover image:", uploadError)
          toast.error(
            "Failed to upload cover image. The book was updated without changing the cover."
          )
        }
      }

      toast.success("Book updated successfully!")
      navigate(`/${lang}/book/${bookId}`)
    } catch (error) {
      console.error("Error updating book:", error.response?.data?.message || error.message)
      toast.error("Failed to update book. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async () => {
    setIsLoading(true)
    try {
      await axios.delete(`/api/books/${bookId}`)
      toast.success("Book deleted successfully!")
      navigate(`/${lang}/admin-dashboard/books`)
    } catch (error) {
      console.error("Error deleting book:", error.response?.data?.message || error.message)
      toast.error("Failed to delete book. Please try again.")
    } finally {
      setIsLoading(false)
      setIsDeleteModalOpen(false)
    }
  }

  if (isLoading) {
    return <Loader />
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center pb-20">
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
              d="M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m3-9h3.375c.621 0 1.125.504 1.125 1.125V18a2.25 2.25 0 0 1-2.25 2.25M16.5 7.5V18a2.25 2.25 0 0 0 2.25 2.25M16.5 7.5V4.875c0-.621-.504-1.125-1.125-1.125H4.125C3.504 3.75 3 4.254 3 4.875V18a2.25 2.25 0 0 0 2.25 2.25h13.5M6 7.5h3v3H6v-3Z"
            />
          </svg>
        }
        titleKey={"bookPage.editBookPage.title"}
        descriptionKey={"bookPage.editBookPage.description"}
      />

      <section className="mt-4">
        <EditBookForm
          onSubmit={handleSubmit}
          isLoading={isLoading}
          onDeleteClick={() => setIsDeleteModalOpen(true)}
        />
      </section>

      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        title={t("bookPage.editBookPage.delete")}
        message={t("bookPage.editBookPage.confirmDelete")}
        onConfirm={handleDelete}
        onCancel={() => setIsDeleteModalOpen(false)}
        confirmText={t("common.delete")}
        confirmButtonClass="btn-error"
      />
    </main>
  )
}

export default EditBook
