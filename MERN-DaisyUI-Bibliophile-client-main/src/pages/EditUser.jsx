import { useForm } from "react-hook-form"
import { useNavigate, useParams } from "react-router-dom"
import { zodResolver } from "@hookform/resolvers/zod"
import { useTranslation } from "react-i18next"
import { useState, useEffect } from "react"
import axios from "axios"
import { toast } from "react-toastify"
import { useCurrentEditUserStore } from "../lib/store/currentEditUserStore"
import IconPrefixedField from "../components/Shared/FormField/IconPrefixedField"
import SubmitButton from "../components/Shared/Buttons/SubmitButton"
import DeleteButton from "../components/Shared/Buttons/DeleteButton"
import AdminUserHeader from "../components/Pages/AdminDashboardPage/AdminUsers/AdminUserHeader"
import NoItemSelected from "../components/Shared/NoItems/NoItemSelected"
import Loader from "../components/Shared/Loader/Loader"
import ConfirmationModal from "../components/Shared/Modals/ConfirmationModal"
import { userSchema } from "../lib/schemas/formSchemas"

function EditUser() {
  const { t } = useTranslation()
  const { lang, userId } = useParams()
  const navigate = useNavigate()

  const currentEditUser = useCurrentEditUserStore((state) => state.currentEditUser)
  const setCurrentEditUser = useCurrentEditUserStore((state) => state.setCurrentEditUser)
  const clearCurrentEditUser = useCurrentEditUserStore((state) => state.clearCurrentEditUser)

  const [isUploading, setIsUploading] = useState(false)
  const [uploadError, setUploadError] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(userSchema),
    defaultValues: {
      userName: currentEditUser?.userName || "",
      newEmail: "",
      confirmNewEmail: "",
    },
  })

  useEffect(() => {
    if (currentEditUser) {
      reset({
        userName: currentEditUser?.userName || "",
        newEmail: "",
        confirmNewEmail: "",
      })
    }
  }, [currentEditUser, reset])

  const onSubmit = async (data) => {
    setIsLoading(true)
    try {
      const userNameUpdateData = { userName: data.userName }
      const emailUpdateData = { newEmail: data.newEmail }

      await axios.patch(`/api/users/${userId}`, userNameUpdateData)

      if (data.newEmail) {
        if (data.newEmail === currentEditUser.email) {
          toast.info("The email you entered is the same as the current email.")
        } else {
          await axios.post(`/api/auth/update-email/${userId}`, {
            ...emailUpdateData,
            language: lang,
          })
          toast.info(
            "A verification email has been sent to the new email address. Please verify to complete the update."
          )
        }
      }

      toast.success("User updated successfully")
      clearCurrentEditUser()
      navigate(`/${lang}/admin-dashboard/users`)
    } catch (error) {
      console.error("Error updating user:", error)
      toast.error(error.response?.data?.message || "Failed to update user. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async () => {
    setIsLoading(true)
    try {
      await axios.delete(`/api/users/${userId}`)
      toast.success("User deleted successfully")
      clearCurrentEditUser()
      navigate(`/${lang}/admin-dashboard/users`)
    } catch (error) {
      console.error("Error deleting user:", error)
      toast.error(error.response?.data?.message || "Failed to delete user. Please try again.")
    } finally {
      setIsLoading(false)
      setShowDeleteModal(false)
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

    setIsUploading(true)
    setUploadError(null)

    const formData = new FormData()
    formData.append("profileImage", file)

    try {
      const response = await axios.post(`/api/users/${userId}/upload-profile-image`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      setCurrentEditUser({ profileImage: response.data.profileImage })
      toast.success("Profile image uploaded successfully")
    } catch (error) {
      console.error("Error uploading profile image:", error)
      setUploadError(error.response?.data?.message || "Failed to upload image. Please try again.")
    } finally {
      setIsUploading(false)
    }
  }

  if (!currentEditUser || !userId) {
    return <NoItemSelected noItemSelectedKey="userPage.noUserSelected" />
  }

  if (isLoading) {
    return <Loader />
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center pb-20">
      <AdminUserHeader
        currentEditUser={currentEditUser}
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
          placeholder={currentEditUser ? currentEditUser.email : t("userPage.email")}
          className="input mt-2"
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

        <div className="mt-4 flex gap-2">
          <DeleteButton onClick={() => setShowDeleteModal(true)} className="btn-outline" />
          <SubmitButton isLoading={isLoading} className="btn flex-1" />
        </div>
      </form>

      <ConfirmationModal
        isOpen={showDeleteModal}
        title={t("userPage.delete")}
        message={t("userPage.confirmDelete")}
        onConfirm={handleDelete}
        onCancel={() => setShowDeleteModal(false)}
        confirmText={t("common.delete")}
        confirmButtonClass="btn-error"
      />
    </main>
  )
}

export default EditUser
