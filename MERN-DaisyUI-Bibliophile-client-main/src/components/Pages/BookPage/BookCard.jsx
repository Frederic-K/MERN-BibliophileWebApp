import React, { useState } from "react"
import { useTranslation } from "react-i18next"
import clsx from "clsx"
import BackButton from "../../Shared/Buttons/BackButton"
import { useCurrentBookStore } from "../../../lib/store/currentBookStore"
import { useNavigationUtils } from "../../../lib/hooks/useNavigation"

function BookCard({ onAddToBookshelf }) {
  const { t } = useTranslation()

  const currentBook = useCurrentBookStore((state) => state.currentBook)

  const { handleBackClick } = useNavigationUtils()
  const [imageLoaded, setImageLoaded] = useState(false)

  if (!currentBook) return null

  const handleImageLoad = () => {
    setImageLoaded(true)
  }

  return (
    <section className="relative mt-8 h-[480px] w-80">
      {!imageLoaded && <div className="skeleton absolute h-full w-full rounded-lg shadow-lg"></div>}
      <img
        src={currentBook.coverBookImage}
        alt={currentBook.title}
        className={clsx(
          "h-full w-full rounded-lg object-cover shadow-lg",
          !imageLoaded && "invisible"
        )}
        onLoad={handleImageLoad}
      />
      <BackButton
        onClick={handleBackClick}
        buttonClassName={"absolute top-2 right-2"}
        iconClassName={"size-4"}
      />
      <div className="tooltip tooltip-left absolute right-2 bottom-2" data-tip={t("bookPage.add")}>
        <button className="btn btn-circle" onClick={onAddToBookshelf}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="size-4"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0 0 12 9.75c-2.551 0-5.056.2-7.5.582V21M3 21h18M12 6.75h.008v.008H12V6.75Z"
            />
          </svg>
        </button>
      </div>
    </section>
  )
}

export default BookCard
