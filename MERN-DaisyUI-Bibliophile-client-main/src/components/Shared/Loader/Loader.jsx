import { useTranslation } from "react-i18next"

function Loader() {
  const { t } = useTranslation()

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="flex items-center gap-2">
        <span className="loading loading-spinner"></span>
        {t("common.loading")}
      </div>
    </div>
  )
}

export default Loader
