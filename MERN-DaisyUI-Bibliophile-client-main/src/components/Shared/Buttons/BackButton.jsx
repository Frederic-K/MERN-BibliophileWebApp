import clsx from "clsx"

const BackButton = ({ onClick, buttonClassName, iconClassName }) => (
  <button onClick={onClick} className={clsx("btn", buttonClassName)} aria-label="Go back">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth="1.5"
      stroke="currentColor"
      className={iconClassName}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
    </svg>
  </button>
)

export default BackButton
