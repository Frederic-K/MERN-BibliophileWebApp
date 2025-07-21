import { useState } from "react"
import { useTranslation } from "react-i18next"
import * as z from "zod"
import axios from "axios"
import { toast } from "react-toastify"
import { useWishlistStore } from "../lib/store/wishlistStore"
import { useUserStore } from "../lib/store/userStore"
import { useWishlistBooks } from "../lib/hooks/useWishlistBooks"
import PageHeader from "../components/Shared/PageHeaders/PageHeader"
import ConfirmationModal from "../components/Shared/Modals/ConfirmationModal"
import Loader from "../components/Shared/Loader/Loader"
import WishListBookList from "../components/Pages/WishListPage/WishListBookList"
import WishListAddBookForm from "../components/Pages/WishListPage/WishListAddBookForm"
import WishListSendEmailForm from "../components/Pages/WishListPage/WishListSendEmailForm"
import ResetButton from "../components/Shared/Buttons/ResetButton"
import SaveButton from "../components/Shared/Buttons/SaveButton"

function Wishlist() {
  const { t } = useTranslation()
  const { currentUser } = useUserStore()
  const userId = currentUser?._id

  const [showResetModal, setShowResetModal] = useState(false)
  const [isResetting, setIsResetting] = useState(false)
  const [isSavingWishlist, setIsSavingWishlist] = useState(false)
  const [isSendingWishlist, setIsSendingWishlist] = useState(false)

  const { books, isUnsaved, setIsUnsaved, clearBooks } = useWishlistStore()

  const { isLoading } = useWishlistBooks(userId)

  const onSubmitEmail = (data) => {
    sendWishlist(data.email)
  }

  const saveWishlist = async () => {
    setIsSavingWishlist(true)
    try {
      const cleanedBooks = books.map(({ _id, title, author, priority, status }) => ({
        ...(_id && { _id }), // Only include _id if it exists
        title,
        author,
        priority,
        status: status || "pending",
      }))
      await axios.put(`/api/wishlists/${userId}`, { books: cleanedBooks })
      toast.success("Wishlist saved successfully!")
      setIsUnsaved(false)
    } catch (error) {
      console.error("Error saving wishlist:", error)
      toast.error("Failed to save wishlist. Please try again.")
    } finally {
      setIsSavingWishlist(false)
    }
  }
  const handleResetWishlist = () => {
    setShowResetModal(true)
  }

  const confirmResetWishlist = async () => {
    setIsResetting(true)
    try {
      await clearBooks()
      toast.success("Wishlist reset successfully!")
      setShowResetModal(false)
    } catch (error) {
      console.error("Error resetting wishlist:", error)
      toast.error("Failed to reset wishlist. Please try again.")
    } finally {
      setIsResetting(false)
    }
  }

  const sendWishlist = async (email) => {
    if (books.length === 0) {
      toast.error("Your wishlist is empty. Add some books before sending.")
      return
    }

    if (!email) {
      toast.error("Please enter a recipient email address.")
      return
    }

    const emailValidation = z.string().email().safeParse(email)
    if (!emailValidation.success) {
      toast.error("Please enter a valid email address.")
      return
    }

    setIsSendingWishlist(true)
    try {
      await axios.post(`/api/wishlists/${userId}/send`, {
        email: email,
      })
      toast.success("Wishlist sent successfully!")
    } catch (error) {
      console.error("Error sending wishlist:", error)
      const errorMessage =
        error.response?.data?.message || "Failed to send wishlist. Please try again."
      toast.error(errorMessage)
    } finally {
      setIsSendingWishlist(false)
    }
  }

  if (isLoading || isResetting) {
    return <Loader />
  }

  return (
    <main className="mx-auto flex min-h-screen w-80 flex-col items-center justify-center pb-20">
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
              d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
            />
          </svg>
        }
        titleKey={"wishlistPage.title"}
        descriptionKey={"wishlistPage.description"}
      />

      <section className="mt-2 w-80">
        <WishListAddBookForm />

        {books.length > 0 ? (
          <WishListBookList />
        ) : (
          <p className="mb-4 flex items-center justify-center text-gray-500">
            {t("wishlistPage.noBooks")}
          </p>
        )}
        <div className="divider mt-0 mb-2"></div>
        <div className="flex items-center justify-between">
          <ResetButton onClick={handleResetWishlist} disabled={books.length === 0} />

          <SaveButton
            onClick={saveWishlist}
            disabled={!isUnsaved || isSavingWishlist}
            className="btn w-48"
          />
        </div>

        <WishListSendEmailForm
          onSubmit={onSubmitEmail}
          isSending={isSendingWishlist}
          isDisabled={books.length === 0 || isSendingWishlist || isUnsaved}
        />
      </section>

      <ConfirmationModal
        isOpen={showResetModal}
        title={t("common.reset")}
        message={t("wishlistPage.resetConfirmation")}
        onConfirm={confirmResetWishlist}
        onCancel={() => setShowResetModal(false)}
        confirmText={isResetting ? t("common.loading") : t("common.confirm")}
        cancelText={t("common.cancel")}
        confirmButtonClass="btn-warning"
      />
    </main>
  )
}

export default Wishlist
