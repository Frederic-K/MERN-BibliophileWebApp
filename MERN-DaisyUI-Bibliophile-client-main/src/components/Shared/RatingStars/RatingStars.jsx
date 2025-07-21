import clsx from "clsx"

const RatingStars = ({ rating = 0, className = "", activeColor = "", inactiveColor = "" }) => {
  return (
    <div className={clsx("rating", className)}>
      {[...Array(5)].map((_, index) => (
        <div
          key={index}
          className={clsx("mask mask-star-2", index < rating ? activeColor : inactiveColor)}
          aria-label={`${index + 1} star`}
          aria-current={index + 1 === rating ? "true" : "false"}
        ></div>
      ))}
    </div>
  )
}

export default RatingStars
