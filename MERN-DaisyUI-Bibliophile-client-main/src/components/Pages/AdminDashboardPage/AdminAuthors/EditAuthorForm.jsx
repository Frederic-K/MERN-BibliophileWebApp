import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useTranslation } from "react-i18next"
import { authorSchema } from "../../../../lib/schemas/formSchemas"
import { useCurrentEditAuthorStore } from "../../../../lib/store/currentEditAuthorStore"
import FloatingLabelField from "../../../Shared/FormField/FloatingLabelField"
import SubmitButton from "../../../Shared/Buttons/SubmitButton"
import ResetButton from "../../../Shared/Buttons/ResetButton"
import DeleteButton from "../../../Shared/Buttons/DeleteButton"

function EditAuthorForm({ onSubmit, isLoading, onDeleteClick }) {
  const { t } = useTranslation()
  const currentEditAuthor = useCurrentEditAuthorStore((state) => state.currentEditAuthor)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(authorSchema),
    defaultValues: {
      firstName: currentEditAuthor?.firstName || "",
      lastName: currentEditAuthor?.lastName || "",
      //   birthDate: currentEditAuthor?.birthDate || "",
      //   deathDate: currentEditAuthor?.deathDate || "",
      bio: currentEditAuthor?.bio || "",
    },
  })

  // Using React hook form reset feature, instead of setValue
  useEffect(() => {
    if (currentEditAuthor) {
      reset({
        firstName: currentEditAuthor?.firstName || "",
        lastName: currentEditAuthor?.lastName || "",
        //   birthDate: currentEditAuthor?.birthDate || "",
        //   deathDate: currentEditAuthor?.deathDate || "",
        bio: currentEditAuthor?.bio || "",
      })
    }
  }, [currentEditAuthor, reset])

  const handleFormSubmit = (data) => {
    onSubmit(data)
  }

  const onReset = () => {
    reset()
  }

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="mt-3 flex w-80 flex-col">
      <FloatingLabelField
        containerClassName="mt-4"
        label={t("authorPage.firstName")}
        name="firstName"
        register={register}
        error={errors.firstName}
        type="text"
        placeholder={t("authorPage.firstName")}
      />

      <FloatingLabelField
        containerClassName="mt-4"
        label={t("authorPage.lastName")}
        name="lastName"
        register={register}
        error={errors.lastName}
        type="text"
        placeholder={t("authorPage.lastName")}
      />

      {/* <FloatingLabelField
        containerClassName="mt-4"
        label={t("authorPage.birthDate")}
        name="birthDate"
        register={register}
        error={errors.birthDate}
        type="date"
        placeholder={t("authorPage.birthDate")}
      />

      <FloatingLabelField
        containerClassName="mt-4"
        label={t("authorPage.deathDate")}
        name="deathDate"
        register={register}
        error={errors.deathDate}
        type="date"
        placeholder={t("authorPage.deathDate")}
      /> */}

      <FloatingLabelField
        containerClassName="mt-4"
        label={t("authorPage.biography")}
        name="bio"
        register={register}
        error={errors.biography}
        type="textarea"
        placeholder={t("authorPage.bio")}
      />

      <div className="mt-4 mb-4 flex w-80 justify-between gap-4">
        <ResetButton onClick={onReset} className="btn-outline btn flex-1" />
        <DeleteButton
          onClick={(e) => {
            e.preventDefault()
            onDeleteClick()
          }}
          className="btn"
        />
      </div>

      <SubmitButton isLoading={isLoading} className="btn mb-4 w-80 text-base" />
    </form>
  )
}

export default EditAuthorForm
