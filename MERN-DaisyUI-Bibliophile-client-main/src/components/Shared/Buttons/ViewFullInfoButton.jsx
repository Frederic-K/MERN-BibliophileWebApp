import { useTranslation } from "react-i18next"
import clsx from "clsx"

function ViewFullInfoButton({ onClick, className }) {
  const { t } = useTranslation()

  return (
    <button type="button" className={clsx("btn", className)} onClick={onClick}>
      {t("readingPage.viewFullInformation")}
    </button>
  )
}

export default ViewFullInfoButton
