import { useTranslation } from "react-i18next"
import clsx from "clsx"

const RadioButtonFieldGroup = ({
  label,
  name,
  options,
  register,
  wrapperClassName = "grid grid-cols-2 gap-2",
  labelClassName = "label cursor-pointer",
  inputClassName = "radio",
}) => {
  const { t } = useTranslation()

  return (
    <div>
      <p className="my-2 font-medium">{t(label)}</p>
      <div className={wrapperClassName}>
        {options.map((option) => (
          <label key={option.value} className={labelClassName}>
            <input
              type="radio"
              value={option.value}
              {...register(name)}
              className={clsx(inputClassName, option.className)}
            />
            <span className="label-text ml-2">{t(option.label)}</span>
          </label>
        ))}
      </div>
    </div>
  )
}

export default RadioButtonFieldGroup
