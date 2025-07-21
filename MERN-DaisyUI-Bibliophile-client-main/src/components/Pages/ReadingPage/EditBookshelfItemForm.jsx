import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import LabeledField from "../../Shared/FormField/LabeledField"
import CancelButton from "../../Shared/Buttons/CancelButton"
import SaveButton from "../../Shared/Buttons/SaveButton"
import ViewFullInfoButton from "../../Shared/Buttons/ViewFullInfoButton"
import CloseButton from "../../Shared/Buttons/CloseButton"

const bookshelfItemSchema = z.object({
  readStatus: z.enum(["to-read", "reading", "read"]),
  startReadDate: z.string().optional().nullable(),
  endReadDate: z.string().optional().nullable(),
  isFavorite: z.boolean(),
  dueDate: z.string().optional().nullable(),
  rating: z.preprocess(
    (val) => (val === "" || val === null ? null : Number(val)),
    z
      .number()
      .min(0, { message: "Rating must be at least 0" })
      .max(5, { message: "Rating must be at most 5" })
      .nullable()
  ),
})

const EDIT_FORM_FIELDS = [
  {
    name: "rating",
    type: "rating",
    label: "readingPage.bookshelfItem.rating",
    containerClassName: "flex w-60 items-center gap-2",
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
  {
    name: "startReadDate",
    type: "date",
    label: "readingPage.bookshelfItem.startReadDate",
  },
  {
    name: "endReadDate",
    type: "date",
    label: "readingPage.bookshelfItem.endReadDate",
  },
  {
    name: "dueDate",
    type: "date",
    label: "readingPage.bookshelfItem.dueDate",
  },
]

function EditBookshelfItemForm({ item, onSubmit, onViewFullInfo, setIsEditFormOpen }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    reset,
  } = useForm({
    resolver: zodResolver(bookshelfItemSchema),
    defaultValues: {
      rating: item?.rating?.toString() ?? null,
      readStatus: item?.readStatus || "to-read",
      startReadDate: item?.startReadDate?.split("T")[0] || "",
      endReadDate: item?.endReadDate?.split("T")[0] || "",
      dueDate: item?.dueDate?.split("T")[0] || "",
      isFavorite: item?.isFavorite || false,
    },
  })

  const handleClose = () => {
    setIsEditFormOpen(null)
  }

  const handleReset = () => {
    reset() // Will reset to defaultValues
  }

  return (
    <div className="card absolute inset-0 h-[480px] w-80 shadow-lg">
      <div className="bg-base-100/90 absolute top-0 left-0 h-full w-full rounded-lg" />
      <CloseButton
        onClick={handleClose}
        className="absolute top-2 right-2 z-20 flex h-10 w-10 items-center justify-center rounded-full p-0"
      />
      <div className="card-content z-10 p-4 font-semibold">
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-2">
          <LabeledField
            fields={EDIT_FORM_FIELDS}
            register={register}
            watch={watch}
            errors={errors}
          />
          <div className="mt-1 flex justify-between gap-2">
            <CancelButton onClick={handleReset} className="btn bg-base-100/50 flex-1" />
            <SaveButton className="btn bg-base-100/50 flex-1" />
          </div>
          <div className="mt-1 flex w-full">
            <ViewFullInfoButton className="flex-1" onClick={() => onViewFullInfo(item)} />
          </div>
        </form>
      </div>
    </div>
  )
}

export default EditBookshelfItemForm
