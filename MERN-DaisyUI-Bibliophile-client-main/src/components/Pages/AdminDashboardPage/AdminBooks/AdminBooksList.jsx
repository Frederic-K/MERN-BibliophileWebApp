import clsx from "clsx"
import DetailsButton from "../../../Shared/Buttons/DetailsButton"

function AdminBooksList({ books, onBookClick, loadedImages, handleImageLoad }) {
  return (
    <ul className="list bg-base-100 rounded-box border-base-300/50 border-1 shadow-md">
      {books.map((book) => (
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
            <div className="text-xs font-semibold opacity-60">
              {book.authors && book.authors.length > 0
                ? book.authors
                    .map((author) =>
                      author.lastName && author.firstName
                        ? `${author.lastName}, ${author.firstName}`
                        : author.lastName || author.firstName || "Unknown"
                    )
                    .join(", ")
                : "Unknown Author"}
            </div>
          </div>
          <DetailsButton
            onClick={(e) => {
              e.stopPropagation()
              onBookClick(book)
            }}
            ariaLabel="View book details"
          />
        </li>
      ))}
    </ul>
  )
}

export default AdminBooksList
