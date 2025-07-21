import { useTranslation } from "react-i18next"

const DatePickerField = ({ label, name, register }) => {
  const { t } = useTranslation()

  return (
    <label className="label flex justify-between">
      <span className="label-text">{t(label)}</span>
      <input type="date" {...register(name)} className="input input-bordered w-44" />
    </label>
  )
}

export default DatePickerField
