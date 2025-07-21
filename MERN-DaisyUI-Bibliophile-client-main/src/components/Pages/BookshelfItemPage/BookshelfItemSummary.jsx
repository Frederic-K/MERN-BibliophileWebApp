import { useState } from "react"
import { useTranslation } from "react-i18next"
import clsx from "clsx"
import { useCurrentBookshelfItemStore } from "../../../lib/store/currentBookshelfItemStore"
import { formatSummary } from "../../../lib/utils/textUtils"

function BookshelfItemSummary() {
  const { t } = useTranslation()

  const [isSummaryOpen, setIsSummaryOpen] = useState(false)

  const currentBookshelfItem = useCurrentBookshelfItemStore((state) => state.currentBookshelfItem)

  if (!currentBookshelfItem) return null

  return (
    <div
      tabIndex={0}
      className={clsx(
        "collapse-arrow collapse cursor-pointer",
        "bg-base-100 border-base-300 border",
        isSummaryOpen ? "collapse-open" : "collapse-close"
      )}
    >
      <div
        className="collapse-title font-semibold"
        onClick={() => setIsSummaryOpen(!isSummaryOpen)}
      >
        {t("bookPage.summary")}
      </div>
      <div className="collapse-content">
        <p className="mt-2">
          {formatSummary(currentBookshelfItem.bookDetails.summary, {
            formatType: "paragraphs",
          })}
        </p>
      </div>
    </div>
  )
}

export default BookshelfItemSummary
