import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useTranslation } from "react-i18next"
import { bookSchema } from "../../../../lib/schemas/formSchemas"
import SubmitButton from "../../../Shared/Buttons/SubmitButton"
import ResetButton from "../../../Shared/Buttons/ResetButton"
import DeleteButton from "../../../Shared/Buttons/DeleteButton"
import ImageUploader from "../../CreateBookPage/ImageUploader"
import FloatingLabelField from "../../../Shared/FormField/FloatingLabelField"
import AuthorSuggestionList from "../../CreateBookPage/AuthorSuggestionList"
import useAuthorSearch from "../../../../lib/hooks/useAuthorSearch"
import EditBookFormCollapse from "./EditBookFormCollapse"
import { useCurrentEditBookStore } from "../../../../lib/store/currentEditBookStore"

function EditBookForm({ onSubmit, isLoading, onDeleteClick }) {
  const { t } = useTranslation()
  const currentEditBook = useCurrentEditBookStore((state) => state.currentEditBook)

  const [authorSelected, setAuthorSelected] = useState(true)
  const [coverBookImage, setCoverBookImage] = useState(null)
  const [imagePreview, setImagePreview] = useState(currentEditBook?.coverImage || null)

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm({
    resolver: zodResolver(bookSchema),
    defaultValues: {
      title: currentEditBook?.title || "",
      authorSearch: currentEditBook?.authors[0]
        ? `${currentEditBook.authors[0].firstName} ${currentEditBook.authors[0].lastName}`
        : "",
      authorId: currentEditBook?.authors[0]?._id || "",
      summary: currentEditBook?.summary || "",
      publishYear: currentEditBook?.publishYear || "",
      format: currentEditBook?.format || "digital",
      genre: currentEditBook?.genre?.join(", ") || "",
      tags: currentEditBook?.tags?.join(", ") || "",
      language: currentEditBook?.language || "",
      pageCount: currentEditBook?.pageCount || "",
      availability: currentEditBook?.availability || "available",
    },
  })

  // Using setValue instead of reset from React Hook form
  // useEffect(() => {
  //   if (currentEditBook) {
  //     setValue("title", currentEditBook.title)
  //     setValue(
  //       "authorSearch",
  //       `${currentEditBook.authors[0].firstName} ${currentEditBook.authors[0].lastName}`
  //     )
  //     setValue("authorId", currentEditBook.authors[0]._id)
  //     setValue("summary", currentEditBook.summary)
  //     setValue("publishYear", currentEditBook.publishYear)
  //     setValue("format", currentEditBook.format)
  //     setValue("genre", currentEditBook.genre.join(", "))
  //     setValue("tags", currentEditBook.tags.join(", "))
  //     setValue("language", currentEditBook.language)
  //     setValue("pageCount", currentEditBook.pageCount)
  //     setValue("availability", currentEditBook.availability)
  //     setImagePreview(currentEditBook.coverBookImage)
  //   }
  // }, [currentEditBook, setValue])

  useEffect(() => {
    if (currentEditBook) {
      reset({
        // title: currentEditBook.title,
        // authorSearch: `${currentEditBook.authors[0].firstName} ${currentEditBook.authors[0].lastName}`,
        // authorId: currentEditBook.authors[0]._id,
        // summary: currentEditBook.summary,
        // publishYear: currentEditBook.publishYear,
        // format: currentEditBook.format,
        // genre: currentEditBook.genre.join(", "),
        // tags: currentEditBook.tags.join(", "),
        // language: currentEditBook.language,
        // pageCount: currentEditBook.pageCount,
        // availability: currentEditBook.availability,
        title: currentEditBook?.title || "",
        authorSearch: currentEditBook?.authors[0]
          ? `${currentEditBook.authors[0].firstName} ${currentEditBook.authors[0].lastName}`
          : "",
        authorId: currentEditBook?.authors[0]?._id || "",
        summary: currentEditBook?.summary || "",
        publishYear: currentEditBook?.publishYear || "",
        format: currentEditBook?.format || "digital",
        genre: currentEditBook?.genre?.join(", ") || "",
        tags: currentEditBook?.tags?.join(", ") || "",
        language: currentEditBook?.language || "",
        pageCount: currentEditBook?.pageCount || "",
        availability: currentEditBook?.availability || "available",
      })
      setImagePreview(currentEditBook.coverBookImage)
    }
  }, [currentEditBook, reset])

  const authorSearch = watch("authorSearch")

  const { authorSuggestions, isLoadingAuthors } = useAuthorSearch(authorSearch, authorSelected)

  const handleAuthorSearchChange = (e) => {
    setValue("authorSearch", e.target.value)
    setAuthorSelected(false)
  }

  const handleImageChange = (event) => {
    const file = event.target.files[0]
    if (file) {
      setCoverBookImage(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleAuthorSelect = (author) => {
    setValue("authorId", author._id)
    setValue("authorSearch", `${author.firstName} ${author.lastName}`)
    setAuthorSelected(true)
  }

  const handleFormSubmit = (data) => {
    onSubmit(data, coverBookImage)
  }

  // const onReset = () => {
  //   // Reset form fields to their initial values
  //   reset({
  //     title: currentEditBook?.title || "",
  //     authorSearch: currentEditBook?.authors[0]
  //       ? `${currentEditBook.authors[0].firstName} ${currentEditBook.authors[0].lastName}`
  //       : "",
  //     authorId: currentEditBook?.authors[0]?._id || "",
  //     summary: currentEditBook?.summary || "",
  //     publishYear: currentEditBook?.publishYear || "",
  //     format: currentEditBook?.format || "digital",
  //     genre: currentEditBook?.genre?.join(", ") || "",
  //     tags: currentEditBook?.tags?.join(", ") || "",
  //     language: currentEditBook?.language || "",
  //     pageCount: currentEditBook?.pageCount || "",
  //     availability: currentEditBook?.availability || "available",
  //   })

  //   // Reset image preview
  //   setImagePreview(currentEditBook?.coverBookImage || null)
  //   setCoverBookImage(null)

  //   // Reset author selection state
  //   setAuthorSelected(true)
  // }

  const onReset = () => {
    // Reset form fields to their default values
    reset()

    // Reset image preview
    setImagePreview(currentEditBook?.coverBookImage || null)
    setCoverBookImage(null)

    // Reset author selection state
    setAuthorSelected(true)
  }

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="mt-3 flex w-80 flex-col">
      <ImageUploader
        imagePreview={imagePreview}
        onImageChange={handleImageChange}
        isLoading={isLoading}
        error={errors.coverBookImage?.message}
      />

      <FloatingLabelField
        containerClassName="mt-4"
        label={t("bookPage.title")}
        name="title"
        register={register}
        error={errors.title}
        type="text"
        placeholder={t("bookPage.title")}
      />

      <FloatingLabelField
        containerClassName={"mt-4"}
        label={t("bookPage.authors")}
        name="authorSearch"
        register={register}
        error={errors.authorId}
        type="text"
        placeholder={t("bookPage.searchAuthors")}
        onChange={handleAuthorSearchChange}
      />
      {isLoadingAuthors && (
        <div className="flex w-full justify-center">
          <div className="loading loading-spinner loading-sm my-4" />
        </div>
      )}
      {authorSuggestions.length > 0 && (
        <AuthorSuggestionList
          authorSuggestions={authorSuggestions}
          onAuthorSelect={handleAuthorSelect}
        />
      )}

      <FloatingLabelField
        containerClassName={"mt-4"}
        label={t("bookPage.summary")}
        name={"summary"}
        register={register}
        error={errors.summary}
        type="textarea"
        placeholder={t("bookPage.summary")}
      />

      <div className="divider">{t("common.optional")}</div>

      <EditBookFormCollapse register={register} errors={errors} />

      <div className="mb-4 flex w-80 justify-between gap-4">
        <ResetButton onClick={onReset} className="btn-outline btn flex-1" />
        <DeleteButton
          onClick={(e) => {
            e.preventDefault()
            onDeleteClick()
          }}
          className="btn"
        />
      </div>

      <SubmitButton isLoading={isLoading} className={"btn mb-4 w-80 text-base"} />
    </form>
  )
}

export default EditBookForm
