import { useState } from "react"
import { useTranslation } from "react-i18next"
import clsx from "clsx"
import { useCurrentBookStore } from "../../../lib/store/currentBookStore"
import { useCurrentBookshelfItemStore } from "../../../lib/store/currentBookshelfItemStore"

function DetailsCollapse({ itemType }) {
  const { t } = useTranslation()
  const [isOpen, setIsOpen] = useState(false)

  const currentBook = useCurrentBookStore((state) => state.currentBook)
  const currentBookshelfItem = useCurrentBookshelfItemStore((state) => state.currentBookshelfItem)

  const item = itemType === "book" ? currentBook : currentBookshelfItem

  const isBookshelfItem = itemType === "bookshelfItem"

  if (!item) return null

  return (
    <div
      tabIndex={0}
      className={clsx(
        "collapse-arrow collapse cursor-pointer",
        "bg-base-100 border-base-300 border",
        isOpen ? "collapse-open" : "collapse-close"
      )}
    >
      <div className="collapse-title font-semibold" onClick={() => setIsOpen(!isOpen)}>
        {t("common.details")}
      </div>
      <div className="collapse-content">
        {isBookshelfItem && (
          <>
            <div>
              <span className="font-semibold">{t("bookshelfPage.bookshelfItem.readStatus")}:</span>{" "}
              <span>{t(`bookshelfPage.bookshelfItem.${item.readStatus}`)}</span>
            </div>
            <div>
              <span className="font-semibold">{t("bookshelfPage.bookshelfItem.isFavorite")}:</span>{" "}
              <span>{item.isFavorite ? t("common.yes") : t("common.no")}</span>
            </div>
          </>
        )}
        {item.publishYear && (
          <div>
            <span className="font font-semibold">{t("bookPage.publishYear")}:</span>{" "}
            <span>{item.publishYear}</span>
          </div>
        )}
        {item.tags && item.tags.length > 0 && (
          <div>
            <span className="font font-semibold">{t("bookPage.tags")}:</span>{" "}
            <span>{item.tags.join(", ")}</span>
          </div>
        )}
        {item.genre && item.genre.length > 0 && (
          <div>
            <span className="font font-semibold">{t("bookPage.genre")}:</span>{" "}
            <span>{item.genre.join(", ")}</span>
          </div>
        )}
        {item.format && (
          <div>
            <span className="font font-semibold">{t("bookPage.format")}:</span>{" "}
            <span>{t(`bookPage.${item.format}`)}</span>
          </div>
        )}
        {item.availability && (
          <div>
            <span className="font font-semibold">{t("bookPage.availability")}:</span>{" "}
            <span>{t(`bookPage.${item.availability}`)}</span>
          </div>
        )}
        {item.pageCount && (
          <div>
            <span className="font font-semibold">{t("bookPage.pageCount")}:</span>{" "}
            <span>{item.pageCount}</span>
          </div>
        )}
        {item.language && (
          <div>
            <span className="font font-semibold">{t("bookPage.language")}:</span>{" "}
            <span>{item.language}</span>
          </div>
        )}
        {isBookshelfItem && (
          <>
            {item.startReadDate && (
              <div>
                <span className="font-semibold">
                  {t("bookshelfPage.bookshelfItem.startReadDate")}:
                </span>{" "}
                <span>{new Date(item.startReadDate).toLocaleDateString()}</span>
              </div>
            )}
            {item.endReadDate && (
              <div>
                <span className="font-semibold">
                  {t("bookshelfPage.bookshelfItem.endReadDate")}:
                </span>{" "}
                <span>{new Date(item.endReadDate).toLocaleDateString()}</span>
              </div>
            )}
            {item.dueDate && (
              <div>
                <span className="font-semibold">{t("bookshelfPage.bookshelfItem.dueDate")}:</span>{" "}
                <span>{new Date(item.dueDate).toLocaleDateString()}</span>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default DetailsCollapse
