import { useTranslation } from "react-i18next"
import clsx from "clsx"

const ApplyButton = ({ className, isLoading }) => {
  const { t } = useTranslation()

  return (
    <button type="submit" className={clsx("btn btn-soft", className)} disabled={isLoading}>
      {isLoading ? (
        <>
          <span className="loading loading-spinner"></span>
          {t("common.loading")}
        </>
      ) : (
        t("common.apply")
      )}
    </button>
  )
}

export default ApplyButton
