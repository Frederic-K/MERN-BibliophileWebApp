import { useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { useTranslation } from "react-i18next"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import axios from "axios"
import { toast } from "react-toastify"
import { resetPasswordSchema } from "../lib/schemas/formSchemas"
import PageHeader from "../components/Shared/PageHeaders/PageHeader"
import SubmitButton from "../components/Shared/Buttons/SubmitButton"
import PasswordField from "../components/Shared/FormField/PasswordField"

function ResetPassword() {
  const navigate = useNavigate()
  const { t } = useTranslation()
  const { lang, token } = useParams()

  const [isLoading, setIsLoading] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false)

  const toggleNewPasswordVisibility = () => {
    setShowNewPassword(!showNewPassword)
  }

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmNewPassword(!showConfirmNewPassword)
  }

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(resetPasswordSchema),
  })

  const onSubmit = async (data) => {
    setIsLoading(true)
    try {
      await axios.post(`/api/auth/reset-password/${token}`, {
        newPassword: data.newPassword,
        confirmNewPassword: data.confirmNewPassword,
      })
      toast.success("Successfully reset password")
      navigate(`/${lang}/sign-in`)
    } catch (error) {
      console.error("Error resetting password", error.response?.data?.message || error.message)
      toast.error("Error resetting password")
    } finally {
      reset()
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
              d="M13.5 10.5V6.75a4.5 4.5 0 1 1 9 0v3.75M3.75 21.75h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H3.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z"
            />
          </svg>
        }
        titleKey={"resetPasswordPage.title"}
        descriptionKey={"resetPasswordPage.description"}
      />

      <form onSubmit={handleSubmit(onSubmit)} className="flex w-80 flex-col">
        <PasswordField
          placeholder={t("resetPasswordPage.newPassword")}
          register={register}
          name="newPassword"
          error={errors.newPassword}
          toggleVisibility={toggleNewPasswordVisibility}
          showPassword={showNewPassword}
          className="mt-2"
        />

        <PasswordField
          placeholder={t("resetPasswordPage.confirmNewPassword")}
          register={register}
          name="confirmNewPassword"
          error={errors.confirmNewPassword}
          toggleVisibility={toggleConfirmPasswordVisibility}
          showPassword={showConfirmNewPassword}
          className="mt-4"
        />

        <SubmitButton isLoading={isLoading} className="btn btn-block mt-4" />
      </form>
    </main>
  )
}

export default ResetPassword
