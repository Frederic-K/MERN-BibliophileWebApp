// import { useTranslation } from "react-i18next"
// import FloatingLabelField from "../../../Shared/FormField/FloatingLabelField"

// const EditBookFormCollapse = ({ register, errors, book }) => {
//   const { t } = useTranslation()

//   return (
//     <div className="collapse-arrow collapse mb-4 border border-current/20">
//       <input type="checkbox" defaultChecked />
//       <div className="text-smd collapse-title font-medium">{t("bookPage.details")}</div>

//       <div className="collapse-content">
//         <div className="grid grid-cols-1">
//           <FloatingLabelField
//             containerClassName=""
//             label={t("bookPage.publishYear")}
//             name="publishYear"
//             register={register}
//             error={errors.publishYear}
//             type="number"
//             min="1000"
//             max={new Date().getFullYear() + 5}
//             step="1"
//             placeholder={t("bookPage.publishYear")}
//             defaultValue={book?.publishYear}
//           />

//           <FloatingLabelField
//             containerClassName="mt-4"
//             label={t("bookPage.format")}
//             name="format"
//             register={register}
//             error={errors.format}
//             type="select"
//             options={[
//               { value: "digital", label: t("bookPage.digital") },
//               { value: "physical", label: t("bookPage.physical") },
//             ]}
//             defaultValue={book?.format || "digital"}
//           />

//           {["genre", "tags", "language"].map((field, index) => (
//             <FloatingLabelField
//               key={`${field}-${index}`}
//               containerClassName="mt-4"
//               label={t(`bookPage.${field}`)}
//               name={field}
//               register={register}
//               error={errors[field]}
//               type="text"
//               placeholder={t(`bookPage.${field}Placeholder`)}
//               defaultValue={book?.[field]?.join(", ")}
//             />
//           ))}

//           <FloatingLabelField
//             containerClassName="mt-4"
//             label={t("bookPage.pageCount")}
//             name="pageCount"
//             register={register}
//             error={errors.pageCount}
//             type="number"
//             placeholder={t("bookPage.pageCount")}
//             defaultValue={book?.pageCount}
//           />

//           <FloatingLabelField
//             containerClassName="mt-4"
//             label={t("bookPage.availability")}
//             name="availability"
//             register={register}
//             error={errors.availability}
//             type="select"
//             options={[
//               { value: "available", label: t("bookPage.available") },
//               { value: "unavailable", label: t("bookPage.unavailable") },
//               { value: "reserved", label: t("bookPage.reserved") },
//             ]}
//             defaultValue={book?.availability || "available"}
//           />
//         </div>
//       </div>
//     </div>
//   )
// }

// export default EditBookFormCollapse

import { useTranslation } from "react-i18next"
import FloatingLabelField from "../../../Shared/FormField/FloatingLabelField"
import { useCurrentEditBookStore } from "../../../../lib/store/currentEditBookStore"

const EditBookFormCollapse = ({ register, errors }) => {
  const { t } = useTranslation()
  const currentEditBook = useCurrentEditBookStore((state) => state.currentEditBook)

  const getFieldValue = (field) => {
    const value = currentEditBook?.[field]
    if (Array.isArray(value)) {
      return value.join(", ")
    } else if (typeof value === "string") {
      return value
    }
    return ""
  }

  return (
    <div className="collapse-arrow collapse mb-4 border border-current/20">
      <input type="checkbox" defaultChecked />
      <div className="text-smd collapse-title font-medium">{t("bookPage.details")}</div>

      <div className="collapse-content">
        <div className="grid grid-cols-1">
          <FloatingLabelField
            containerClassName=""
            label={t("bookPage.publishYear")}
            name="publishYear"
            register={register}
            error={errors.publishYear}
            type="number"
            min="1000"
            max={new Date().getFullYear() + 5}
            step="1"
            placeholder={t("bookPage.publishYear")}
            defaultValue={currentEditBook?.publishYear}
          />

          <FloatingLabelField
            containerClassName="mt-4"
            label={t("bookPage.format")}
            name="format"
            register={register}
            error={errors.format}
            type="select"
            options={[
              { value: "digital", label: t("bookPage.digital") },
              { value: "physical", label: t("bookPage.physical") },
            ]}
            defaultValue={currentEditBook?.format || "digital"}
          />

          {["genre", "tags"].map((field, index) => (
            <FloatingLabelField
              key={`${field}-${index}`}
              containerClassName="mt-4"
              label={t(`bookPage.${field}`)}
              name={field}
              register={register}
              error={errors[field]}
              type="text"
              placeholder={t(`bookPage.${field}Placeholder`)}
              defaultValue={getFieldValue(field)}
            />
          ))}

          <FloatingLabelField
            containerClassName="mt-4"
            label={t("bookPage.language")}
            name="language"
            register={register}
            error={errors.language}
            type="text"
            placeholder={t("bookPage.languagePlaceholder")}
            defaultValue={currentEditBook?.language || ""}
          />

          <FloatingLabelField
            containerClassName="mt-4"
            label={t("bookPage.pageCount")}
            name="pageCount"
            register={register}
            error={errors.pageCount}
            type="number"
            placeholder={t("bookPage.pageCount")}
            defaultValue={currentEditBook?.pageCount}
          />

          <FloatingLabelField
            containerClassName="mt-4"
            label={t("bookPage.availability")}
            name="availability"
            register={register}
            error={errors.availability}
            type="select"
            options={[
              { value: "available", label: t("bookPage.available") },
              { value: "unavailable", label: t("bookPage.unavailable") },
              { value: "reserved", label: t("bookPage.reserved") },
            ]}
            defaultValue={currentEditBook?.availability || "available"}
          />
        </div>
      </div>
    </div>
  )
}

export default EditBookFormCollapse
