import { useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { useTranslation } from "react-i18next"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import axios from "axios"
import { toast } from "react-toastify"
import { useUserStore } from "../lib/store/userStore"
import { userSchema } from "../lib/schemas/formSchemas"
import IconPrefixedField from "../components/Shared/FormField/IconPrefixedField"
import PasswordField from "../components/Shared/FormField/PasswordField"
import ConfirmationModal from "../components/Shared/Modals/ConfirmationModal"
import SubmitButton from "../components/Shared/Buttons/SubmitButton"
import UserProfileHeader from "../components/Pages/UserPage/UserProfileHeader"

function User() {
  const { t } = useTranslation()
  const { lang } = useParams()
  const navigate = useNavigate()

  const currentUser = useUserStore((state) => state.currentUser)
  const setCurrentUser = useUserStore((state) => state.setCurrentUser)
  const logout = useUserStore((state) => state.logout)

  const [isUploading, setIsUploading] = useState(false)
  const [uploadError, setUploadError] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [showLogoutModal, setShowLogoutModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false)

  const toggleCurrentPasswordVisibility = () => setShowCurrentPassword(!showCurrentPassword)
  const toggleNewPasswordVisibility = () => setShowNewPassword(!showNewPassword)
  const toggleConfirmNewPasswordVisibility = () =>
    setShowConfirmNewPassword(!showConfirmNewPassword)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(userSchema),
    defaultValues: {
      userName: currentUser?.userName || "",
    },
  })

  const onSubmit = async (data) => {
    setIsLoading(true)
    try {
      const userNameUpdateData = { userName: data.userName }
      const emailUpdateData = { newEmail: data.newEmail }
      // Update username if it has changed
      if (data.userName !== currentUser.userName) {
        const response = await axios.patch(`/api/users/${currentUser._id}`, userNameUpdateData)
        setCurrentUser({ userName: response.data.userName })
        toast.success("Username updated successfully")
      }

      // Update email if a new email is provided
      if (data.newEmail) {
        if (data.newEmail === currentUser.email) {
          // If the new email is the same as the current email
          toast.info("The email you entered is the same as your current email.")
        } else {
          await axios.post(`/api/auth/update-email/${currentUser._id}`, {
            ...emailUpdateData,
            language: lang,
          })
          toast.info(
            "A verification email has been sent to your new email address. Please verify to complete the update."
          )
          navigate(`/${lang}/verify-email`)
        }
      }

      // Handle password update
      if (data.currentPassword && data.newPassword && data.confirmNewPassword) {
        await axios.post(`/api/auth/update-password`, {
          currentPassword: data.currentPassword,
          newPassword: data.newPassword,
          confirmNewPassword: data.confirmNewPassword,
        })
        toast.success("Password updated successfully. Please log in again with your new password.")
        logout()
        navigate(`/${lang}/sign-in`)
      }
    } catch (error) {
      console.error("Error updating user:", error)
      if (error.response && error.response.data && error.response.data.message) {
        toast.error(`Failed to update user: ${error.response.data.message}`)
      } else {
        toast.error("Failed to update user. Please try again.")
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleImageUpload = async (event) => {
    const file = event.target.files[0]
    if (!file) {
      setUploadError("No file selected")
      return
    }

    if (file.size > 1048576) {
      // 1MB
      setUploadError("File must be less than 1MB")
      return
    }

    if (!currentUser || !currentUser._id) {
      setUploadError("User not logged in or user data not loaded")
      return
    }

    setIsUploading(true)
    setUploadError(null)

    const formData = new FormData()
    formData.append("profileImage", file)

    try {
      const response = await axios.post(
        `/api/users/${currentUser._id}/upload-profile-image`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      )
      // setCurrentUser({ ...currentUser, profileImage: response.data.profileImage })
      setCurrentUser({ profileImage: response.data.profileImage })
      toast.success("Profile image uploaded successfully")
    } catch (error) {
      console.error("Error uploading profile image:", error)
      toast.error("Failed to upload image. Please try again.")
      setUploadError(error.response?.data?.message || "Failed to upload image. Please try again.")
    } finally {
      setIsUploading(false)
    }
  }

  const handleLogout = async () => {
    try {
      await axios.post("/api/auth/logout")
      logout()
      toast.success("User logged out successfully")
      navigate(`/${lang}/sign-in`)
    } catch (error) {
      console.error("Error logging out:", error)
      toast.error("Error logging out. Please try again.")
      setShowLogoutModal(false)
      navigate(`/${lang}/user`)
    }
  }

  const handleDeleteAccount = async () => {
    try {
      await axios.delete(`/api/users/${currentUser.id}`)
      logout()
      toast.success("User deleted successfully")
      setShowDeleteModal(false)
      navigate(`/${lang}/sign-up`)
    } catch (error) {
      console.error("Error deleting user:", error)
      toast.error("Error deleting user. Please try again.")
      setShowDeleteModal(false)
    }
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center pb-20">
      <UserProfileHeader
        currentUser={currentUser}
        isUploading={isUploading}
        uploadError={uploadError}
        handleImageUpload={handleImageUpload}
      />

      <form onSubmit={handleSubmit(onSubmit)} className="flex w-80 flex-col">
        <IconPrefixedField
          type="text"
          placeholder={t("userPage.userName")}
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

        <input
          type="email"
          placeholder={currentUser ? currentUser.email : t("userPage.email")}
          className="input mt-4"
          disabled
        />

        <div className="divider">{t("updateEmail.newEmail")}</div>

        <IconPrefixedField
          type="email"
          placeholder={t("updateEmail.newEmail")}
          register={register}
          name="newEmail"
          error={errors.newEmail}
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
          placeholder={t("updateEmail.confirmNewEmail")}
          register={register}
          name="confirmNewEmail"
          error={errors.confirmNewEmail}
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

        <div className="divider">{t("updatePassword.newPassword")}</div>

        <PasswordField
          placeholder={t("updatePassword.currentPassword")}
          register={register}
          name="currentPassword"
          error={errors.currentPassword}
          toggleVisibility={toggleCurrentPasswordVisibility}
          showPassword={showCurrentPassword}
        />

        <PasswordField
          placeholder={t("updatePassword.newPassword")}
          register={register}
          name="newPassword"
          error={errors.newPassword}
          toggleVisibility={toggleNewPasswordVisibility}
          showPassword={showNewPassword}
          className="mt-4"
        />

        <PasswordField
          placeholder={t("updatePassword.confirmPassword")}
          register={register}
          name="confirmNewPassword"
          error={errors.confirmNewPassword}
          toggleVisibility={toggleConfirmNewPasswordVisibility}
          showPassword={showConfirmNewPassword}
          className="mt-4"
        />

        <SubmitButton isLoading={isLoading} className="btn btn-block mt-4" />
      </form>
      <section className="mt-4 flex w-80 justify-between">
        <button onClick={() => setShowDeleteModal(true)} className="link-hover link">
          {t("common.delete")}
        </button>
        <button onClick={() => setShowLogoutModal(true)} className="link-hover link">
          {t("common.signOut")}
        </button>
      </section>

      <ConfirmationModal
        isOpen={showLogoutModal}
        title={t("common.signOut")}
        message={t("common.signOutDescription")}
        onConfirm={handleLogout}
        onCancel={() => setShowLogoutModal(false)}
        confirmText={t("common.signOut")}
        confirmButtonClass="btn-warning"
      />

      <ConfirmationModal
        isOpen={showDeleteModal}
        title={t("userPage.delete")}
        message={t("userPage.confirmDelete")}
        onConfirm={handleDeleteAccount}
        onCancel={() => setShowDeleteModal(false)}
        confirmText={t("common.delete")}
        confirmButtonClass="btn-error"
      />
    </main>
  )
}

export default User
