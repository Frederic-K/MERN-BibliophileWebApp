import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useTranslation } from "react-i18next"
import { bookSchema } from "../../../lib/schemas/formSchemas"
import SubmitButton from "../../Shared/Buttons/SubmitButton"
import ImageUploader from "./ImageUploader"
import FloatingLabelField from "../../Shared/FormField/FloatingLabelField"
import AuthorSuggestionList from "./AuthorSuggestionList"
import useAuthorSearch from "../../../lib/hooks/useAuthorSearch"
import CreateBookFormCollapse from "./CreateBookFormCollapse"

function CreateBookForm({ onSubmit, isLoading }) {
  const { t } = useTranslation()

  const [authorSelected, setAuthorSelected] = useState(false)
  const [coverBookImage, setCoverBookImage] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm({
    resolver: zodResolver(bookSchema),
    defaultValues: {
      authorSearch: "",
      authorId: "",
    },
  })

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
    reset()
    setCoverBookImage(null)
    setImagePreview(null)
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

      <CreateBookFormCollapse register={register} errors={errors} />

      <SubmitButton isLoading={isLoading} className={"btn mb-4 w-80 text-base"} />
    </form>
  )
}

export default CreateBookForm
