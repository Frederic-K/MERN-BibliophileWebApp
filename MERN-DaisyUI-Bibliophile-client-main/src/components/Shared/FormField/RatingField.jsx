import { useTranslation } from "react-i18next"
import clsx from "clsx"

const RatingField = ({ register, name, className }) => {
  const { t } = useTranslation()

  return (
    <div className={clsx("flex items-center justify-between", className)}>
      <p className="font-medium">{t("searchBar.minRating")}</p>
      <div className="rating">
        {["1", "2", "3", "4", "5"].map((value) => (
          <input
            key={value}
            type="radio"
            name={name}
            className="mask mask-star-2"
            value={value}
            {...register(name)}
          />
        ))}
      </div>
    </div>
  )
}

export default RatingField
