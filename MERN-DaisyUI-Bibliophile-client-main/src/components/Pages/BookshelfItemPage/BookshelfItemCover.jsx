import clsx from "clsx"
import { useCurrentBookshelfItemStore } from "../../../lib/store/currentBookshelfItemStore"
import { useNavigationUtils } from "../../../lib/hooks/useNavigation"
import RatingStars from "../../Shared/RatingStars/RatingStars"
import FavoriteStatus from "../../Shared/FavoriteStatus/FavoriteStatus"
import ReadStatus from "../../Shared/ReadStatus/ReadStatus"
import BackButton from "../../Shared/Buttons/BackButton"

function BookshelfItemCover({ loadedImages, handleImageLoad }) {
  const currentBookshelfItem = useCurrentBookshelfItemStore((state) => state.currentBookshelfItem)

  const { handleBackClick } = useNavigationUtils()

  if (!currentBookshelfItem) return null

  return (
    <section className="relative mt-8 h-[480px] w-80 shadow-lg">
      {!loadedImages[currentBookshelfItem._id] && (
        <div className="skeleton h-[480px] w-80 rounded-lg shadow-lg"></div>
      )}
      <img
        className={clsx(
          "h-full w-full rounded-lg object-cover",
          !loadedImages[currentBookshelfItem._id] && "invisible"
        )}
        src={currentBookshelfItem.bookDetails.coverBookImage}
        alt={currentBookshelfItem.bookDetails.title}
        onLoad={() => handleImageLoad(currentBookshelfItem._id)}
      />
      <BackButton
        onClick={handleBackClick}
        buttonClassName={"absolute top-2 right-2"}
        iconClassName={"size-4"}
      />
      <div className="absolute top-2 left-4 flex flex-col gap-2">
        <RatingStars
          rating={currentBookshelfItem.rating}
          className="rating-xs"
          activeColor="bg-primary"
          inactiveColor="bg-base-300"
        />
      </div>
      <FavoriteStatus
        isFavorite={currentBookshelfItem.isFavorite}
        containerClassName={"absolute right-12 bottom-2"}
        iconClassName={"text-primary size-6"}
      />
      <div className="absolute right-4 bottom-2">
        <ReadStatus status={currentBookshelfItem.readStatus} className={"text-primary size-6"} />
      </div>
    </section>
  )
}

export default BookshelfItemCover
