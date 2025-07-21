import { useTranslation } from "react-i18next"

const ResetButton = ({ onClick, className = "btn", ...props }) => {
  const { t } = useTranslation()

  return (
    <button type="button" onClick={onClick} className={className} {...props}>
      {t("common.reset")}
    </button>
  )
}

export default ResetButton
