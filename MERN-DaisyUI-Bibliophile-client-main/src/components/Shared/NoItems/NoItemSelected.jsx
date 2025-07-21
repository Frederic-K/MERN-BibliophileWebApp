import { useTranslation } from "react-i18next"
import { useNavigationUtils } from "../../../lib/hooks/useNavigation"

const NoItemSelected = ({ noItemSelectedKey }) => {
  const { t } = useTranslation()
  const { handleBackClick } = useNavigationUtils()

  return (
    <div className="mx-auto flex min-h-screen w-80 flex-col items-center justify-center gap-2 pb-20">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth="1.5"
        stroke="currentColor"
        className="size-24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M15.042 21.672 13.684 16.6m0 0-2.51 2.225.569-9.47 5.227 7.917-3.286-.672ZM12 2.25V4.5m5.834.166-1.591 1.591M20.25 10.5H18M7.757 14.743l-1.59 1.59M6 10.5H3.75m4.007-4.243-1.59-1.59"
        />
      </svg>
      <h1 className="text-center text-3xl font-bold">{t(noItemSelectedKey)}</h1>
      <button onClick={handleBackClick} className="btn mt-4">
        {t("common.backToHome")}
      </button>
    </div>
  )
}

export default NoItemSelected
