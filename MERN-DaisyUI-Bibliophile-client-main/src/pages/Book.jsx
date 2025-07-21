import { useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { useTranslation } from "react-i18next"
import axios from "axios"
import { toast } from "react-toastify"
import { useUserStore } from "../lib/store/userStore"
import Loader from "../components/Shared/Loader/Loader"
import Pagination from "../components/Shared/Pagination/Pagination"
import NoItemSelected from "../components/Shared/NoItems/NoItemSelected"
import NoItemFound from "../components/Shared/NoItems/NoItemFound"
import BookOverview from "../components/Pages/BookPage/BookOverview"
import BookAuthors from "../components/Pages/BookPage/BookAuthors"
import BookDetails from "../components/Pages/BookPage/BookDetails"
import BookCard from "../components/Pages/BookPage/BookCard"
import { useBookInfo } from "../lib/hooks/useBookInfo"
import { useBookAuthors } from "../lib/hooks/useBookAuthors"

function Book() {
  const { t } = useTranslation()
  const { lang, slug } = useParams()
  const navigate = useNavigate()

  const currentUser = useUserStore((state) => state.currentUser)

  const [authorsPage, setAuthorsPage] = useState(1)

  const userId = currentUser?._id

  const { isLoading: isBookLoading, currentBook } = useBookInfo(slug)
  const { isLoading: isAuthorsLoading, totalPages } = useBookAuthors(slug, authorsPage)

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setAuthorsPage(newPage)
    }
  }

  const handleAddToBookshelf = async () => {
    if (!currentUser) {
      toast.error(t("common.loginRequired"))
      return
    }

    try {
      const response = await axios.post(`/api/bookshelves/${userId}`, {
        bookId: currentBook._id,
      })
      toast.success("Success adding book to bookshelf", response.data.message)
    } catch (error) {
      console.error("Error adding book to bookshelf:", error)
      const errorMessage = error.response?.data?.error?.message || "Error adding book to bookshelf"
      toast.error(errorMessage)
    }
  }

  const handleAuthorDetailsClick = (author) => {
    if (!author.slug) {
      console.error("Author slug is missing")
      toast.error("Unable to view author details. Please try again later.")
      return
    }
    navigate(`/${lang}/author/${author.slug}`)
  }

  if (isBookLoading || isAuthorsLoading) {
    return <Loader />
  }

  if (!slug) {
    return <NoItemSelected noItemSelectedKey="bookPage.noBookSelected" />
  }

  if (!currentBook) {
    return <NoItemFound noItemFoundKey="bookPage.noBookFound" />
  }

  return (
    <main className="flex flex-col items-center justify-center pb-20">
      <BookCard onAddToBookshelf={handleAddToBookshelf} />

      <BookOverview />

      <BookDetails />

      <BookAuthors onAuthorClick={handleAuthorDetailsClick} />

      {totalPages > 1 && (
        <Pagination
          className="mb-4"
          currentPage={authorsPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      )}
    </main>
  )
}

export default Book
