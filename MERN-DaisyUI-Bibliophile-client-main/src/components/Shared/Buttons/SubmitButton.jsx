import { useTranslation } from "react-i18next"
import clsx from "clsx"

function SubmitButton({ isLoading, className, ...props }) {
  const { t } = useTranslation()

  return (
    <button
      type="submit"
      className={clsx("btn text-base", className)}
      disabled={isLoading}
      {...props}
    >
      {isLoading ? (
        <>
          <span className="loading loading-spinner"></span>
          {t("common.loading")}
        </>
      ) : (
        t("common.submit")
      )}
    </button>
  )
}

export default SubmitButton
