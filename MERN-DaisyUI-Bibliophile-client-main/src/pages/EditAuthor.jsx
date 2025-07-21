import { useNavigate, useParams } from "react-router-dom"
import axios from "axios"
import { useTranslation } from "react-i18next"
import PageHeader from "../components/Shared/PageHeaders/PageHeader"
import ConfirmationModal from "../components/Shared/Modals/ConfirmationModal"
import { useCurrentEditAuthorStore } from "../lib/store/currentEditAuthorStore"
import { useEffect, useState } from "react"
import Loader from "../components/Shared/Loader/Loader"
import EditAuthorForm from "../components/Pages/AdminDashboardPage/AdminAuthors/EditAuthorForm"
import { useUserStore } from "../lib/store/userStore"
import { toast } from "react-toastify"
import NoItemSelected from "../components/Shared/NoItems/NoItemSelected"

function EditAuthor() {
  const { t } = useTranslation()
  const [isLoading, setIsLoading] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const navigate = useNavigate()
  const { lang, authorId } = useParams()

  const currentUser = useUserStore((state) => state.currentUser)
  const currentEditAuthor = useCurrentEditAuthorStore((state) => state.currentEditAuthor)

  const fallbackAuthorId = "68752a16555c735779e13b27"

  useEffect(() => {
    if (!currentUser) {
      toast.error("You don't have permission to access this page")
      navigate("/")
    }
  }, [currentUser, navigate])

  if (!currentEditAuthor || !authorId) {
    return <NoItemSelected noItemSelectedKey="authorPage.noAuthorSelected" />
  }

  const handleSubmit = async (data) => {
    setIsLoading(true)
    try {
      await axios.patch(`/api/authors/${authorId}`, data)
      toast.success("Author updated successfully!")
      navigate(`/${lang}/author/${authorId}`)
    } catch (error) {
      console.error("Error updating author:", error.response?.data?.message || error.message)
      toast.error("Failed to update author. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async () => {
    setIsLoading(true)
    try {
      await axios.delete(`/api/authors/${authorId}?fallbackAuthorId=${fallbackAuthorId}`)
      toast.success("Author deleted successfully!")
      navigate(`/${lang}/admin-dashboard/authors`)
    } catch (error) {
      console.error("Error deleting author:", error.response?.data?.message || error.message)
      toast.error("Failed to delete author. Please try again.")
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
              d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
            />
          </svg>
        }
        titleKey={"authorPage.editAuthorPage.title"}
        descriptionKey={"authorPage.editAuthorPage.description"}
      />

      <section className="mt-4">
        <EditAuthorForm
          onSubmit={handleSubmit}
          isLoading={isLoading}
          onDeleteClick={() => setIsDeleteModalOpen(true)}
        />
      </section>

      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        title={t("authorPage.editAuthorPage.delete")}
        message={t("authorPage.editAuthorPage.confirmDelete")}
        onConfirm={handleDelete}
        onCancel={() => setIsDeleteModalOpen(false)}
        confirmText={t("common.delete")}
        confirmButtonClass="btn-error"
      />
    </main>
  )
}

export default EditAuthor
