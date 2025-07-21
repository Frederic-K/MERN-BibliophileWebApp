import { useState } from "react"
import { Link, useParams, useNavigate } from "react-router-dom"
import { useTranslation } from "react-i18next"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import axios from "axios"
import { toast } from "react-toastify"
import { forgotPasswordSchema } from "../lib/schemas/formSchemas"
import PageHeader from "../components/Shared/PageHeaders/PageHeader"
import SubmitButton from "../components/Shared/Buttons/SubmitButton"
import IconPrefixedField from "../components/Shared/FormField/IconPrefixedField"

function ForgotPassword() {
  const { t } = useTranslation()
  const { lang } = useParams()
  const navigate = useNavigate()

  const [isLoading, setIsLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(forgotPasswordSchema),
  })

  const onSubmit = async (data) => {
    setIsLoading(true)
    try {
      await axios.post("/api/auth/forgot-password", {
        email: data.email,
        language: lang,
      })
      toast.success("Password reset link sent to your email")
      navigate(`/${lang}/sign-in`)
    } catch (error) {
      console.log(
        "Failed to send password reset link",
        error.response?.data?.message || error.message
      )
      toast.error("Failed to send password reset link")
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
              d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z"
            />
          </svg>
        }
        titleKey={"forgotPasswordPage.title"}
        descriptionKey={"forgotPasswordPage.description"}
      />

      <form onSubmit={handleSubmit(onSubmit)} className="mt-2 flex w-80 flex-col">
        <IconPrefixedField
          type="email"
          placeholder={t("forgotPasswordPage.email")}
          register={register}
          name="email"
          error={errors.email}
          required
          icon={
            <svg
              className="h-[2em] opacity-50"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
            >
              <g
                strokeLinejoin="round"
                strokeLinecap="round"
                strokeWidth="2.5"
                fill="none"
                stroke="currentColor"
              >
                <rect width="20" height="16" x="2" y="4" rx="2"></rect>
                <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
              </g>
            </svg>
          }
        />

        <IconPrefixedField
          type="email"
          placeholder={t("forgotPasswordPage.confirmEmail")}
          register={register}
          name="confirmEmail"
          error={errors.confirmEmail}
          required
          className="mt-4"
          icon={
            <svg
              className="h-[2em] opacity-50"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
            >
              <g
                strokeLinejoin="round"
                strokeLinecap="round"
                strokeWidth="2.5"
                fill="none"
                stroke="currentColor"
              >
                <rect width="20" height="16" x="2" y="4" rx="2"></rect>
                <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
              </g>
            </svg>
          }
        />

        <div className="mt-4 flex w-80 justify-between">
          <Link to={`/${lang}/sign-in`} className="btn btn-square">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </Link>

          <SubmitButton isLoading={isLoading} className={"btn btn-wide"} />
        </div>
      </form>
    </main>
  )
}

export default ForgotPassword
