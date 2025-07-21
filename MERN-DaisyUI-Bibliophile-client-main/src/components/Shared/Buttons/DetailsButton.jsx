function DetailsButton({ onClick, ariaLabel = "View details" }) {
  return (
    <button className="btn btn-square btn-ghost" onClick={onClick} aria-label={ariaLabel}>
      <svg className="size-[1.2em]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
        <g
          strokeLinejoin="round"
          strokeLinecap="round"
          strokeWidth="2"
          fill="none"
          stroke="currentColor"
        >
          <path d="M6 3L20 12 6 21 6 3z"></path>
        </g>
      </svg>
    </button>
  )
}

export default DetailsButton
