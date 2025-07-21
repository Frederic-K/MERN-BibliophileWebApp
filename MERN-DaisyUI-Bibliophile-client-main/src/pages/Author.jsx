import { useState } from "react"
import { useParams } from "react-router-dom"
import Pagination from "../components/Shared/Pagination/Pagination"
import Loader from "../components/Shared/Loader/Loader"
import NoItemSelected from "../components/Shared/NoItems/NoItemSelected"
import NoItemFound from "../components/Shared/NoItems/NoItemFound"
import AuthorHeader from "../components/Pages/AuthorPage/AuthorHeader"
import AuthorBio from "../components/Pages/AuthorPage/AuthorBio"
import AuthorBooks from "../components/Pages/AuthorPage/AuthorBooks"
import { useAuthorInfo } from "../lib/hooks/useAuthorInfo"
import { useAuthorBooks } from "../lib/hooks/useAuthorBooks"

function Author() {
  const { slug } = useParams()
  const [booksPage, setBooksPage] = useState(1)
  const [loadedImages, setLoadedImages] = useState({})

  const { isLoading: isLoadingAuthor, currentAuthor } = useAuthorInfo(slug)
  const { isLoading: isLoadingBooks, totalPages } = useAuthorBooks(slug, booksPage)

  const handleImageLoad = (bookId) => {
    setLoadedImages((prev) => ({ ...prev, [bookId]: true }))
  }

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setBooksPage(newPage)
    }
  }

  if (isLoadingAuthor || isLoadingBooks) {
    return <Loader />
  }

  if (!slug) {
    return <NoItemSelected noItemSelectedKey="authorPage.noAuthorSelected" />
  }

  if (!currentAuthor) {
    return <NoItemFound noItemFoundKey="authorPage.noAuthorFounded" />
  }

  return (
    <main className="mx-auto flex min-h-screen w-80 flex-col items-center justify-center pb-20">
      <AuthorHeader />

      <AuthorBio />

      <AuthorBooks loadedImages={loadedImages} handleImageLoad={handleImageLoad} />

      <Pagination
        className="mt-4 mb-4"
        currentPage={booksPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </main>
  )
}

export default Author
