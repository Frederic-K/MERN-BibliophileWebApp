import { useNavigationUtils } from "../../../lib/hooks/useNavigation"
import AuthorInfo from "./AuthorInfo"
import BackButton from "../../Shared/Buttons/BackButton"

const AuthorHeader = () => {
  const { handleBackClick } = useNavigationUtils()

  return (
    <section className="relative mt-3 flex w-80 items-center justify-between gap-4">
      <div className="flex w-16 items-center justify-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="1.5"
          stroke="currentColor"
          className="size-16"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
          />
        </svg>
      </div>
      <AuthorInfo />
      <BackButton
        onClick={handleBackClick}
        buttonClassName={"btn-xs absolute top-2 right-1"}
        iconClassName={"size-4"}
      />
    </section>
  )
}

export default AuthorHeader
