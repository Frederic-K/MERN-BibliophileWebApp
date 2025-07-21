import { useTranslation } from "react-i18next"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import clsx from "clsx"
import { bookshelfItemSchema } from "../../../lib/schemas/formSchemas"
import { useCurrentBookshelfItemStore } from "../../../lib/store/currentBookshelfItemStore"
import LabeledField from "../../Shared/FormField/LabeledField"
import CancelButton from "../../Shared/Buttons/CancelButton"
import SaveButton from "../../Shared/Buttons/SaveButton"

function BookshelfItemEditForm({ onSubmit, isEditing, setIsEditing }) {
  const { t } = useTranslation()

  const currentBookshelfItem = useCurrentBookshelfItemStore((state) => state.currentBookshelfItem)

  const formFields = [
    {
      name: "rating",
      type: "rating",
      label: "readingPage.bookshelfItem.rating",
      containerClassName: "flex items-center gap-2",
    },
    {
      name: "isFavorite",
      type: "checkbox",
      label: "readingPage.bookshelfItem.isFavorite",
      containerClassName: "flex items-center gap-2",
    },
    {
      name: "readStatus",
      type: "select",
      label: "readingPage.bookshelfItem.readStatus",
      options: [
        { value: "to-read", label: "readingPage.bookshelfItem.to-read" },
        { value: "reading", label: "readingPage.bookshelfItem.reading" },
        { value: "read", label: "readingPage.bookshelfItem.read" },
      ],
    },
    { name: "startReadDate", type: "date", label: "readingPage.bookshelfItem.startReadDate" },
    { name: "endReadDate", type: "date", label: "readingPage.bookshelfItem.endReadDate" },
    { name: "dueDate", type: "date", label: "readingPage.bookshelfItem.dueDate" },
  ]

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    reset,
  } = useForm({
    resolver: zodResolver(bookshelfItemSchema),
    defaultValues: {
      rating: currentBookshelfItem?.rating?.toString() ?? null,
      readStatus: currentBookshelfItem?.readStatus || "to-read",
      startReadDate: currentBookshelfItem?.startReadDate?.split("T")[0] || "",
      endReadDate: currentBookshelfItem?.endReadDate?.split("T")[0] || "",
      dueDate: currentBookshelfItem?.dueDate?.split("T")[0] || "",
      isFavorite: currentBookshelfItem?.isFavorite || false,
    },
  })

  const handleResetEditForm = () => {
    reset({
      rating: currentBookshelfItem?.rating?.toString() ?? null,
      readStatus: currentBookshelfItem?.readStatus || "to-read",
      startReadDate: currentBookshelfItem?.startReadDate?.split("T")[0] || "",
      endReadDate: currentBookshelfItem?.endReadDate?.split("T")[0] || "",
      dueDate: currentBookshelfItem?.dueDate?.split("T")[0] || "",
      isFavorite: currentBookshelfItem?.isFavorite || false,
    })
  }

  const handleFormSubmit = async (data) => {
    await onSubmit(data)
    setIsEditing(false)
  }

  return (
    <div
      tabIndex={0}
      className={clsx(
        "collapse-arrow collapse cursor-pointer",
        "bg-base-100 border-base-300 border",
        isEditing ? "collapse-open" : "collapse-close"
      )}
    >
      <div className="collapse-title font-semibold" onClick={() => setIsEditing(!isEditing)}>
        {t("bookshelfPage.bookshelfItem.edit")}
      </div>
      <div className="collapse-content">
        <form onSubmit={handleSubmit(handleFormSubmit)} className="flex flex-col gap-2">
          <LabeledField fields={formFields} register={register} watch={watch} errors={errors} />

          <div className="mt-4 flex justify-end gap-2">
            <CancelButton onClick={handleResetEditForm} />
            <SaveButton />
          </div>
        </form>
      </div>
    </div>
  )
}

export default BookshelfItemEditForm
