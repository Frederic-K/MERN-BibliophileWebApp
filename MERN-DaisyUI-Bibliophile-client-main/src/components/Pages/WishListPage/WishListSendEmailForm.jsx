import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useTranslation } from "react-i18next"
import { emailSchema } from "../../../lib/schemas/formSchemas"
import IconPrefixedField from "../../Shared/FormField/IconPrefixedField"

function WishListSendEmailForm({ onSubmit, isSending, isDisabled }) {
  const { t } = useTranslation()

  const {
    register: registerEmail,
    handleSubmit: handleSubmitEmail,
    formState: { errors: errorsEmail },
  } = useForm({
    resolver: zodResolver(emailSchema),
  })

  return (
    <form onSubmit={handleSubmitEmail(onSubmit)} className="my-4">
      <IconPrefixedField
        className="mb-2"
        type="email"
        placeholder={t("wishlistPage.recipientEmail")}
        register={registerEmail}
        name="email"
        error={errorsEmail.email}
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
      <button type="submit" className="btn btn-block mt-2" disabled={isDisabled}>
        {isSending ? (
          <>
            <span className="loading loading-spinner"></span>
            {t("common.sending")}
          </>
        ) : (
          t("wishlistPage.sendWishlist")
        )}
      </button>
    </form>
  )
}

export default WishListSendEmailForm
