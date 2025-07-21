// React and React Router
import { useNavigate, useParams } from "react-router-dom"

// Third-party libraries
import { useTranslation } from "react-i18next"
import clsx from "clsx"

// Custom hooks and stores
import { useCurrentAuthorBooksStore } from "../../../lib/store/currentAuthorBooksStore"

// Components
import DetailsButton from "../../Shared/Buttons/DetailsButton"

function AuthorBooks({ loadedImages, handleImageLoad }) {
  const { t } = useTranslation()
  const { lang } = useParams()

  const navigate = useNavigate()

  const currentAuthorBooks = useCurrentAuthorBooksStore((state) => state.currentAuthorBooks)

  const handleBookDetailsClick = (book) => {
    navigate(`/${lang}/book/${book.slug}`)
  }

  return (
    <section className="flex w-80 flex-col gap-2">
      <h2 className="font-semibold">{t("authorPage.books")} :</h2>
      {currentAuthorBooks.length > 0 && (
        <div>
          <ul className="list bg-base-100 rounded-box border-base-300 mb-4 border-1">
            {currentAuthorBooks.map((book) => (
              <li className="list-row items-center" key={book._id}>
                <div className="relative">
                  {!loadedImages[book._id] && <div className="skeleton absolute size-10"></div>}
                  <img
                    className={clsx("rounded-box size-10", !loadedImages[book._id] && "invisible")}
                    src={book.coverBookImage}
                    alt={book.title}
                    onLoad={() => handleImageLoad(book._id)}
                  />
                </div>
                <div>
                  <div className="font-semibold">{book.title}</div>
                </div>
                <DetailsButton
                  onClick={() => handleBookDetailsClick(book)}
                  ariaLabel="View book details"
                />
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  )
}

export default AuthorBooks
