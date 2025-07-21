import { useTranslation } from "react-i18next"

const SaveButton = ({ className = "btn", ...props }) => {
  const { t } = useTranslation()
  return (
    <button type="submit" className={className} {...props}>
      {t("common.save")}
    </button>
  )
}

export default SaveButton
