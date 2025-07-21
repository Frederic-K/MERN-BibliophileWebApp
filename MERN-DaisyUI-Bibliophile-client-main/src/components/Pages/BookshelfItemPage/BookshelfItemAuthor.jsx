import { useCurrentBookshelfItemStore } from "../../../lib/store/currentBookshelfItemStore"

function BookshelfItemAuthor() {
  const currentBookshelfItem = useCurrentBookshelfItemStore((state) => state.currentBookshelfItem)

  if (!currentBookshelfItem) return null

  return (
    <section className="w-80">
      <h1 className="mt-2 text-center text-xl font-bold">{currentBookshelfItem.title}</h1>
      <ul className="flex flex-col items-center justify-center">
        {currentBookshelfItem?.authorDetails?.map((author) => (
          <li key={author._id || author.lastName || author.firstName}>
            {author.lastName && author.firstName
              ? `${author.lastName}, ${author.firstName}`
              : author.lastName || author.firstName || "Unknown Author"}
          </li>
        ))}
      </ul>
    </section>
  )
}

export default BookshelfItemAuthor
