import clsx from "clsx"

function Pagination({ currentPage, totalPages, onPageChange, className }) {
  return (
    <div className={clsx("join flex w-full justify-center", className)}>
      <button
        className="join-item btn"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        «
      </button>
      <button className="join-item btn">
        Page {currentPage}/{totalPages}
      </button>
      <button
        className="join-item btn"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        »
      </button>
    </div>
  )
}

export default Pagination
