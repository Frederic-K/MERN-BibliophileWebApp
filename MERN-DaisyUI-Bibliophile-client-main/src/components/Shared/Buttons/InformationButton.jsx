import clsx from "clsx"

const InformationButton = ({ onClick, className }) => {
  return (
    <button className={clsx("btn", className)} onClick={onClick}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth="1.5"
        stroke="currentColor"
        className="size-6"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M13 16h-1v-4h-1m1-4h.01M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2Z"
        />
      </svg>
    </button>
  )
}

export default InformationButton
