// Third-party libraries
import { useTranslation } from "react-i18next"
import { useCurrentBookStore } from "../../../lib/store/currentBookStore"
import { formatSummary } from "../../../lib/utils/textUtils"

function BookOverview() {
  const { t } = useTranslation()

  const currentBook = useCurrentBookStore((state) => state.currentBook)

  return (
    <>
      <section className="w-80">
        <h1 className="mt-3 mb-1 p-1 text-center text-xl font-bold">{currentBook.title}</h1>
        <div className="divider my-0"></div>
      </section>
      <section className="w-80">
        <h2 className="font-semibold">{t("bookPage.summary")} :</h2>
        <p className="">{formatSummary(currentBook.summary, { formatType: "paragraphs" })}</p>
      </section>
    </>
  )
}

export default BookOverview
