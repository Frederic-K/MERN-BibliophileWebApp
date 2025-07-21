import { useState } from "react"
import { useTranslation } from "react-i18next"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import axios from "axios"
import { toast } from "react-toastify"
import { authorSchema } from "../lib/schemas/formSchemas"
import PageHeader from "../components/Shared/PageHeaders/PageHeader"
import FloatingLabelField from "../components/Shared/FormField/FloatingLabelField"
import SubmitButton from "../components/Shared/Buttons/SubmitButton"

function CreateAuthor() {
  const { t } = useTranslation()
  const [isLoading, setIsLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(authorSchema),
  })

  const onSubmit = async (data) => {
    setIsLoading(true)
    try {
      await axios.post("/api/authors", data)
      toast.success("Author created successfully!")
    } catch (error) {
      console.error("Error creating author:", error.response?.data?.message || error.message)
      toast.error("Failed to create author. Please try again.")
    } finally {
      setIsLoading(false)
      reset()
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
              d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
            />
          </svg>
        }
        titleKey={"createAuthorPage.title"}
        descriptionKey={"createAuthorPage.description"}
      />

      <section className="mt-4">
        <form onSubmit={handleSubmit(onSubmit)} className="flex w-80 flex-col">
          <FloatingLabelField
            containerClassName={"mt-4"}
            label={t("createAuthorPage.lastName")}
            name="lastName"
            register={register}
            error={errors.lastName}
            type="text"
          />

          <FloatingLabelField
            containerClassName={"mt-4"}
            label={t("createAuthorPage.firstName")}
            name="firstName"
            register={register}
            error={errors.firstName}
            type="text"
          />

          <FloatingLabelField
            containerClassName={"mt-4 h-24"}
            label={t("createAuthorPage.bio")}
            name="bio"
            register={register}
            error={errors.bio}
            type="textarea"
          />

          <SubmitButton isLoading={isLoading} className={"btn btn-block"} />
        </form>
      </section>
    </main>
  )
}

export default CreateAuthor
