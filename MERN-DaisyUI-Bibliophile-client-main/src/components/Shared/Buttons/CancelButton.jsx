import { useTranslation } from "react-i18next"

const CancelButton = ({ onClick, className = "btn" }) => {
  const { t } = useTranslation()
  return (
    <button type="button" className={className} onClick={onClick}>
      {t("common.cancel")}
    </button>
  )
}

export default CancelButton