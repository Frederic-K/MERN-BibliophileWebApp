import clsx from "clsx"
import { formatSummary } from "../../../lib/utils/textUtils"
import RatingStars from "../../Shared/RatingStars/RatingStars"
import ReadStatus from "../../Shared/ReadStatus/ReadStatus"

const BookshelfCard = ({ item, loadedImages, handleImageLoad, openItemPage }) => {
  return (
    <div
      className="card card-side bg-base-100 border-base-300/50 group flex h-36 w-80 cursor-pointer border-1 shadow-md transition-all duration-200 ease-in-out hover:shadow-lg"
      onClick={() => openItemPage(item)}
    >
      <figure className="relative w-1/3">
        {!loadedImages[item.bookDetails._id] && <div className="skeleton absolute h-full w-full" />}
        <img
          src={item.bookDetails.coverBookImage}
          alt={item.bookDetails.title}
          className={clsx(
            "h-full object-cover",
            loadedImages[item.bookDetails._id] ? "block" : "hidden"
          )}
          onLoad={() => handleImageLoad(item.bookDetails._id)}
        />
      </figure>
      <div className="card-body w-2/3 p-3">
        <h2 className="card-title group-hover:text-primary mr-5 line-clamp-2 text-sm font-bold">
          {item.bookDetails.title}
        </h2>
        <p className="text-justify text-xs">
          {formatSummary(item.bookDetails.summary, {
            maxLength: 90,
            formatType: "truncate",
          })}
        </p>
        <div className="flex items-center justify-between gap-1">
          {item.authorDetails.length > 0
            ? item.authorDetails.map((author) => (
                <span className="truncate text-xs font-semibold" key={author._id}>
                  {author.lastName}, {author.firstName}
                </span>
              ))
            : "Unknown Author"}
          <RatingStars rating={item.rating} className="rating-xs" />
        </div>
      </div>
      <div className="absolute top-0 right-0 m-2">
        <ReadStatus status={item.readStatus} className={"size-6"} />
      </div>
    </div>
  )
}

export default BookshelfCard
