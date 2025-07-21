import { useTranslation } from "react-i18next"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { wishListSchema } from "../../../lib/schemas/formSchemas"
import { useWishlistStore } from "../../../lib/store/wishlistStore"
import FloatingLabelField from "../../Shared/FormField/FloatingLabelField"
import RadioButtonFieldGroup from "../../Shared/FormField/RadioButtonFieldGroup"

function WishListAddBookForm() {
  const { t } = useTranslation()

  const addBook = useWishlistStore((state) => state.addBook)

  const {
    register: registerBook,
    handleSubmit: handleSubmitBook,
    formState: { errors: errorsBook },
    reset: resetBook,
  } = useForm({
    resolver: zodResolver(wishListSchema),
    defaultValues: {
      priority: "high",
    },
  })

  const onSubmitBook = (data) => {
    addBook({ title: data.bookTitle, author: data.bookAuthor, priority: data.priority })
    resetBook()
  }

  return (
    <form onSubmit={handleSubmitBook(onSubmitBook)} className="mb-4">
      <fieldset className="fieldset border-base-300 rounded-box border p-4">
        <FloatingLabelField
          containerClassName="mb-2"
          label={t("wishlistPage.bookAuthors")}
          name="bookAuthor"
          register={registerBook}
          error={errorsBook.bookAuthor}
          type="text"
          placeholder={t("wishlistPage.bookAuthors")}
        />

        <FloatingLabelField
          containerClassName="mb-2"
          label={t("wishlistPage.bookTitle")}
          name="bookTitle"
          register={registerBook}
          error={errorsBook.bookTitle}
          type="text"
          placeholder={t("wishlistPage.bookTitle")}
        />
        <div className="border-base-300 mt-2 flex items-center justify-between rounded-md border-1 px-4 py-2">
          <RadioButtonFieldGroup
            label="wishlistPage.priority"
            name="priority"
            wrapperClassName="flex items-center justify-around gap-2"
            options={[
              {
                value: "high",
                label: "wishlistPage.highPriority",
                className:
                  "border-red-300 bg-red-100/20 checked:border-red-600 checked:bg-red-200 checked:text-red-600",
              },
              {
                value: "medium",
                label: "wishlistPage.mediumPriority",
                className:
                  "border-orange-300 bg-orange-100/20 checked:border-orange-600 checked:bg-orange-200 checked:text-orange-600",
              },
              {
                value: "low",
                label: "wishlistPage.lowPriority",
                className:
                  "border-blue-300 bg-blue-100/20 checked:border-blue-600 checked:bg-blue-200 checked:text-blue-600",
              },
            ]}
            register={registerBook}
            error={errorsBook.priority}
          />
        </div>
        <button type="submit" className="btn mt-4">
          {t("wishlistPage.addBook")}
        </button>
      </fieldset>
    </form>
  )
}

export default WishListAddBookForm
