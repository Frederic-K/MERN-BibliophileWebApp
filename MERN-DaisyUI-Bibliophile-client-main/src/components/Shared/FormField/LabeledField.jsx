import { useTranslation } from "react-i18next"
import clsx from "clsx"

// LabeledFields component: Renders a collection of form fields
// Each field is defined in the 'fields' array prop and rendered sequentially

const LabeledField = ({ fields, register, watch, errors }) => {
  const { t } = useTranslation()

  const renderField = (field) => {
    switch (field.type) {
      case "rating":
        return (
          <div className="flex">
            <div className="rating rating-lg">
              {["1", "2", "3", "4", "5"].map((value) => (
                <input
                  key={value}
                  type="radio"
                  name={field.name}
                  className="mask mask-star-2"
                  value={value}
                  {...register(field.name)}
                  checked={watch(field.name) === value}
                />
              ))}
            </div>
          </div>
        )
      case "checkbox":
        return <input type="checkbox" {...register(field.name)} className="checkbox" />
      case "select":
        return (
          <select {...register(field.name)} className="select select-bordered w-full">
            {field.options.map((option) => (
              <option key={option.value} value={option.value}>
                {t(option.label)}
              </option>
            ))}
          </select>
        )
      case "date":
        return (
          <input type="date" {...register(field.name)} className="input input-bordered w-full" />
        )
      default:
        return (
          <input
            type={field.type}
            {...register(field.name)}
            className="input input-bordered w-full"
          />
        )
    }
  }

  return (
    <>
      {/* 
        Map through the fields array to render each form field
        This approach allows for dynamic generation of form fields,
        stacking them vertically in the order they appear in the array
      */}
      {fields.map((field) => (
        <div key={field.name} className={clsx("form-control", field.containerClassName)}>
          <label className={clsx("label", field.labelClassName)}>
            <span className="label-text">{t(field.label)}</span>
          </label>
          {renderField(field)}
          {errors[field.name] && (
            <p className="text-error mt-1 text-sm">{errors[field.name].message}</p>
          )}
        </div>
      ))}
    </>
  )
}

export default LabeledField
