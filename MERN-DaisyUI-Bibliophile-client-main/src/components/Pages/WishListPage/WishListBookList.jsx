import { useTranslation } from "react-i18next"
import clsx from "clsx"
import { useWishlistStore } from "../../../lib/store/wishlistStore"

const WishListBookList = () => {
  const { t } = useTranslation()

  const books = useWishlistStore((state) => state.books)
  const removeBook = useWishlistStore((state) => state.removeBook)

  if (books.length === 0) {
    return (
      <p className="mb-4 flex items-center justify-center text-gray-500">
        {t("wishlistPage.noBooks")}
      </p>
    )
  }

  return (
    <ul>
      {books.map((book, index) => (
        <li
          key={index}
          className="border-base-300 mb-2 flex w-80 items-center justify-between rounded-md border-1 px-3 py-1"
        >
          <span
            className={clsx(
              "mr-2 inline-block size-3 rounded-full",
              book.priority === "low" && "bg-blue-600",
              book.priority === "medium" && "bg-orange-600",
              book.priority === "high" && "bg-red-600"
            )}
          ></span>
          <div className="flex w-56 items-center">
            <span className="mr-1 truncate font-semibold">{book.title}</span>
            <span className="mr-1 italic"> {t("wishlistPage.by")}</span>
            <span className="truncate font-semibold">{book.author}</span>
          </div>
          <button className="btn btn-circle" onClick={() => removeBook(index)}>
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
                d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
              />
            </svg>
          </button>
        </li>
      ))}
    </ul>
  )
}

export default WishListBookList
