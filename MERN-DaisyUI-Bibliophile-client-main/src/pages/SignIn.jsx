import { useState } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"
import { useTranslation } from "react-i18next"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import axios from "axios"
import { toast } from "react-toastify"
import { useUserStore } from "../lib/store/userStore"
import { signInSchema } from "../lib/schemas/formSchemas"
import PageHeader from "../components/Shared/PageHeaders/PageHeader"
import IconPrefixedField from "../components/Shared/FormField/IconPrefixedField"
import PasswordField from "../components/Shared/FormField/PasswordField"
import SubmitButton from "../components/Shared/Buttons/SubmitButton"

function SignIn() {
  const { t } = useTranslation()
  const { lang } = useParams()
  const navigate = useNavigate()

  const setCurrentUser = useUserStore((state) => state.setCurrentUser)

  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(signInSchema),
  })

  const onSubmit = async (data) => {
    setIsLoading(true)
    try {
      const response = await axios.post("/api/auth/signin", data)
      if (response.data && response.data._id) {
        setCurrentUser(response.data)
        toast.success("Signed in successfully!")
        navigate(`/${lang}/`)
      } else {
        console.error("Invalid response from server")
        toast.error("Invalid response from server")
      }
    } catch (error) {
      console.error("Error signing in:", error)
      const errorMessage = error.response?.data?.message || "An error occurred while signing in"
      toast.error(errorMessage)
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
              d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25"
            />
          </svg>
        }
        titleKey={"signInPage.title"}
        descriptionKey={"signInPage.description"}
      />

      <form onSubmit={handleSubmit(onSubmit)} className="flex w-80 flex-col">
        <IconPrefixedField
          type="text"
          placeholder={t("signInPage.userName")}
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

        <PasswordField
          placeholder={t("signUpPage.password")}
          register={register}
          name="password"
          error={errors.password}
          toggleVisibility={togglePasswordVisibility}
          showPassword={showPassword}
          className="mt-4"
        />

        <SubmitButton isLoading={isLoading} className="btn btn-block mt-4" />

        <div className="mt-4 flex w-full justify-between">
          <Link to={`/${lang}/forgot-password`} className="link-hover link">
            {t("signInPage.forgotPassword")}
          </Link>
          <Link to={`/${lang}/sign-up`} className="link-hover link">
            {t("signInPage.signUp")}
          </Link>
        </div>
      </form>
    </main>
  )
}

export default SignIn
