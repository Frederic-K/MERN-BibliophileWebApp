import clsx from "clsx"
import RatingStars from "../../Shared/RatingStars/RatingStars"
import FavoriteStatus from "../../Shared/FavoriteStatus/FavoriteStatus"
import ReadStatus from "../../Shared/ReadStatus/ReadStatus"
import InformationButton from "../../Shared/Buttons/InformationButton"

const BookshelfitemCard = ({
  item,
  loadedImages,
  handleImageLoad,
  handleDetailsOpen,
  isEditFormOpen,
}) => {
  return (
    <div className="relative h-[480px] w-80 shadow-lg">
      {!loadedImages[item.bookDetails._id] && (
        <div className="skeleton h-full w-full rounded-lg shadow-lg"></div>
      )}
      <img
        src={item.bookDetails.coverBookImage}
        alt={item.bookDetails.title}
        className={clsx(
          "h-full w-full rounded-lg object-cover",
          !loadedImages[item.bookDetails._id] && "invisible"
        )}
        onLoad={() => handleImageLoad(item.bookDetails._id)}
      />
      <div className="text-primary absolute bottom-0 w-full rounded-lg bg-gradient-to-t from-black/85 from-90% to-transparent p-4">
        <div className="mt-2 mb-2 flex items-center justify-between">
          <RatingStars
            rating={item.rating}
            className="rating-xs"
            activeColor="bg-primary"
            inactiveColor="bg-base-300"
          />
          <div className="flex">
            <FavoriteStatus
              isFavorite={item.isFavorite}
              containerClassName={"flex items-center"}
              iconClassName={"text-primary size-6"}
            />
            <ReadStatus status={item.readStatus} className={"text-primary size-6"} />
          </div>
        </div>
        <div className="flex w-72 justify-between gap-4">
          <div className="text-md flex w-full items-center justify-between gap-2">
            <h2 className="font-bold">
              {item.bookDetails.title.length > 20
                ? `${item.bookDetails.title.substring(0, 20)}...`
                : item.bookDetails.title}
            </h2>
            <ul className="flex flex-col">
              {item.authorDetails.map((author) => (
                <li key={author._id}>
                  {`${author.lastName.charAt(0)}. ${author.firstName.charAt(0)}.`}
                </li>
              ))}
            </ul>
          </div>
          <InformationButton
            onClick={() => handleDetailsOpen(item)}
            className={(isEditFormOpen === item._id && "hidden", "btn-primary btn-circle size-6")}
          />
        </div>
      </div>
    </div>
  )
}

export default BookshelfitemCard
