import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { toast } from "react-toastify"
import axios from "axios"
import { useUserStore } from "../lib/store/userStore"
import PageHeader from "../components/Shared/PageHeaders/PageHeader"
import CreateBookForm from "../components/Pages/CreateBookPage/CreateBookForm"

function CreateBook() {
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()

  const currentUser = useUserStore((state) => state.currentUser)

  useEffect(() => {
    if (!currentUser || !currentUser.role.includes("admin")) {
      toast.error("You don't have permission to access this page")
      navigate("/")
    }
  }, [currentUser, navigate])

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

      const createBookResponse = await axios.post("/api/books", bookData)
      const bookId = createBookResponse.data._id

      if (coverBookImage) {
        const formData = new FormData()
        formData.append("coverBookImage", coverBookImage)

        try {
          await axios.post(`/api/books/${bookId}/upload-cover`, formData, {
            headers: { "Content-Type": "multipart/form-data" },
          })
        } catch (uploadError) {
          console.error("Error uploading cover image:", uploadError)
          toast.error("Failed to upload cover image. The book was created without a custom cover.")
        }
      }

      toast.success("Book created successfully!")
      navigate(`/book/${bookId}`)
    } catch (error) {
      console.error("Error creating book:", error.response?.data?.message || error.message)
      toast.error("Failed to create book. Please try again.")
    } finally {
      setIsLoading(false)
    }
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
        titleKey={"bookPage.createBookPage.title"}
        descriptionKey={"bookPage.createBookPage.description"}
      />

      <section className="mt-4">
        <CreateBookForm onSubmit={handleSubmit} isLoading={isLoading} />
      </section>
    </main>
  )
}

export default CreateBook
