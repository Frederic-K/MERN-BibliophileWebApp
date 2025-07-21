// React and React Router
import { useState } from "react"

// Third-party libraries
import { useTranslation } from "react-i18next"
import clsx from "clsx"

// Custom hooks and utilities
import { useCurrentAuthorStore } from "../../../lib/store/currentAuthorStore"
import { formatSummary } from "../../../lib/utils/textUtils"

const AuthorBio = () => {
  const { t } = useTranslation()
  const { currentAuthor } = useCurrentAuthorStore()
  const [isBioOpen, setIsBioOpen] = useState(false)

  return (
    <section className="mb-4 w-80">
      {currentAuthor.bio && (
        <div
          tabIndex={0}
          className={clsx(
            "collapse-arrow collapse cursor-pointer",
            "bg-base-100 border-base-300 mt-2 border shadow",
            isBioOpen ? "collapse-open" : "collapse-close"
          )}
        >
          <div className="collapse-title font-semibold" onClick={() => setIsBioOpen(!isBioOpen)}>
            {t("authorPage.bio")}
          </div>
          <div className="collapse-content">
            <p className="my-4 text-justify">
              {formatSummary(currentAuthor.bio, { formatType: "paragraphs" })}
            </p>
          </div>
        </div>
      )}
    </section>
  )
}

export default AuthorBio
