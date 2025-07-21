import { useTranslation } from "react-i18next"
import FloatingLabelField from "../../Shared/FormField/FloatingLabelField"

const CreateBookFormCollapse = ({ register, errors }) => {
  const { t } = useTranslation()

  return (
    <div className="collapse-arrow collapse mb-4 border border-current/20">
      <input type="checkbox" />
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
            defaultValue="digital"
          />

          {["genre", "tags", "language"].map((field, index) => (
            <FloatingLabelField
              key={`${field}-${index}`}
              containerClassName="mt-4"
              label={t(`bookPage.${field}`)}
              name={field}
              register={register}
              error={errors[field]}
              type="text"
              placeholder={t(`bookPage.${field}Placeholder`)}
            />
          ))}

          <FloatingLabelField
            containerClassName="mt-4"
            label={t("bookPage.pageCount")}
            name="pageCount"
            register={register}
            error={errors.pageCount}
            type="number"
            placeholder={t("bookPage.pageCount")}
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
            defaultValue="available"
          />
        </div>
      </div>
    </div>
  )
}

export default CreateBookFormCollapse
