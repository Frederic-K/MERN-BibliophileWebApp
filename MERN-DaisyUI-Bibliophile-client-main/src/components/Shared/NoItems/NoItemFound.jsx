import { useTranslation } from "react-i18next"
import { useNavigationUtils } from "../../../lib/hooks/useNavigation"

const NoItemFound = ({ noItemFoundKey, backButtonKey = "common.backToHome" }) => {
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
          d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
        />
      </svg>
      <h1 className="text-center text-3xl font-bold">{t(noItemFoundKey)}</h1>
      <button onClick={handleBackClick} className="btn mt-4">
        {t(backButtonKey)}
      </button>
    </div>
  )
}

export default NoItemFound
