import { useState } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"
import { useTranslation } from "react-i18next"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import axios from "axios"
import { toast } from "react-toastify"
import { signUpSchema } from "../lib/schemas/formSchemas"
import PageHeader from "../components/Shared/PageHeaders/PageHeader"
import IconPrefixedField from "../components/Shared/FormField/IconPrefixedField"
import PasswordField from "../components/Shared/FormField/PasswordField"
import SubmitButton from "../components/Shared/Buttons/SubmitButton"

function SignUp() {
  const { t } = useTranslation()
  const { lang } = useParams()
  const navigate = useNavigate()

  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(signUpSchema),
  })

  const onSubmit = async (data) => {
    setIsLoading(true)
    try {
      // Create a new object excluding the confirmEmail field
      const requestData = {
        userName: data.userName,
        email: data.email,
        password: data.password,
        language: lang,
      }
      await axios.post("/api/auth/signup", requestData)
      navigate(`/${lang}/verify-email`)
    } catch (error) {
      console.log(
        "An error occurred while signing up:",
        error.response?.data?.message || error.message
      )
      toast.error("An error occurred while signing up")
    } finally {
      // Clear form fields
      reset()
      setIsLoading(false)
    }
  }

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
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
              d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25"
            />
          </svg>
        }
        titleKey={"signUpPage.title"}
        descriptionKey={"signUpPage.description"}
      />

      <form onSubmit={handleSubmit(onSubmit)} className="flex w-80 flex-col items-center gap-4">
        <IconPrefixedField
          type="text"
          placeholder={t("signUpPage.userName")}
          register={register}
          name="userName"
          error={errors.userName}
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
                <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </g>
            </svg>
          }
        />

        <IconPrefixedField
          type="email"
          placeholder={t("signUpPage.email")}
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
          placeholder={t("signUpPage.confirmEmail")}
          register={register}
          name="confirmEmail"
          error={errors.confirmEmail}
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

        <PasswordField
          placeholder={t("signUpPage.password")}
          register={register}
          name="password"
          error={errors.password}
          toggleVisibility={togglePasswordVisibility}
          showPassword={showPassword}
        />

        <SubmitButton isLoading={isLoading} className="btn btn-block" />

        <div className="flex w-full justify-center">
          <Link to={`/${lang}/sign-in`} className="link-hover link">
            {t("signUpPage.signIn")}
          </Link>
        </div>
      </form>
    </main>
  )
}

export default SignUp
